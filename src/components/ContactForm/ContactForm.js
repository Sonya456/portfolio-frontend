import React, { useState } from 'react';
import axios from 'axios';
import './ContactForm.css';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const token = localStorage.getItem('token');  // Ensure the token is available

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contactData = { name, phone, email };

    try {
      await axios.post('http://localhost:8000/api/contacts/', contactData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the token in the headers
        },
      });
      alert('Contact added successfully');
      setName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.error('There was an error adding the contact!', error);
    }
  };

  return (
    <div className="contact-form">
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
};

export default ContactForm;
