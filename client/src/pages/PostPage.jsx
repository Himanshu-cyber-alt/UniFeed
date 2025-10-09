

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import Comments from "./Comments.jsx";
import { useSelector } from "react-redux";
import axios from "axios";

export default function PostPage() {
  const { user } = useSelector((state) => state.auth);
  const { postId } = useParams(); // ✅ catch from URL like /post/:postId
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);

  // 🔹 If we navigated directly or lost state, fetch post from server
  
 useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_comments", post.post_id);

    const handleLoadComments = ({ postId, comments }) => {
      if (postId === post.post_id) setComments(comments);
    };

    socket.on("load_comments", handleLoadComments);

    return () => {
      socket.off("load_comments", handleLoadComments);
    };
  }, [post?.post_id]);

  if (!post) return <p className="text-white text-center mt-10">Loading post...</p>;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center p-4">
      <div className="w-full max-w-2xl border border-gray-800 p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">{post.name || "User"}</h2>
        <p className="text-gray-200 mb-3">{post.content}</p>

              {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="rounded-2xl w-full object-cover max-h-96 mb-4"
          />
        )}
  
        <Comments postId={post?.post_id} user={user} comments={comments} />

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-sky-500 rounded-full"
        >
          Back
        </button>
      </div>
    </div>
  );
}

