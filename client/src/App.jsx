

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PostComment from "./pages/PostComment";
import ProfilePage from "./pages/ProfilePage"; // Add this import

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post/:postId" element={<PostComment />} />
        <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Add this route */}
      </Routes>
    </div>
  );
}

export default App;