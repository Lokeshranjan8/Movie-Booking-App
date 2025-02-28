import React, { useState } from 'react';
import { Star, Clock, Calendar, X, MapPin, CreditCard } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const dates = ['Today', 'Tomorrow', 'Wed, 15 May', 'Thu, 16 May', 'Fri, 17 May'];
  const times = ['10:00 AM', '12:30 PM', '3:15 PM', '6:00 PM', '8:45 PM', '11:00 PM'];
  const theaters = ['CineWorld - Downtown', 'MoviePlex - Westside', 'Star Cinemas - North'];
  
  // Generate a 8x8 grid of seats
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats = [];
    
    for (const row of rows) {
      for (let i = 1; i <= 8; i++) {
        seats.push(`${row}${i}`);
      }
    }
    
    return seats;
  };
  
  const allSeats = generateSeats();
  
  // Some random seats are already booked
  const bookedSeats = [
    'A1', 'A2', 'B5', 'C3', 'C4', 'D7', 'D8', 
    'E2', 'E3', 'F1', 'G6', 'G7', 'H4', 'H5'
  ];
  
  const handleSeatToggle = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  const getSeatStatus = (seat: string) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleBooking = () => {
    alert(`Booking confirmed for ${movie.title}!\nDate: ${selectedDate}\nTime: ${selectedTime}\nTheater: ${selectedTheater}\nSeats: ${selectedSeats.join(', ')}`);
    onClose();
  };
  
  const isNextDisabled = () => {
    if (currentStep === 1) return !selectedDate || !selectedTime || !selectedTheater;
    if (currentStep === 2) return selectedSeats.length === 0;
    return false;
  };

  return (
    <div className="bg-indigo-800 rounded-xl overflow-hidden shadow-xl">
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-900/70 p-2 rounded-full text-white hover:bg-gray-900 z-10"
        >
          <X size={20} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-800 to-transparent z-0"></div>
        <img 
          src={movie.backdropUrl || movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-6 z-10">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <div className="flex flex-wrap items-center text-gray-300 mb-4">
            <div className="flex items-center mr-4">
              <Star className="text-yellow-400 mr-1" size={18} />
              <span>{movie.rating}/10</span>
            </div>
            <div className="flex items-center mr-4">
              <Clock size={18} className="mr-1" />
              <span>{movie.duration} min</span>
            </div>
            <span className="mr-4">•</span>
            <span>{movie.genre}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
          <p className="text-gray-300">{movie.description}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Cast</h2>
          <div className="flex flex-wrap gap-4">
            {movie.cast.map((actor, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 overflow-hidden">
                  <img 
                    src={`https://i.pravatar.cc/150?img=${index + 10}`} 
                    alt={actor} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-center">{actor}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-indigo-700 pt-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Tickets</h2>
          
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="mr-2 text-yellow-400" size={20} />
                  Select Date
                </h3>
                <div className="flex flex-wrap gap-3">
                  {dates.map((date, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg ${
                        selectedDate === date 
                          ? 'bg-yellow-500 text-gray-900 font-bold' 
                          : 'bg-indigo-700 hover:bg-indigo-600'
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Clock className="mr-2 text-yellow-400" size={20} />
                  Select Time
                </h3>
                <div className="flex flex-wrap gap-3">
                  {times.map((time, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg ${
                        selectedTime === time 
                          ? 'bg-yellow-500 text-gray-900 font-bold' 
                          : 'bg-indigo-700 hover:bg-indigo-600'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MapPin className="mr-2 text-yellow-400" size={20} />
                  Select Theater
                </h3>
                <div className="flex flex-col gap-3">
                  {theaters.map((theater, index) => (
                    <button
                      key={index}
                      className={`px-4 py-3 rounded-lg text-left ${
                        selectedTheater === theater 
                          ? 'bg-yellow-500 text-gray-900 font-bold' 
                          : 'bg-indigo-700 hover:bg-indigo-600'
                      }`}
                      onClick={() => setSelectedTheater(theater)}
                    >
                      {theater}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Seats</h3>
              <div className="mb-6 overflow-x-auto">
                <div className="w-full min-w-[500px]">
                  <div className="mb-8 text-center">
                    <div className="w-3/4 h-8 bg-gray-700 mx-auto rounded-t-3xl mb-10">
                      <p className="text-center text-sm pt-1">SCREEN</p>
                    </div>
                    
                    <div className="grid grid-cols-8 gap-2 mb-6">
                      {allSeats.map(seat => (
                        <button
                          key={seat}
                          className={`
                            w-10 h-10 rounded-t-lg flex items-center justify-center text-sm font-medium
                            ${
                              getSeatStatus(seat) === 'booked' 
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                : getSeatStatus(seat) === 'selected'
                                  ? 'bg-yellow-500 text-gray-900'
                                  : 'bg-indigo-700 hover:bg-indigo-600'
                            }
                          `}
                          onClick={() => handleSeatToggle(seat)}
                          disabled={getSeatStatus(seat) === 'booked'}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex justify-center space-x-8">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-indigo-700 rounded-sm mr-2"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
                        <span className="text-sm">Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-700 rounded-sm mr-2"></div>
                        <span className="text-sm">Booked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-300 mb-4">
                  <div>Movie:</div>
                  <div className="font-medium">{movie.title}</div>
                  <div>Date:</div>
                  <div className="font-medium">{selectedDate}</div>
                  <div>Time:</div>
                  <div className="font-medium">{selectedTime}</div>
                  <div>Theater:</div>
                  <div className="font-medium">{selectedTheater}</div>
                  <div>Seats:</div>
                  <div className="font-medium">{selectedSeats.join(', ') || 'None selected'}</div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${(selectedSeats.length * 12).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <CreditCard className="mr-2 text-yellow-400" size={20} />
                Payment Details
              </h3>
              
              <div className="bg-indigo-900 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-300 mb-4">
                  <div>Movie:</div>
                  <div className="font-medium">{movie.title}</div>
                  <div>Date:</div>
                  <div className="font-medium">{selectedDate}</div>
                  <div>Time:</div>
                  <div className="font-medium">{selectedTime}</div>
                  <div>Theater:</div>
                  <div className="font-medium">{selectedTheater}</div>
                  <div>Seats:</div>
                  <div className="font-medium">{selectedSeats.join(', ')}</div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${(selectedSeats.length * 12).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg bg-indigo-700 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg bg-indigo-700 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg bg-indigo-700 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name on Card</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg bg-indigo-700 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button 
                onClick={handlePrevStep}
                className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 3 ? (
              <button 
                onClick={handleNextStep}
                disabled={isNextDisabled()}
                className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors ${
                  isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            ) : (
              <button 
                onClick={handleBooking}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;