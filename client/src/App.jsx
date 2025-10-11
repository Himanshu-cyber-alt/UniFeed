

// import { Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Home from "./pages/Home";
// import PostComment from "./pages/PostComment";
// import ProfilePage from "./pages/ProfilePage"; // Add this import

// function App() {
//   return (
//     <div className="bg-black min-h-screen text-white">
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/post/:postId" element={<PostComment />} />
//         <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Add this route */}
//       </Routes>
//     </div>
//   );
// }

// export default App;









import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PostComment from "./pages/PostComment";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Register from "./pages/Register";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register/>} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <PostComment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
