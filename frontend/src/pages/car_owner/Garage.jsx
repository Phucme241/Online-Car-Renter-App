import React, { useState, useEffect } from "react";
import axios from 'axios';
import ChooseBar from "../../modules/components/ChooseBarCarOwner";
import "../../styles/cars_owner/Garage.css";
import CarCard from "../../modules/components/CarCard";
import { useNavigate } from 'react-router-dom';
import carDemo from "../../assets/data/carDemo";

const Garage = ({ garageID }) => {
    const navigate = useNavigate();
    // const [cars, setCars] = useState([
    //     {
    //         id: 1,
    //         name: 'Lamborghini Revuelto',
    //         status: 'Idle',
    //         type: 'Mid-engine sports car',
    //         seats: 2,
    //         gear: 'Auto',
    //         fuel: 'Gasoline',
    //         rating: 5,
    //         imageUrl: 'https://www.mclarenlife.com/attachments/2024-lamborghini-aventador-successor-rendering-v1-jpg.228772/',
    //     },
    //     {
    //         id: 2,
    //         name: 'Bugatti Centodieci',
    //         status: 'Renting',
    //         type: 'Mid-engine sports car',
    //         seats: 2,
    //         gear: 'Auto',
    //         fuel: 'Gasoline',
    //         rating: 5,
    //         imageUrl: 'https://cdn.motor1.com/images/mgl/zxp3Jb/s3/bugatti-centodieci-2022-zehntes-und-letztes-exemplar.jpg',
    //     },
    //     {
    //         id: 3,
    //         name: 'Toyota Land Cruiser V8',
    //         status: 'Closed',
    //         type: 'SUV',
    //         seats: 4,
    //         gear: 'Auto',
    //         fuel: 'Gasoline',
    //         rating: 4.5,
    //         imageUrl: 'https://example.com/car1.jpg',
    //     },
    // ]);
    const [cars, setCars] = useState(carDemo);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCarData = async () => {
            const response = await axios.get("http://localhost:5000/api/car");
            const filteredCars = response.data.filter(car => car.GarageID === garageID);
            if (garageID === 0) {
                setCars(response.data)
            } else {
                setCars(filteredCars);
            }
        };

        fetchCarData();
    }, [garageID]);

    const handleAddCarClick = () => {
        navigate(`/car-registration/${garageID}`);
    };



    const handleStatusChange = (carId, newStatus) => {
        const updatedCars = cars.map((car) =>
            car.CarID === carId ? { ...car, CarStatus: newStatus } : car
        );
        setCars(updatedCars);
    };
    return (
        <div class="AllPage">
            <div class="LeftSide">
                <div class="Bar">
                    <ChooseBar />
                </div>

            </div>
            <div class="RightSide">
                <div class="garage">
                    <div className="header">
                        <h1>Garage</h1>
                        <button className="add-car-btn" onClick={handleAddCarClick}>Add New Car</button>
                    </div>
                    <div className="garageCarList">
                        {cars.map((car) => (
                            <CarCard key={car.id} car={car} onStatusChange={handleStatusChange} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Garage;
