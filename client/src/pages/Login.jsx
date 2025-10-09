// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { loginUser } from "../features/auth/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom"; 
// import Footer from "./Footer";
//  // path according to your folder



// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

// const { loading, error, user } = useSelector(state => state.auth);

//   const handleEmailLogin = async (e) => {
//     e.preventDefault();

//     try {

//     const resultAction = await dispatch(loginUser({ email, password }));
   
 
    
   
//     if (loginUser.fulfilled.match(resultAction)) {
//       console.log("Login successful!", resultAction.payload);

//          localStorage.setItem("Token", resultAction.payload.token); 

        

//       navigate("/home"); // redirect after login
//     } else {
//       console.log("Login failed", resultAction.payload);
//     }
//   } catch (err) {
//     console.error("Unexpected error", err);
//   }
   
//   };
//  const handleGoogleLogin = async () => {
//     try {
//       const firebaseUser = await signInWithGoogle();

//       const res = await axios.post("http://localhost:5000/api/auth/google", {
//         email: firebaseUser.email,
//         name: firebaseUser.displayName,
//         firebase_uid: firebaseUser.uid,
//       });

//       localStorage.setItem("token", res.data.token);
//       alert(`Welcome, ${res.data.user.name}!`);
//     } catch (error) {
//       console.error("Google login failed:", error);
//       alert(error.response?.data?.msg || "Google login failed");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-black text-white flex-col">
//       <div className="flex flex-1">
//         {/* Left side - Big Logo */}
//         <div className="hidden md:flex w-1/2 items-center justify-center">
//           <h1 className="text-9xl font-extrabold text-blue-400">U</h1>
//         </div>

//         {/* Right side - Auth Section */}
//         <div className="flex flex-col w-full md:w-1/2 justify-center px-8">
//           <h2 className="text-5xl font-bold mb-6">Welcome back</h2>
//           <h3 className="text-2xl font-semibold mb-8">Log in to your account.</h3>

//           {error && <p className="text-red-500 mb-4">{error}</p>}

//           {/* Email & Password Form */}
//           <form onSubmit={handleEmailLogin} className="flex flex-col space-y-4 mb-6 w-80">
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-6 py-3"
//             >
//               Log in
//             </button>
//           </form>

//           <p className="text-center text-gray-400 mb-4">or</p>

//           {/* Google Login */}
//           <button
//             onClick={handleGoogleLogin}
//             className="bg-white text-black font-semibold rounded-full px-6 py-3 w-80 hover:bg-gray-200 mb-6"
//           >
//             Sign in with Google
//           </button>

//           <p className="text-sm text-gray-400 mb-6 w-80">
//             Don’t have an account?{" "}
//             <Link to="/register" className="text-blue-400 hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
