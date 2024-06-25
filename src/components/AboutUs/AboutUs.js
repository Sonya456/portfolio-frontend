import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AboutUs.css';

const AboutUs = () => {
  const [elements, setElements] = useState([]);
  const [editingElement, setEditingElement] = useState(null);
  const [currentContent, setCurrentContent] = useState('');
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentFontSize, setCurrentFontSize] = useState(14);
  const token = localStorage.getItem('token');

  const FONT_CHOICES = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana'
  ];

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/about_elements/');
        setElements(response.data);
      } catch (error) {
        console.error('Error fetching about us elements:', error);
      }
    };

    fetchElements();
  }, []);

  const handleEditElement = (element) => {
    setEditingElement(element);
    setCurrentContent(element.content);
    setCurrentFont(element.font);
    setCurrentFontSize(element.font_size);
  };

  const handleSaveElement = async () => {
    if (!editingElement) return;

    const formData = new FormData();
    formData.append('type', editingElement.type);
    formData.append('content', currentContent || '');
    formData.append('font', currentFont);
    formData.append('font_size', currentFontSize);

    if (editingElement.image) {
      formData.append('image', editingElement.image);
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/about_elements/${editingElement.id}/update_element/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Element updated successfully');
      setEditingElement(null);
      // Refresh elements
      const elementsResponse = await axios.get('http://localhost:8000/api/about_elements/');
      setElements(elementsResponse.data);
    } catch (error) {
      console.error('Error updating element:', error.response ? error.response.data : error);
    }
  };

  const handleDeleteElement = async (elementId) => {
    try {
      await axios.delete(`http://localhost:8000/api/about_elements/${elementId}/delete_element/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Element deleted successfully');
      // Refresh elements
      const elementsResponse = await axios.get('http://localhost:8000/api/about_elements/');
      setElements(elementsResponse.data);
    } catch (error) {
      console.error('Error deleting element:', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="about-us">
      <h2>About Us</h2>
      <div className="about-content">
        {elements.map((element, index) => (
          <div key={index} className="about-element" style={{ fontFamily: element.font, fontSize: `${element.font_size}px` }}>
            {element.type === 'text' && <p>{element.content}</p>}
            {element.type === 'image' && (
              <img src={`${element.image}`} alt={`Element ${index}`} />
            )}
            {token && (
              <div className="element-actions">
                <button onClick={() => handleEditElement(element)}>Edit</button>
                <button onClick={() => handleDeleteElement(element.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingElement && (
        <div className="edit-element-form">
          <h3>Edit Element</h3>
          <textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
          />
          <select value={currentFont} onChange={(e) => setCurrentFont(e.target.value)}>
            {FONT_CHOICES.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          <input
            type="number"
            value={currentFontSize}
            onChange={(e) => setCurrentFontSize(parseInt(e.target.value))}
            placeholder="Font Size"
          />
          {editingElement.type === 'image' && (
            <input
              type="file"
              onChange={(e) => setEditingElement({ ...editingElement, image: e.target.files[0] })}
            />
          )}
          <button onClick={handleSaveElement}>Save</button>
          <button onClick={() => setEditingElement(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
