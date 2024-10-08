import React, { useState, useEffect } from "react";
import "../../styles/home/home.css";
import carData from "../../assets/data/carData";
import CarPlot from "../../modules/components/CarPlot";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://wallpapersmug.com/download/2048x1152/6906f8/bmw-car-headlight.jpg",
    "https://thuexeincar.net/wp-content/uploads/2018/12/86579d751e8a73c.jpg",
    "https://png.pngtree.com/thumb_back/fh260/background/20210205/pngtree-car-banner-background-image_547203.jpg",
    "https://img.pikbest.com/background/20220119/car-banner-background_6224454.jpg!sw800",
  ];
  const showImage = (index) => {
    setCurrentIndex(index);
  };

  const showNextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(showNextImage, 3000);
    return () => clearInterval(interval);
  });
  // const CarDetail = ({ id }) => ({
  // const cars = [
  //   {
  //     imageUrl:
  //       "https://vcdn1-vnexpress.vnecdn.net/2020/12/24/Toyota-Land-Cruiser-VnExpress-19-1608795637.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=-syfotVQ_sAy4i0cFIIkDQ",
  //     name: "Toyota Land Cruiser V8",
  //     details: "4 Seats • SUV • Auto",
  //     price: "1.000.000 vnd",
  //   },
  //   {
  //     imageUrl: "https://katavina.com/uploaded/tin/BMW-i8/BMW-i8.jpg",
  //     name: "BMW I8",
  //     details: "2 Seats • SUV • Auto",
  //     price: "4.000.000 vnd",
  //   },
  //   {
  //     imageUrl:
  //       "https://xehay.vn/uploads/images/2022/9/01/xehay-ford%20mustang-01092022-1.jpg",
  //     name: "Ford Mustang",
  //     details: "4 Seats • SUV • Auto",
  //     price: "3.000.000 vnd",
  //   },
  //   {
  //     imageUrl:
  //       "https://fordlongbien.com/wp-content/uploads/2017/08/Ford-Everest-2023-fordlongbien_com-19.jpg",
  //     name: "Ford Everest",
  //     details: "7 Seats • SUV • Auto",
  //     price: "2.000.000 vnd",
  //   },
  // ];
  //
  return (
    <div className="home-container">
      <div className="header-home">
        <div className="logo">
          <div className="header-logo">
            <a href="../">
              <i className="fas fa-car"></i> Cardio
            </a>
          </div>
        </div>
        <div className="navbar">
          <a href="./">Home</a>
          <a href="./">About Us</a>
          <a href="./">Your Renting Car</a>
        </div>
        <div className="user">
          <i className="fas fa-user-circle"></i>

          <a href="../login"> Login</a>
        </div>
      </div>
      {/* Advertisement section */}
      <div className="advertisement">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Advertisement ${index + 1}`}
            className={index === currentIndex ? "active" : ""}
          />
        ))}
        <div className="dots">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => showImage(index)}
            />
          ))}
        </div>
      </div>
      {/* show car */}
      <div className="popular-cars">
        <h2>Popular Cars</h2>
        <div className="car-list">
          {<CarPlot item={carData.find((item) => item.id === 1)} />}
          {<CarPlot item={carData.find((item) => item.id === 2)} />}
          {<CarPlot item={carData.find((item) => item.id === 3)} />}
          {<CarPlot item={carData.find((item) => item.id === 4)} />}
        </div>
      </div>

      <div className="rent-now">
        <img
          src="https://storage.googleapis.com/a1aa/image/uuufUh0pGjQRPCfpPXZ6GUv1smHoCX44eeSKmO93eAoeqOP5E.jpg"
          alt="Toyota land cruiser V8"
          height="200"
          width="300"
        />
        <div className="content">
          <h2>Don’t Have a Car? Rent a Car Right Away!</h2>
          <p>
            Immerse yourself in a world of possibilities with our extensive
            range of vehicles. From sleek sedans to rugged SUVs and luxurious
            convertibles, we have the perfect wheels to match your style,
            preferences, and the demands of your adventure.
          </p>
          <button className="rent-button">
            <a href="./carlist">Rent Now</a>
          </button>
        </div>
      </div>

      <div className="about">
        <h2>About Our Company</h2>
        <button className="about-button">
          <a href="./">About Us</a>
        </button>
      </div>
    </div>
  );
}

export default Home;
