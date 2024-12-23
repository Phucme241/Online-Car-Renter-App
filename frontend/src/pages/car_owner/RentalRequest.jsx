import React, { useState, useEffect } from "react";
import axios from 'axios';
import RentalCard from "../../modules/components/RentalCard";
import ChooseBar from "../../modules/components/ChooseBarCarOwner";
import "../../styles/cars_owner/RentalRequest.css";
import { formatPrice, formatDate_String } from "../../assets/format/numberFormat";

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return 'Waiting to confirm';
    case 2:
      return 'Renting';
    case 3:
      return 'Renting';
    case 4:
      return 'Renting';
    case 5:
      return 'Renting';
    default:
      return 'Unknown';
  }
};



const RentalRequests = () => {

  const [filteredRentalRequests, setRentalRequest] = useState([]);
  const [Accid, setAccID] = useState(0);
  const [garageID, setGarageID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setAccID(storedUser.id);
    }

    if (storedUser.role !== 2) {
      setError("No permission for current feauture");
    }

    const fetchGarageData = async () => {
      try {
        if (Accid) {
          const responseGarage = await axios.get(`http://localhost:5000/api/garage/${Accid}`);
          if (responseGarage.data.length > 0) {
            setGarageID(responseGarage.data[0].GarageID); 
          } else {
            console.log("No garage found for this CarOwnerID");
          }
        }
      } catch (error) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchGarageData();
  }, [Accid]);

  useEffect(() => {
    const fetchRentalData = async () => {
      try {
        const [responseAccount, responseCar, responseRental] = await Promise.all([
          axios.get("http://localhost:5000/api/account"),
          axios.get("http://localhost:5000/api/car"),
          axios.get("http://localhost:5000/api/rental"),
        ]);

        const accountData = responseAccount.data || [];
        const carData = responseCar.data || [];
        const rentalData = responseRental.data || [];

        const filteredData = rentalData
          .map((rental) => {
            const customer = accountData.find(
              (customer) => customer.id === rental.CustomerID
            );
            const car = carData.find((car) => car.CarID === rental.CarID);

            if (car) {
              return {
                ...rental,
                carName: car.CarName,
                carId : car.CarID,
                price: car.Price,
                GarageID: car.GarageID,
                Customer: customer?.UserName || "Unknown Customer",
                CustomerID: customer?.id || null,
              };
            }
            return null;
          })
          .filter((rental) => rental && rental.GarageID === garageID && rental.RentalStatus !== 5);

        setRentalRequest(filteredData);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    };

    fetchRentalData();
  }, [garageID]);

  return (
    <div className="AllPage">
      <div className="LeftSide">
        <div className="Bar">
          <ChooseBar />
        </div>
      </div>
      <div className="RightSide">
        {error ? (
          <p className="Error">{error}</p>
        ) : (
          <div className="garage rentalReq">
            <h1>Rental Requests</h1>
            <div className="rental-requests">
              {filteredRentalRequests.map((request) => (
                <RentalCard
                  key={request.id}
                  request={{
                    car: request.carName,
                    carId: request.carId,
                    customerId: request.CustomerID,
                    customer: request.Customer,
                    status: getStatusLabel(request.RentalStatus),
                    bookDate: `${formatDate_String(request.RentalStart)}`,
                    timePeriod: `${formatDate_String(request.RentalStart)} To ${formatDate_String(request.RentalEnd)}`,
                    price: `${formatPrice(request.price)} VND`,
                    rentalId: request.RentalID,
                    isWaiting: request.status === 1,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequests;
