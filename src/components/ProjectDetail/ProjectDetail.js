import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [elements, setElements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [defaultImage, setDefaultImage] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
  const [font, setFont] = useState('Arial');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/projects/${id}/`);
        setProject(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setFont(response.data.font);

        const elementsResponse = await axios.get(`http://localhost:8000/api/projects/${id}/get_elements/`);
        setElements(elementsResponse.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProject();
  }, [id]);

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('font', font);
    if (defaultImage) {
      formData.append('default_image', defaultImage);
    }

    try {
      await axios.put(`http://localhost:8000/api/projects/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Project updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/projects/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Project deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditElement = (element) => {
    setEditingElement(element);
  };

  const handleSaveElement = async () => {
    if (!editingElement) return;

    const formData = new FormData();
    formData.append('type', editingElement.type);
    formData.append('content', editingElement.content || '');
    formData.append('font', editingElement.font);
    if (editingElement.image) {
      formData.append('image', editingElement.image);
    }

    try {
      await axios.put(`http://localhost:8000/api/projects/${id}/update_element/${editingElement.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Element updated successfully');
      setEditingElement(null);
      // Refresh elements
      const elementsResponse = await axios.get(`http://localhost:8000/api/projects/${id}/get_elements/`);
      setElements(elementsResponse.data);
    } catch (error) {
      console.error('Error updating element:', error);
    }
  };

  const handleDeleteElement = async (elementId) => {
    try {
      await axios.delete(`http://localhost:8000/api/projects/${id}/delete_element/${elementId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Element deleted successfully');
      // Refresh elements
      const elementsResponse = await axios.get(`http://localhost:8000/api/projects/${id}/get_elements/`);
      setElements(elementsResponse.data);
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-detail">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setDefaultImage(e.target.files[0])}
          />
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          {project.default_image && <img src={`${project.default_image}`} alt={project.title} />}
          {token && (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}

      {elements.length > 0 ? (
        elements.map((element, index) => (
          <div key={index} className="project-element" style={{ fontFamily: element.font }}>
            {editingElement && editingElement.id === element.id ? (
              <div>
                {element.type === 'text' && (
                  <textarea
                    value={editingElement.content}
                    onChange={(e) => setEditingElement({ ...editingElement, content: e.target.value })}
                  />
                )}
                {element.type === 'image' && (
                  <input
                    type="file"
                    onChange={(e) => setEditingElement({ ...editingElement, image: e.target.files[0] })}
                  />
                )}
                <select
                  value={editingElement.font}
                  onChange={(e) => setEditingElement({ ...editingElement, font: e.target.value })}
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
                <button onClick={handleSaveElement}>Save</button>
                <button onClick={() => setEditingElement(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {element.type === 'text' && <p>{element.content}</p>}
                {element.type === 'image' && <img src={`http://localhost:8000/${element.image}`} alt={`Element ${index}`} />}
                {token && (
                  <div>
                    <button onClick={() => handleEditElement(element)}>Edit</button>
                    <button onClick={() => handleDeleteElement(element.id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No elements available</p>
      )}
    </div>
  );
};

export default ProjectDetail;
