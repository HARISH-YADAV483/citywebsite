import React, { useEffect, useState } from 'react';
import './FlowerRain.css';

const FlowerRain = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate petals with random properties
    const generatePetals = () => {
      const newPetals = [];
      const numPetals = 40; // Adjust for density
      for (let i = 0; i < numPetals; i++) {
        // Random values
        const left = Math.random() * 100; // vw
        const duration = Math.random() * 8 + 6; // 6s to 14s
        const delay = Math.random() * 10; // 0s to 10s
        const size = Math.random() * 10 + 10; // 10px to 20px
        const endX = (Math.random() - 0.5) * 50; // -25vw to 25vw

        newPetals.push({
          id: i,
          left: `${left}vw`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`, // Negative delay so some start on screen
          size: `${size}px`,
          opacity: Math.random() * 0.4 + 0.4, // 0.4 to 0.8
          endX: `${endX}vw`,
          colorClass: Math.random() > 0.5 ? 'petal-light' : 'petal-dark',
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  return (
    <div className="flower-rain-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`petal ${petal.colorClass}`}
          style={{
            left: petal.left,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            '--end-x': petal.endX
          }}
        ></div>
      ))}
    </div>
  );
};

export default FlowerRain;
