const SignIn = () => {
  return (
    <div className="flex flex-col  h-screen">
      <h1 className="text-2xl font-bold mb-4 flex  justify-center">Sign In</h1>
      <input type="text" placeholder="Username" className="border rounded-xl px-4 py-2 mt-4" />
      <input type="password" placeholder="Password" className="border rounded-xl px-4 py-2 mt-4 mb-4" />
      <button className="bg-red-500  text-white px-4 py-2 rounded">Sign in</button>
      <p className=" flex justify-center mt-2 underline">Forgot your password</p>
      <p className="flex justify-center p-4">OR</p>
      <div className="flex bg-blue-100 p-2 mt-5 rounded-xl justify-center border"> 
        <img src="https://www.pngmart.com/files/16/Google-Logo-PNG-Image.png" className="flex ml-1 h-6 mr-2 "/>
        sign in  with Gmail</div>
       <p className="flex justify-center mt-8"> Don't have an account?  Sign up</p>
    </div>
    
  );
};

export default SignIn;