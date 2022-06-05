import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import { Box } from "@mui/material";
import "./HomePage.css";
import {
  getDatabase,
  ref,
  child,
  update,
  get,
  set,
  push,
} from "firebase/database";

import { firebaseAuth } from "../config/firebase-config";
import { CircularProgress } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedPosts, setFeedPosts] = useState([]);

  const getFeedPosts = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `posts`));

      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();

        const feedPosts = Object.values(snapshotVal).filter(
          (post) => post.uid !== firebaseAuth.currentUser.uid
        );
        setFeedPosts(feedPosts.slice(0, 25).reverse());
        setLoading(false);
      } else {
        console.log("No data available");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        navigate("/signin");
      }

      if (userCred) {
        getFeedPosts();
      }
    });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div>
      <Header />
      <div className="feed-posts">
        {feedPosts.map((post) => (
          <Post
            key={post.uid}
            userName={post.username}
            userPhoto={post.userAvatar}
            photo={post.imageUrl}
            text={post.postText}
            uid={post.uid}
            cuid={firebaseAuth.currentUser.uid}
            postKey={post.postId}
            likes={post.likes}
            onPhotoClick={() => navigate(`/${post.username}/${post.uid}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
