



import React, { useEffect, useState } from "react";
import { MessageCircle, Repeat2, Heart, Share2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import Comments from "./Comments";

export default function Post({ post }) {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const name = post?.name || "User";
  const username = name.toLowerCase().replace(/\s+/g, "");
  const avatarUrl = post?.avatar ;
  const imageUrl = post?.image_url || post?.image || null;

  




  // Fetch comments for this post

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

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent navigating to post page
    if (!user || !post?.post_id) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      socket.emit("delete_post", { post_id: post.post_id, user_id: user.id });
    }
  };

  return (
    <div
      className="p-4 hover:bg-gray-950 transition cursor-pointer border-b border-gray-800"
     onClick={() =>
    navigate(`/post/${post.post_id}`, { state: { post } })
  }
    >
      <div className="flex items-start space-x-3 relative">
        {/* Avatar */}
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-gray-800"

 onClick={(e) => {
    e.stopPropagation(); // prevent navigating to post page

  }}

        />

        <div className="flex-1">
          {/* User info */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">{name}</span>
            <span className="text-gray-500 text-sm">@{username}</span>
            <span className="text-gray-500 text-sm">
              ·{" "}
              {post?.created_at
                ? new Date(post.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>

          {/* Post content */}
          {post?.content && (
            <p className="text-gray-100 mt-1 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {post.content}
            </p>
          )}

          {/* Post image */}
          {imageUrl && (
            <div className="mt-3">
              <img
                src={imageUrl}
                alt="Post"
                className="rounded-2xl border border-gray-800 w-full object-cover max-h-96"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between text-gray-500 mt-3 text-sm max-w-md">
            <button
              onClick={(e) =>  navigate(`/post/${post.post_id}`, { state: { post } })}
              className="flex items-center space-x-2 hover:text-sky-500 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length}</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 hover:text-green-500 transition"
            >
              <Repeat2 className="w-4 h-4" />
              <span>5</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 hover:text-pink-500 transition"
            >
              <Heart className="w-4 h-4" />
              <span>23</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="hover:text-sky-500 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Comments preview */}
  
        </div>

        {/* Delete button */}
        {user?.id === post?.user_id && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}


