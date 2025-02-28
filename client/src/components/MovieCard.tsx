import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isComingSoon?: boolean;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isComingSoon = false, onClick }) => {
  return (
    <div 
      className="bg-indigo-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 font-bold px-2 py-1 m-2 rounded">
          {movie.rating}/10
        </div>
        {isComingSoon && (
          <div className="absolute bottom-0 left-0 right-0 bg-indigo-900 text-white text-center py-2 font-semibold">
            Coming Soon
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center text-gray-300 mb-2">
          <Clock size={16} className="mr-1" />
          <span>{movie.duration} min</span>
          <span className="mx-2">•</span>
          <span>{movie.genre}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="text-yellow-400 mr-1" size={16} />
            <span className="text-gray-300">{movie.rating}</span>
          </div>
          {!isComingSoon && (
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-1 px-3 rounded-lg text-sm transition-colors">
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;