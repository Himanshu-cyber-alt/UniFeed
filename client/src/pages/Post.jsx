

import React, { useEffect, useState } from "react";
import { MessageCircle, Repeat2, Heart, Share2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Post({ post }) {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [repostedByUser, setRepostedByUser] = useState(false);
  const navigate = useNavigate();

  const name = post?.name || "User";
  const username = name.toLowerCase().replace(/\s+/g, "");
  const avatarUrl = post?.avatar;
  const imageUrl = post?.image_url || post?.image || null;

  // 🔹 Fetch comments
  useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_comments", post.post_id);

    const handleLoadComments = ({ postId, comments }) => {
      if (postId === post.post_id) setComments(comments);
    };

    socket.on("load_comments", handleLoadComments);
    return () => socket.off("load_comments", handleLoadComments);
  }, [post?.post_id]);

  // 🔹 Fetch likes for this post
  useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_likes", post.post_id);

    const handleLikes = ({ postId, likes, likedBy }) => {
      if (postId === post.post_id) {
        setLikes(likes);
        setLikedByUser(likedBy?.includes(user?.id));
      }
    };

    socket.on("load_likes", handleLikes);
    return () => socket.off("load_likes", handleLikes);
  }, [post?.post_id, user?.id]);

  // 🔹 Fetch reposts for this post
  useEffect(() => {
    if (!post?.post_id) return;

    socket.emit("fetch_reposts", post.post_id);

    const handleReposts = ({ postId, reposts, repostedBy }) => {
      if (postId === post.post_id) {
        setReposts(reposts);
        setRepostedByUser(repostedBy?.includes(user?.id));
      }
    };

    socket.on("load_reposts", handleReposts);
    return () => socket.off("load_reposts", handleReposts);
  }, [post?.post_id, user?.id]);

  // 🔹 Like/unlike handler
  const updateLikes = (e) => {
    e.stopPropagation();
    if (!user || !post?.post_id) return;
    socket.emit("update_like", {
      post_id: post.post_id,
      user_id: user.id,
    });
  };

  // 🔹 Repost handler
  const toggleRepost = (e) => {
    e.stopPropagation();
    if (!user || !post?.post_id) return;
    socket.emit("toggle_repost", {
      post_id: post.post_id,
      user_id: user.id,
    });
  };

  // 🔹 Delete post handler
  const handleDelete = (e) => {
    e.stopPropagation();
    if (!user || !post?.post_id) return;
    if (window.confirm("Are you sure you want to delete this post?")) {
      socket.emit("delete_post", { post_id: post.post_id, user_id: user.id });
    }
  };

  // 🔹 Navigate to profile
  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (post?.user_id) {
      navigate(`/profile/${post.user_id}`);
    }
  };

  return (
    <div
      className="p-4 hover:bg-gray-950 transition cursor-pointer border-b border-gray-800"
      onClick={() => navigate(`/post/${post.post_id}`, { state: { post } })}
    >
      {/* Repost Indicator */}
      {post?.post_type === 'repost' && post?.reposted_by_name && (
        <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2 ml-12">
          <Repeat2 className="w-4 h-4" />
          <span>{post.reposted_by_name} reposted</span>
        </div>
      )}
      
      <div className="flex items-start space-x-3 relative">
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-gray-800 cursor-pointer hover:opacity-80 transition"
          onClick={handleProfileClick}
        />

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span 
              className="font-semibold text-white hover:underline cursor-pointer"
              onClick={handleProfileClick}
            >
              {name}
            </span>
            <span 
              className="text-gray-500 text-sm hover:underline cursor-pointer"
              onClick={handleProfileClick}
            >
              @{username}
            </span>
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

          {post?.content && (
            <p className="text-gray-100 mt-1 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {post.content}
            </p>
          )}

          {imageUrl && (
            <div className="mt-3">
              <img
                src={imageUrl}
                alt="Post"
                className="rounded-2xl border border-gray-800 w-full object-cover max-h-96"
              />
            </div>
          )}

          {/* 🔹 Action buttons */}
          <div className="flex justify-between text-gray-500 mt-3 text-sm max-w-md">
            {/* Comments */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${post.post_id}`, { state: { post } });
              }}
              className="flex items-center space-x-2 hover:text-sky-500 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length}</span>
            </button>

            {/* Repost */}
            <button
              onClick={toggleRepost}
              className={`flex items-center space-x-2 transition ${
                repostedByUser ? "text-green-500" : "hover:text-green-500"
              }`}
            >
              <Repeat2
                className={`w-4 h-4 ${
                  repostedByUser ? "text-green-500" : ""
                }`}
              />
              <span>{reposts}</span>
            </button>

            {/* Likes */}
            <button
              onClick={updateLikes}
              className={`flex items-center space-x-2 transition ${
                likedByUser ? "text-pink-500" : "hover:text-pink-500"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  likedByUser ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
              <span>{likes}</span>
            </button>

            {/* Share */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="hover:text-sky-500 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

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