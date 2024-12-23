// src/modules/components/CarCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/component/CarCard.css';

const CarCard = ({ car, onStatusChange, onDeleteClick, onViewClick }) => {
    const [isAvailable, setIsAvailable] = useState(car.CarStatus === 'Idle');
    const navigate = useNavigate();

    useEffect(() => {
        setIsAvailable(car.CarStatus === 'Idle');
    }, [car.CarStatus]);

    
    const handleToggle = async () => {
        const newStatus = isAvailable ? 'Closed' : 'Idle';
        setIsAvailable(!isAvailable);
        try {
            const response = await axios.put(`http://localhost:5000/api/cars/${car.CarID}`, {
                newStatus: newStatus,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                onStatusChange(car.CarID, newStatus);
            }
        } catch (error) {
            console.error('Failed to update car status:', error);
        }
    };


    const handleViewFeedback = () => {
        navigate(`/feedback`, { state: { carId: car.CarID } });
    };


    return (
        <div className={`car-card ${isAvailable ? 'available' : 'unavailable'}`}>
            <div className="car-image">
                <img src={process.env.PUBLIC_URL + car.CarImage} alt={car.CarName} />
            </div>
            <div className="car-info">
                <h2>{car.CarName}</h2>
                <div className="car-rating">
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= car.Rate ? 'filled' : 'empty'}
                            >
                                {star <= car.Rate ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span className={`status ${car.CarStatus.toLowerCase()}`}>
                        Status: {car.CarStatus || 'Unknown'}
                    </span>
                </div>
                <div className="car-details">
                    <span>Type: {car.CarType}</span>
                    <span>Seats: {car.Seats}</span>
                    <span>Gear: {car.Gear}</span>
                    <span>Fuel: {car.Fuel}</span>
                </div>
                <div className="car-actions">
                    <button className="view-car-btn" onClick={onViewClick}>View Car</button>
                    <button className="view-car-btn" onClick={handleViewFeedback}>Feedback</button>                    
                {car.CarStatus !== 'Renting' && (
                    <>                    
                    <button className="delete-car-btn" onClick={() => onDeleteClick(car.CarID)}>Delete Car</button>
                    <label className="switch">
                        <input type="checkbox" checked={isAvailable} onChange={handleToggle} />
                        <span className="slider round"></span>
                    </label>
                    </>
                )}
                    
                </div>
            </div>
        </div>
    );
};

export default CarCard;
