
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import PostPage from "./pages/PostPage";
// import Landing from "./pages/Landing";

// export default function App() {
//   return (
//     <div className="bg-black min-h-screen text-white">
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/post/:postId" element={<PostPage />} />
//       </Routes>
//     </div>
//   );
// }

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";


function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post/:postId" element={<PostPage />} />

      </Routes>
    </div>
  );
}

export default App;
