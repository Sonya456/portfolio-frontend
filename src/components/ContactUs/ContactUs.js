import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactUs.css';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const token = localStorage.getItem('token'); // Ensure the token is available

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/contacts/', {
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, subject, message };

    try {
      await axios.post('http://localhost:8000/api/contact_messages/', data);
      setSuccessMessage('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      setErrorMessage('There was an error sending your message. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const contactData = { name: editName, phone: editPhone, email: editEmail };

    try {
      await axios.put(`http://localhost:8000/api/contacts/${currentContactId}/`, contactData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccessMessage('Contact updated successfully!');
      fetchContacts();
      setIsEditing(false);
      setCurrentContactId(null);
      setEditName('');
      setEditPhone('');
      setEditEmail('');
    } catch (error) {
      setErrorMessage('There was an error updating the contact. Please try again.');
    }
  };

  const handleEdit = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditEmail(contact.email);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/contacts/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchContacts();
      setSuccessMessage('Contact deleted successfully!');
    } catch (error) {
      setErrorMessage('There was an error deleting the contact. Please try again.');
    }
  };

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Subject:
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </label>
          <label>
            Message:
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <button type="submit">Send Message</button>
        </form>
        <div className="contact-details">
          <h3>Our Contact Details</h3>
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <p><strong>Name:</strong> {contact.name}</p>
              <p><strong>Phone:</strong> {contact.phone}</p>
              <p><strong>Email:</strong> {contact.email}</p>
              {token && (
                <div className="contact-actions">
                  <button onClick={() => handleEdit(contact)}>Edit</button>
                  <button onClick={() => handleDelete(contact.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
          {isEditing && (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <h3>Edit Contact</h3>
              <label>
                Name:
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Update Contact</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ContactUs;