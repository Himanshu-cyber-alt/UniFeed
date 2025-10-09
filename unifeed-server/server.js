

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { pool } from "./db.js"; // your postgres pool
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import profileRoutes from "./routes/ProfileRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/profile", profileRoutes);

// ---------------- GET Single Post Route ----------------
app.get("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT posts.id AS post_id, posts.content, posts.image_url, posts.created_at,
              users.id AS user_id, users.name, users.avatar
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ---------------- Socket.IO ----------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// ---------------- Helper: Fetch Posts ----------------
async function fetchPosts() {
  const res = await pool.query(`
    SELECT posts.id AS post_id, posts.content, posts.image_url, posts.created_at,
           users.id AS user_id, users.name, users.avatar
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  return res.rows;
}

// ---------------- Helper: Fetch Comments ----------------
async function fetchComments(postId) {
  console.log("📝 Fetching comments for post:", postId);
  const res = await pool.query(
    `
    SELECT c.id AS comment_id, c.content, c.created_at,
           u.id AS user_id, u.name, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `,
    [postId]
  );
  console.log("📝 Found comments:", res.rows.length);
  return res.rows;
}

// ---------------- Socket.IO connection ----------------
io.on("connection", async (socket) => {
  console.log("✅ User connected:", socket.id);

  // Send all posts initially
  const posts = await fetchPosts();
  socket.emit("load_posts", posts);

  // Create new post
  socket.on("new_post", async ({ user, content, imageUrl }) => {
    await pool.query(
      "INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3)",
      [user.id, content, imageUrl || null]
    );
    const updatedPosts = await fetchPosts();
    io.emit("load_posts", updatedPosts);
  });

  // Delete a post
  socket.on("delete_post", async ({ post_id, user_id }) => {
    try {
      const res = await pool.query(
        "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
        [post_id, user_id]
      );
      if (res.rowCount === 0) {
        socket.emit("error_message", "Unauthorized to delete this post");
        return;
      }

      await pool.query("DELETE FROM posts WHERE id = $1", [post_id]);
      const updatedPosts = await fetchPosts();
      io.emit("load_posts", updatedPosts);
    } catch (err) {
      console.error("Delete error:", err);
      socket.emit("error_message", "Failed to delete post");
    }
  });

  // ==================== 💬 COMMENTS ====================

  // Fetch comments for a specific post
  socket.on("fetch_comments", async (postId) => {
    console.log("🔍 Received fetch_comments request for:", postId, typeof postId);
    
    try {
      const comments = await fetchComments(postId);
      console.log("📤 Emitting comments back to client:", { postId, commentsCount: comments.length });
      socket.emit("load_comments", { postId: postId, comments });
    } catch (err) {
      console.error("❌ Error fetching comments:", err);
      socket.emit("error_message", "Failed to load comments");
    }
  });

  // Add a new comment
  socket.on("add_comment", async ({ post_id, user_id, content }) => {
    console.log("💬 Adding comment:", { post_id, user_id, content });
    
    try {
      await pool.query(
        "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)",
        [post_id, user_id, content]
      );
      console.log("✅ Comment added successfully");
      
      const comments = await fetchComments(post_id);
      console.log("📤 Broadcasting updated comments:", comments.length);
      
      // Broadcast to ALL connected clients
      io.emit("load_comments", { postId: post_id, comments });
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      socket.emit("error_message", "Failed to add comment");
    }
  });

  // ======================================================

  socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
});

// ---------------- Start Server ----------------
server.listen(5000, () => console.log("🚀 Server running on port 5000"));