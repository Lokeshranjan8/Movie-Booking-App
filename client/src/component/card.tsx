import React, { useState } from "react";

function Card() {
  const movies = [
    { id: 1, name: "Inception", category: "Sci-Fi",rating :"4/5",votes :"4k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 2, name: "Interstellar", category: "Sci-Fi",rating :"4.5/5",votes :"5k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 3, name: "The Dark Knight", category: "Action",rating :"5/5",votes :"400k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 4, name: "Avengers: Endgame", category: "Superhero",rating :"5/5",votes :"204k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 5, name: "Tenet", category: "Sci-Fi",rating :"2/5",votes :"435k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 6, name: "The Matrix", category: "Sci-Fi",rating :"1/5",votes :"104k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 7, name: "Joker", category: "Drama",rating :"3/5",votes :"43k", image : "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
    { id: 8, name: "Dune", category: "Sci-Fi",rating :"3.5/5",votes :"48k", image: "https://th.bing.com/th/id/OIP.YsUwVrndgtJ0qZO87hXQGgHaDt?rs=1&pid=ImgDetMain" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const nextSlide = () => {
    if (currentIndex < movies.length - itemsPerPage) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
  
    <div className="w-8/12 mr-auto ml-auto overflow-hidden">
    <div className="flex ">  <div className="font-bold mt-20 ml-2 text-2xl">Recommended Movies</div> 
        <button className="text-red-600 mt-auto ml-auto "> See All → </button></div>
      <div
        className=" flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-1/5 flex-shrink-0 px-2">
            <div className="w-full mt-4 rounded-xl shadow-lg bg-white">
              <img
                src={movie.image}
                className="rounded-t-xl object-cover  h-80"
                alt={movie.name}
              />
              <div className="flex  bg-black rounded-b-xl ml-auto  text-amber-100 p-2 ">
                ⭐️ {movie.rating}
                <p className=" overflow-hidden whitespace-nowrap overflow-ellipsis ml-auto mr-2" >{movie.votes} Votes</p>
              </div></div>
              <p className="text-xl font-bold mt-4 mb-4 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.name}</p>
              <div className="font-serif text-gray-600 ">{movie.category}</div>
              
              
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className={`absolute top-1/2 transform -translate-y-1/2 p-3 rounded-full ${
          currentIndex === 0 ? " cursor-not-allowed" : "bg-gray-800 text-white"
        }`}
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        disabled={currentIndex >= movies.length - itemsPerPage}
        className={`absolute right-2/12 top-1/2 transform -translate-y-1/2 p-3 rounded-full ${
          currentIndex >= movies.length - itemsPerPage ? " cursor-not-allowed " : "bg-gray-800 text-white"
        }`}
      >
        ❯
      </button>
      
      <div className=" ml-2 mr-2 flex justify-center items-center"> 
  <img 
    src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/stream-leadin-web-collection-202210241242.png" 
    className="h-1/2 w-auto pt-24 pb-24"
  />
</div>

    </div>
  );
}

export default Card;
