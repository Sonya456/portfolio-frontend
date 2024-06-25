import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddElements.css';

const AddElements = () => {
  const { projectId } = useParams();
  const [elements, setElements] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleAddText = () => {
    if (currentText.trim() === '') return;
    setElements([...elements, { type: 'text', content: currentText }]);
    setCurrentText('');
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setElements([...elements, { type: 'image', content: '', image: file }]);
    setCurrentImage(null); // Reset the file input
  };

  const handleSubmit = async () => {
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
        console.log(`Appending image: elements[${index}][image]`, element.image);
      }
    });

    console.log('Form Data:', formData);

    try {
      const response = await axios.post(`http://localhost:8000/api/projects/${projectId}/add_elements/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log('Response:', response);
      alert('Elements added successfully');
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error adding elements:', error);
    }
  };

  return (
    <div className="add-elements">
      <h2>Add Elements</h2>
      <div className="element-form">
        <textarea
          placeholder="Enter text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
        />
        <button onClick={handleAddText}>Add Text</button>
        <input type="file" accept="image/*" onChange={handleAddImage} />
        <button onClick={handleSubmit}>Submit Elements</button>
      </div>
      <div className="elements-preview">
        {elements.map((element, index) => (
          <div key={index} className="element-preview">
            {element.type === 'text' && <p>{element.content}</p>}
            {element.type === 'image' && (
              <img src={URL.createObjectURL(element.image)} alt={`Element ${index}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddElements;
