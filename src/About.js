import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './About.css';

const About = () => {
  const textAnimation = useSpring({
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    config: { duration: 500 },
  });

  const imageAnimation = useSpring({
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    config: { duration: 500 },
  });

  return (
    <div className="aboutContainer">
      <animated.div style={textAnimation} className="aboutText">
        <h1>About Us</h1>
        <p>Hi everyone, our names are Micah, Hisham, Theo, and Memphis. 
            We want to build this app in order to help FGLI students by providing them with 360 Panorama experiences detailing 
            experiences of FGLI students. We hope that this app can give FGLI students some inspiration to help them carve out their own journey, and give them some valuable information in the college application process, such as financial aid.</p>
      </animated.div>
    </div>
  );
};

export default About;