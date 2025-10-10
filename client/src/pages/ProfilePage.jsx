

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { ArrowLeft, Calendar, Users, Heart, MessageCircle } from "lucide-react";
import Post from "./Post";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const isOwnProfile = currentUser?.id === userId;

  // Fetch profile data
  useEffect(() => {
    if (!userId || !currentUser) {
      console.log("❌ Missing userId or currentUser");
      return;
    }

    console.log("🚀 Fetching profile data for:", userId);
    
    // Fetch user profile
    socket.emit("fetch_profile", { userId, currentUserId: currentUser.id });
    
    // Fetch user posts
    socket.emit("fetch_user_posts", userId);
    
    // Fetch liked posts
    socket.emit("fetch_user_likes", userId);
    
    // Fetch user comments
    socket.emit("fetch_user_comments", userId);
    
    // Fetch followers
    socket.emit("fetch_followers", userId);
    
    // Fetch following
    socket.emit("fetch_following", userId);

    // Set up listeners
    const handleLoadProfile = (data) => {
      console.log("📥 Received profile data:", data);
      if (data.error) {
        console.error("Profile error:", data.error);
        return;
      }
      setProfileUser(data.user);
      setStats(data.stats);
      setIsFollowing(data.isFollowing);
    };

    const handleLoadPosts = (data) => {
      console.log("📥 Received posts:", data.length);
      setPosts(data);
    };
    const handleLoadLikes = (data) => {
      console.log("📥 Received likes:", data.length);
      setLikedPosts(data);
    };
    const handleLoadComments = (data) => {
      console.log("📥 Received comments:", data.length);
      setComments(data);
    };
    const handleLoadFollowers = (data) => {
      console.log("📥 Received followers:", data.length);
      setFollowers(data);
    };
    const handleLoadFollowing = (data) => {
      console.log("📥 Received following:", data.length);
      setFollowing(data);
    };

    socket.on("load_profile", handleLoadProfile);
    socket.on("load_user_posts", handleLoadPosts);
    socket.on("load_user_likes", handleLoadLikes);
    socket.on("load_user_comments", handleLoadComments);
    socket.on("load_followers", handleLoadFollowers);
    socket.on("load_following", handleLoadFollowing);

    return () => {
      socket.off("load_profile", handleLoadProfile);
      socket.off("load_user_posts", handleLoadPosts);
      socket.off("load_user_likes", handleLoadLikes);
      socket.off("load_user_comments", handleLoadComments);
      socket.off("load_followers", handleLoadFollowers);
      socket.off("load_following", handleLoadFollowing);
    };
  }, [userId, currentUser]);

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    if (!currentUser || !userId) return;
    socket.emit("toggle_follow", {
      follower_id: currentUser.id,
      following_id: userId,
    });
    setIsFollowing(!isFollowing);
    setStats((prev) => ({
      ...prev,
      followersCount: isFollowing
        ? prev.followersCount - 1
        : prev.followersCount + 1,
    }));
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const username = profileUser.name?.toLowerCase().replace(/\s+/g, "") || "user";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto border-x border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800 z-10">
          <div className="flex items-center space-x-4 p-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-gray-900 rounded-full p-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{profileUser.name}</h1>
              <p className="text-sm text-gray-500">{stats.postsCount} posts</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="border-b border-gray-800">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-sky-900 to-blue-900"></div>

          <div className="px-4 pb-4">
            {/* Avatar */}
            <div className="flex justify-between items-start -mt-16 mb-4">
              <img
                src={profileUser.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-black object-cover"
              />
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  className={`mt-16 px-6 py-2 rounded-full font-semibold transition ${
                    isFollowing
                      ? "bg-transparent border border-gray-600 text-white hover:bg-red-600 hover:border-red-600 hover:text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{profileUser.name}</h2>
                <p className="text-gray-500">@{username}</p>
              </div>

              {profileUser.bio && (
                <p className="text-gray-100">{profileUser.bio}</p>
              )}

              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {new Date(profileUser.created_at).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex space-x-6 text-sm">
                <button
                  onClick={() => setActiveTab("following")}
                  className="hover:underline"
                >
                  <span className="font-bold text-white">
                    {stats.followingCount}
                  </span>{" "}
                  <span className="text-gray-500">Following</span>
                </button>
                <button
                  onClick={() => setActiveTab("followers")}
                  className="hover:underline"
                >
                  <span className="font-bold text-white">
                    {stats.followersCount}
                  </span>{" "}
                  <span className="text-gray-500">Followers</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 flex">
          {["posts", "likes", "comments", "followers", "following"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-semibold transition relative ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-500 hover:bg-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div key={`indicator-${tab}`} className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "posts" && (
            <div className="divide-y divide-gray-800">
              {posts.length > 0 ? (
                posts.map((post) => <Post key={post.post_id} post={post} />)
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No posts yet
                </div>
              )}
            </div>
          )}

          {activeTab === "likes" && (
            <div className="divide-y divide-gray-800">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => <Post key={post.post_id} post={post} />)
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  No liked posts yet
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="divide-y divide-gray-800">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 hover:bg-gray-950 transition cursor-pointer"
                    onClick={() => navigate(`/post/${comment.post_id}`)}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={profileUser.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-semibold">
                            {profileUser.name}
                          </span>
                          <span className="text-gray-500">@{username}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-100 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  No comments yet
                </div>
              )}
            </div>
          )}

          {activeTab === "followers" && (
            <div className="divide-y divide-gray-800">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <div
                    key={follower.id}
                    className="p-4 hover:bg-gray-950 transition flex items-center justify-between"
                  >
                    <div
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => navigate(`/profile/${follower.id}`)}
                    >
                      <img
                        src={follower.avatar}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{follower.name}</p>
                        <p className="text-sm text-gray-500">
                          @{follower.name.toLowerCase().replace(/\s+/g, "")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  No followers yet
                </div>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="divide-y divide-gray-800">
              {following.length > 0 ? (
                following.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-gray-950 transition flex items-center justify-between"
                  >
                    <div
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          @{user.name.toLowerCase().replace(/\s+/g, "")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Not following anyone yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}