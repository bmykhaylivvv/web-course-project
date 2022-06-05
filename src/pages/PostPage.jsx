import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Post from "../components/Post";

import { getDatabase, ref, child, get } from "firebase/database";

import { firebaseAuth } from "../config/firebase-config";
import { CircularProgress } from "@mui/material";

const PostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { userName, postId } = useParams();

  const [post, setPost] = useState([]);

  const getPost = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `posts`));

      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();

        const posts = Object.values(snapshotVal).filter(
          (post) => post.uid === postId
        );

        if (posts.length === 0) {
          navigate("/feed");
        }

        setPost(posts[0]);
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
        getPost();
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
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Post
          userName={userName}
          userPhoto={post?.userAvatar}
          // photo={post?.imageUrl}
          text={post?.postText}
          uid={post.uid}
          cuid={firebaseAuth.currentUser.uid}
          postKey={post.postId}
          likes={post.likes}
          onUserClick={() => navigate(`/${post.uid}`)}
        />
      </Box>
    </div>
  );
};

export default PostPage;
