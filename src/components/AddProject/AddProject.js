import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProject.css';

const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [defaultImage, setDefaultImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [currentFont, setCurrentFont] = useState('Arial');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const FONT_CHOICES = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana'
  ];

  const handleImageChange = (e) => {
    setDefaultImage(e.target.files[0]);
  };

  const handleAddText = () => {
    if (currentText.trim() === '') return;
    setElements([...elements, { type: 'text', content: currentText, font: currentFont }]);
    setCurrentText('');
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setElements([...elements, { type: 'image', content: '', image: file, font: currentFont }]);
    setCurrentImage(null); // Reset the file input
  };

  const handleRemoveElement = (index) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (defaultImage) {
      formData.append('default_image', defaultImage);
    }

    try {
      const projectResponse = await axios.post('http://localhost:8000/api/projects/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      const projectId = projectResponse.data.id;

      const elementsFormData = new FormData();
      const elementsData = elements.map(element => {
        if (element.type === 'image') {
          return { type: 'image', content: '', font: element.font };
        }
        return element;
      });

      elementsFormData.append('elements', JSON.stringify(elementsData));

      elements.forEach((element, index) => {
        if (element.type === 'image') {
          elementsFormData.append(`elements[${index}][image]`, element.image);
        }
      });

      await axios.post(`http://localhost:8000/api/projects/${projectId}/add_elements/`, elementsFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert('Project and elements added successfully');
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('There was an error adding the project and elements!', error);
    }
  };

  return (
    <div className="add-project-with-elements">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Default Image:
          <input type="file" onChange={handleImageChange} />
        </label>
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
          <button type="button" onClick={handleAddText}>Add Text</button>
          <input type="file" accept="image/*" onChange={handleAddImage} />
        </div>
        <button type="submit">Submit Project</button>
      </form>
      <div className="elements-preview">
        {elements.map((element, index) => (
          <div key={index} className="element-preview" style={{ fontFamily: element.font }}>
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

export default AddProject;
