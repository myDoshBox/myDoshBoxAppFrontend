import React, { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={goToPrevSlide}>
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M27.5 55C42.6878 55 55 42.6878 55 27.5C55 12.3122 42.6878 0 27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6878 12.3122 55 27.5 55Z"
            fill="#09FFB2"
          />
          <path
            d="M30.9643 39.2714C30.4418 39.2714 29.9193 39.0789 29.5068 38.6664L19.7993 28.9589C19.0018 28.1614 19.0018 26.8414 19.7993 26.0439L29.5068 16.3364C30.3043 15.5389 31.6243 15.5389 32.4218 16.3364C33.2193 17.1339 33.2193 18.4539 32.4218 19.2514L24.1718 27.5014L32.4218 35.7514C33.2193 36.5489 33.2193 37.8689 32.4218 38.6664C32.0368 39.0789 31.5143 39.2714 30.9643 39.2714Z"
            fill="white"
          />
        </svg>
      </button>
      <img
        className="carousel-image"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
      />
      <button className="carousel-button next" onClick={goToNextSlide}>
        <svg
          width="66"
          height="66"
          viewBox="0 0 66 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M33 60.5C48.1878 60.5 60.5 48.1878 60.5 33C60.5 17.8122 48.1878 5.5 33 5.5C17.8122 5.5 5.5 17.8122 5.5 33C5.5 48.1878 17.8122 60.5 33 60.5Z"
            fill="#09FFB2"
          />
          <path
            d="M29.5341 44.7714C29.0116 44.7714 28.4891 44.5789 28.0766 44.1664C27.2791 43.3689 27.2791 42.0489 28.0766 41.2514L36.3266 33.0014L28.0766 24.7514C27.2791 23.9539 27.2791 22.6339 28.0766 21.8364C28.8741 21.0389 30.1941 21.0389 30.9916 21.8364L40.6991 31.5439C41.4966 32.3414 41.4966 33.6614 40.6991 34.4589L30.9916 44.1664C30.5791 44.5789 30.0566 44.7714 29.5341 44.7714Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;
