import logo from "./assets/logo.jpeg"
import Card from "./component/card"

import { useState, useEffect } from "react"
import SignIn from "./component/signin";
interface Location{
  Lat: Number,
  Long: Number,
}


const App = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const[isSignInOpen,setIsSignInOpen]=useState(false);
 
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            Lat: position.coords.latitude,
            Long: position.coords.longitude,
          });
        },
        (error) => {
          alert(error);
        }
      );
    }
  },[]);
  

  return (
    
    <>
      <header className="w-screen flex items-center justify-around gap-2 p-2 mt-2">
        <div className="bg-red-300 h-10 flex justify-center items-center"><img className="md:w-60 w-7xl" src={logo} alt="gg" /></div>
        <input className="bg-gray-50 w-198 h-9 p-2 rounded-sm border-1 border-gray-600 shadow shadow-gray-400" type="text" placeholder="Search for Movies" />
        {/* <select className="bg-red-400 w-36 h-8 rounded-sm" name="Location" id="loc">
          <option value="Choose">Choose Location</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Varanasi">Varanasi</option>
          <option value="London">London</option>
          <option value="Detect">Detect from GPS</option>
        </select>         */}
        <button className="bg-red-400 w-36 h-8 rounded-sm">{location && location.Lat}</button>
        
      
      <button
          className="bg-red-400 w-28 h-8 rounded-sm"
          onClick={() => setIsSignInOpen(true)} // Open Sign-In Modal
        >
          Sign In
        </button>
      </header>
      <Card/>
      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 flex items-center justify-center ">
          <div className="bg-white border h-9/12 p-6 rounded-lg shadow-lg w-106 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsSignInOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>

            <SignIn />
          </div>
        </div>
      )}
      
        </>
    
  )
}

export default App