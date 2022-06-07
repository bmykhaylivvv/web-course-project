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
  const [userFollowing, setUserFollowing] = useState([]);

  const user = firebaseAuth.currentUser;

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

  const getCurrUserInfo = async (uid) => {
    const dbRef = ref(getDatabase());
      try {
        const currSnapshot = await get(child(dbRef, `usersInfo/${uid}`));
        
        if (currSnapshot.exists()) {
          const currSnapshotVal = currSnapshot.val();

          setUserFollowing(currSnapshotVal.following);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
  }

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

  useEffect(() => {
    if (user) {
      getCurrUserInfo(user.uid);
    }
  }, [user]);

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
        <p>Followings posts</p>
        {feedPosts.filter((post) => userFollowing.includes(post.uid)).map((post) => (
          <Post
            key={post.postId}
            userName={post.username}
            userPhoto={post.userAvatar}
            photo={post.imageUrl}
            text={post.postText}
            uid={post.uid}
            cuid={firebaseAuth.currentUser.uid}
            postKey={post.postId}
            likes={post.likes}
            onPhotoClick={() => navigate(`/${post.username}/${post.postId}`)}
          />
        ))}
        <p>Recommendation posts</p>
        {feedPosts.filter((post) => !userFollowing.includes(post.uid)).map((post) => (
          <Post
            key={post.postId}
            userName={post.username}
            userPhoto={post.userAvatar}
            photo={post.imageUrl}
            text={post.postText}
            uid={post.uid}
            cuid={firebaseAuth.currentUser.uid}
            postKey={post.postId}
            likes={post.likes}
            onPhotoClick={() => navigate(`/${post.username}/${post.postId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
