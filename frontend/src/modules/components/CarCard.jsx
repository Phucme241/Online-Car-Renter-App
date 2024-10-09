// CarCard.js
import React, { useState, useEffect } from 'react';
import '../../styles/component/CarCard.css';

const CarCard = ({ car, onStatusChange }) => {
    const [isAvailable, setIsAvailable] = useState(car.status === 'Idle');

    useEffect(() => {
        setIsAvailable(car.status === 'Idle');
    }, [car.status]);

    const handleToggle = () => {
        // Toggle the status and set it locally
        const newStatus = isAvailable ? 'Closed' : 'Idle'; // Change status accordingly
        setIsAvailable(!isAvailable); // Update availability
        onStatusChange(car.id, newStatus); // Inform parent about the status change
    };

    return (
        <div className={`car-card ${isAvailable ? 'available' : 'unavailable'}`}>
            <div className="car-image">
                <img src={car.imgUrl} alt={car.name} />
            </div>
            <div className="car-info">
                <h2>{car.carName}</h2>
                <div className="car-rating">
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= (car.rating) ? 'filled' : 'empty'}
                            >
                                {star <= ( car.rating) ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span className={`status ${car.status.toLowerCase()}`}>
                        Status: {car.status}
                    </span>
                </div>
                <div className="car-details">
                    <span>Type: {car.type}</span>
                    <span>Seats: {car.seat}</span>
                    <span>Gear: {car.gear}</span>
                    <span>Fuel: {car.fuel}</span>
                </div>
                <div className="car-actions">
                    <button className="view-car-btn">View Car</button>
                    <button className="delete-car-btn">Delete Car</button>
                    <label className="switch">
                        <input type="checkbox" checked={isAvailable} onChange={handleToggle} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
