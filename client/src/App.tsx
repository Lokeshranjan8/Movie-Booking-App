import logo from "./assets/logo.jpeg"
import Card from "./component/card"
const App = () => {
  return (
    <>
      <header className="w-screen flex items-center justify-around gap-2 p-2 mt-2">
        <div className="bg-red-300 h-10 flex justify-center items-center"><img className="md:w-60 w-7xl" src={logo} alt="gg" /></div>
        <input className="bg-gray-50 w-198 h-9 p-2 rounded-sm border-1 border-gray-600 shadow shadow-gray-400" type="text" placeholder="Search for Movies" />
        <select className="bg-red-400 w-36 h-8 rounded-sm" name="Location" id="loc">
          <option value="Choose">Choose Location</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Varanasi">Varanasi</option>
          <option value="London">London</option>
          <option value="Detect">Detect from GPS</option>
        </select>        
        <button className="bg-red-400 w-28 h-8 rounded-sm">signIn</button>
      </header>
      <Card/>
    </>
  )
}

export default App