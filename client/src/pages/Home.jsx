
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../socket";
import Post from "./Post";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(user.avatar)
  // Socket fetch
  useEffect(() => {
    socket.connect();
    socket.on("load_posts", (data) => setPosts(data));
    return () => {
      socket.off("load_posts");
      socket.disconnect();
    };
  }, [user]);

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image
  const uploadImage = async () => {
    console.log("step 1 ",image)
    if (!image) return null;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

          
      return res.data.imageUrl;
      
 
      // Ensure this is a valid URL
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Create post
  const handlePost = async () => {
    if (!content.trim() && !image) return;
    const imageUrl = await uploadImage();
    socket.emit("new_post", { user, content, imageUrl });
    setContent("");
    setImage(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };




  return (
    <div className="min-h-screen bg-black text-white flex justify-center relative">
      <div className="w-full max-w-2xl border-x border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-black bg-opacity-90 backdrop-blur p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Home</h1>
          <button
            onClick={handleLogout}
            className="bg-sky-500 hover:bg-sky-600 transition font-semibold px-5 py-1.5 rounded-full"
          >
            Logout
          </button>
        </div>

        {/* Posts */}
        <div className="divide-y divide-gray-800">
          {posts.map((post) => (
            <Post key={post.post_id} post={post} />
          ))}
        </div>
      </div>

      {/* Floating Post Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-sky-500 hover:bg-sky-600 transition rounded-full p-4 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md p-4">
            <div className="flex items-start space-x-3">
              <img
                src={user.avatar }
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
             

              <div className="flex-1">
                <textarea
                  rows="3"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What’s happening?!"
                  className="w-full bg-black text-white placeholder-gray-500 resize-none border-none outline-none text-lg"
                />

                {imagePreview && (
                  <div className="relative mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-2xl max-h-64 object-cover border border-gray-700"
                    />
                    <button
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-3">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <span className="text-sky-500">Upload Image</span>
                  </label>
                  <div className="flex space-x-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 rounded-full border border-gray-600 text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handlePost} disabled={uploading} className="bg-sky-500 hover:bg-sky-600 transition font-semibold px-5 py-1.5 rounded-full disabled:opacity-50">
                      {uploading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

