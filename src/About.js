import React from 'react';
import './About.css'; 

const About = () => {
  return (
    <div className="aboutContainer">
      <div className="aboutText">
        <h1>About Us</h1>
        <p>Hi everyone, our names are Micah, Hisham, Theo, and Memphis. 
            We want to build this app in order to help high school students like us</p>
      </div>
      <div className="aboutImage">
        <img src="imgs/image.jpg" alt="Image" />
      </div>
    </div>
  );
};

export default About;