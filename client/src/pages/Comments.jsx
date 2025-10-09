import React, { useState } from "react";
import { socket } from "../socket";

export default function Comments({ postId, user, comments }) {
  const [newComment, setNewComment] = useState("");

  const handleComment = () => {
    if (!newComment.trim()) return;
    socket.emit("add_comment", {
      post_id: postId,
      user_id: user.id,
      content: newComment,
    });
    setNewComment("");
  };

  return (
    <div className="mt-4 ml-12 border-l border-gray-800 pl-4 space-y-3">
      {comments.map((c) => (
        <div key={c.comment_id} className="flex space-x-3">
          <img
            src={c.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <span className="font-semibold text-white">{c.name}</span>
            <p className="text-gray-300 text-sm">{c.content}</p>
          </div>
        </div>
      ))}

      <div className="flex items-center mt-2 space-x-2">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-full px-3 py-1 text-sm outline-none"
        />
        <button
          onClick={handleComment}
          className="text-sky-500 hover:text-sky-400 font-semibold"
        >
          Reply
        </button>
      </div>
    </div>
  );
}

