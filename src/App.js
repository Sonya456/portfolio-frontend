import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProjectList from './components/ProjectList/ProjectList';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import AddProject from './components/AddProject/AddProject';
import Login from './components/Login/Login';
import AddElements from './components/AddElements/AddElements';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AboutUs from './components/AboutUs/AboutUs';
import AboutUsForm from './components/AboutUsForm/AboutUsForm';
import ContactUs from './components/ContactUs/ContactUs';
import ContactForm from './components/ContactForm/ContactForm';


import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="App">
        <Header token={token} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/add-elements/:projectId" component={AddElements} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route
            path="/add-project"
            element={token ? <AddProject /> : <Navigate to="/login" />}
          />
          <Route
            path="/contact-form"
            element={token ? <ContactForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/about-form"
            element={token ? <AboutUsForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/about" element={<div>About Us Content</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
