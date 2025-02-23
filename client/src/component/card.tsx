import React, { useState } from "react";

function Card() {
  const movies = [
    {
      id: 1,
      name: "Inception",
      category: "Sci-Fi",
      image:
        "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "Interstellar",
      category: "Sci-Fi",
      image:
        "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      name: "The Dark Knight",
      category: "Action",
      image:
        "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden">
      <div className="flex transition-transform duration-700 ease-in-out transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {movies.map((movie) => (
          <div key={movie.id} className="w-full flex-shrink-0">
            <div className="w-80 mt-4 mx-auto rounded-xl shadow-lg">
              <img
                src={movie.image}
                className="rounded-t-xl object-cover w-full h-80"
                alt={movie.name}
              />
              <div className="bg-black rounded-b-xl text-amber-100 p-2">
                
              ⭐️ Extra  stuff
              </div>
              <p className="text-2xl font-bold mt-2">{movie.name}</p>
              <div className="font-serif text-gray-600">{movie.category}</div>
            </div>
          </div>
        ))}
      </div>

      {}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        ❯
      </button>
    </div>
  );
}

export default Card;
