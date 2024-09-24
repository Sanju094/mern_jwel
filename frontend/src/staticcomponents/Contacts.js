import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); 
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    alert('Message submitted successfully!');
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif', 
      color: '#333', 
      animation: 'fadeIn 1s ease-in' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        fontSize: '1.5rem', 
        marginBottom: '1.5rem', 
        animation: 'fadeIn 1s ease-in' 
      }}>Contact Us</h2>
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        animation: 'slideIn 1s ease-in' 
      }}>
        <div style={{ 
          marginBottom: '1rem', 
          animation: 'slideIn 1s ease-in' 
        }}>
          <label htmlFor="name" style={{ 
            marginBottom: '0.5rem', 
            fontSize: '1.1rem', 
            animation: 'slideIn 1s ease-in' 
          }}>Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} style={{ 
            padding: '0.5rem', 
            borderRadius: '5px', 
            border: '1px solid #ccc', 
            animation: 'slideIn 1s ease-in' 
          }} />
        </div>
        <div style={{ 
          marginBottom: '1rem', 
          animation: 'slideIn 1s ease-in' 
        }}>
          <label htmlFor="email" style={{ 
            marginBottom: '0.5rem', 
            fontSize: '1.1rem', 
            animation: 'slideIn 1s ease-in' 
          }}>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ 
            padding: '0.5rem', 
            borderRadius: '5px', 
            border: '1px solid #ccc', 
            animation: 'slideIn 1s ease-in' 
          }} />
        </div>
        <div style={{ 
          marginBottom: '1rem', 
          animation: 'slideIn 1s ease-in' 
        }}>
          <label htmlFor="message" style={{ 
            marginBottom: '0.5rem', 
            fontSize: '1.1rem', 
            animation: 'slideIn 1s ease-in' 
          }}>Message:</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} style={{ 
            padding: '0.5rem', 
            borderRadius: '5px', 
            border: '1px solid #ccc', 
            minHeight: '100px', 
            animation: 'slideIn 1s ease-in' 
          }}></textarea>
        </div>
        <button type="submit" style={{ 
          padding: '0.5rem', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          borderRadius: '5px', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          animation: 'slideIn 1s ease-in' 
        }}>Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;