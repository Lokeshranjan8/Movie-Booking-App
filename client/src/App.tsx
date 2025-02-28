import React, { useState } from 'react';
import { Film, Calendar, Clock, MapPin, CreditCard, Ticket, Search, Menu, X } from 'lucide-react';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import { Movie } from './types';
import { movies } from './data/movie';

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-indigo-900 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Ticket className="text-yellow-400" size={28} />
              <h1 className="text-2xl font-bold text-white">CineBook</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">Home</a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">Movies</a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">Theaters</a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">My Bookings</a>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors">
                Sign In
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col space-y-3 pb-3">
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">Home</a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">Movies</a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">Theaters</a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors">My Bookings</a>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors w-full">
                Sign In
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedMovie ? (
          <MovieDetails movie={selectedMovie} onClose={handleCloseDetails} />
        ) : (
          <>
            {/* Hero Section */}
            <section className="mb-12 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-900/70 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Cinema" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 z-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Book Your Perfect Movie Experience</h2>
                <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl">
                  Find the latest blockbusters and book your tickets in just a few clicks
                </p>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 max-w-2xl">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search for movies..."
                      className="w-full py-3 px-4 pl-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                  </div>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors">
                    Find Movies
                  </button>
                </div>
              </div>
            </section>

            {/* Now Showing Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Film className="mr-2 text-yellow-400" />
                  Now Showing
                </h2>
                <a href="#" className="text-yellow-400 hover:text-yellow-300">View All</a>
              </div>
              
              {searchTerm && filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">No movies found matching "{searchTerm}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredMovies.map(movie => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      onClick={() => handleMovieSelect(movie)} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Coming Soon Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Calendar className="mr-2 text-yellow-400" />
                  Coming Soon
                </h2>
                <a href="#" className="text-yellow-400 hover:text-yellow-300">View All</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.slice(4, 8).map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    isComingSoon={true}
                    onClick={() => handleMovieSelect(movie)} 
                  />
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-12 bg-indigo-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">Why Book With Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-yellow-500 p-4 rounded-full mb-4">
                    <Ticket size={32} className="text-indigo-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                  <p className="text-gray-300">Book your tickets in just a few clicks with our intuitive interface</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-yellow-500 p-4 rounded-full mb-4">
                    <MapPin size={32} className="text-indigo-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
                  <p className="text-gray-300">Choose from hundreds of theaters across the country</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-yellow-500 p-4 rounded-full mb-4">
                    <CreditCard size={32} className="text-indigo-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                  <p className="text-gray-300">Your payment information is always safe and secure with us</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ticket className="text-yellow-400" size={24} />
                <h3 className="text-xl font-bold">CineBook</h3>
              </div>
              <p className="text-gray-400">The best way to book your movie tickets online.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Theaters</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">My Bookings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Help & Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
              <p className="text-gray-400 mb-4">Get the latest updates and offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} CineBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;