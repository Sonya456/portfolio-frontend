import React, { useState } from 'react';
import axios from 'axios';
import './AboutUsForm.css';

const AboutUsForm = () => {
  const [elements, setElements] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
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

  const handleAddText = () => {
    if (currentText.trim() === '') return;
    setElements([...elements, { type: 'text', content: currentText, font: currentFont, fontSize: currentFontSize }]);
    setCurrentText('');
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setElements([...elements, { type: 'image', content: '', image: file }]);
    setCurrentImage(null); // Reset the file input
  };

  const handleRemoveElement = (index) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const elementsData = elements.map(element => {
      if (element.type === 'image') {
        return { type: 'image', content: '' };
      }
      return element;
    });

    formData.append('elements', JSON.stringify(elementsData));

    elements.forEach((element, index) => {
      if (element.type === 'image') {
        formData.append(`elements[${index}][image]`, element.image);
      }
    });

    try {
      await axios.post('http://localhost:8000/api/about_elements/add_elements/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert('Elements added successfully');
      // Redirect or refresh page
    } catch (error) {
      console.error('There was an error adding the elements!', error);
    }
  };

  return (
    <div className="about-us-form">
      <h2>Add Elements to About Us</h2>
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <div className="element-form">
          <textarea
            placeholder="Enter text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
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
          <button type="button" onClick={handleAddText}>Add Text</button>
          <input type="file" accept="image/*" onChange={handleAddImage} />
        </div>
        <button type="submit">Submit Elements</button>
      </form>
      <div className="elements-preview">
        {elements.map((element, index) => (
          <div key={index} className="element-preview" style={{ fontFamily: element.font, fontSize: `${element.fontSize}px` }}>
            {element.type === 'text' && <p>{element.content}</p>}
            {element.type === 'image' && (
              <img src={URL.createObjectURL(element.image)} alt={`Element ${index}`} />
            )}
            <button type="button" onClick={() => handleRemoveElement(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsForm;
