// routes/profileRoutes.js
import express from "express";
import { pool } from "../db.js";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. User info
    const userRes = await pool.query("SELECT id, name, email, avatar FROM users WHERE id = $1", [userId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: "User not found" });
    const user = userRes.rows[0];

    // 2. Posts
    const postsRes = await pool.query(
      "SELECT p.id AS post_id, p.content, p.image_url, p.created_at FROM posts p WHERE p.user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // 3. Replies (comments by user)
    const repliesRes = await pool.query(
      "SELECT c.id AS post_id, c.content, c.created_at, p.id AS parent_post_id FROM comments c JOIN posts p ON c.post_id = p.id WHERE c.user_id = $1 ORDER BY c.created_at DESC",
      [userId]
    );


    
    // 4. Likes (assuming you have a likes table)
    const likesRes = await pool.query(
      "SELECT l.post_id, p.content, p.image_url, p.created_at FROM likes l JOIN posts p ON l.post_id = p.id WHERE l.user_id = $1 ORDER BY l.created_at DESC",
      [userId]
    );

    // 5. Media posts (posts with image)
    const mediaRes = await pool.query(
      "SELECT id AS post_id, content, image_url, created_at FROM posts WHERE user_id = $1 AND image_url IS NOT NULL ORDER BY created_at DESC",
      [userId]
    );

    res.json({
      user,
      posts: postsRes.rows,
      replies: repliesRes.rows,
      likes: likesRes.rows,
      media: mediaRes.rows,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
