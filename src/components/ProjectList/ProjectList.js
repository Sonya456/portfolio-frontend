import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="project-list">
      <h2>Projects</h2>
      {projects.map((project) => (
        <div key={project.id} className="project-item">
          <h3>
            <Link to={`/projects/${project.id}`}>{project.title}</Link>
          </h3>
          {project.default_image ? (
            <img src={`${project.default_image}`} alt={project.title} />
          ) : (
            <p>No image available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
