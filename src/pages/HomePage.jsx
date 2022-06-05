import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
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

        // console.log(feedPosts.slice(0, 25).reverse())
        setFeedPosts(feedPosts.slice(0, 25).reverse());
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

  return (
    <div>
      <Header />
      <div className="feed-posts">
        {feedPosts.map((post) => (
          <Post
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
