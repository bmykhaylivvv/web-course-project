import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Header from "../components/Header";
import Post from "../components/Post";
import Typography from "@mui/material/Typography";
import Comments from "../components/Comment";
import { Grid } from '@mui/material';

import { getDatabase, ref, child, get, update } from "firebase/database";

import { firebaseAuth, getCurrTime } from "../config/firebase-config";
import { CircularProgress } from "@mui/material";

const PostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { userName, postId } = useParams();
  const [commentText, setCommentText] = useState("");
  const [currUser, setCurrUser] = useState();

  const [post, setPost] = useState();

  const user = firebaseAuth.currentUser;

  const getPost = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `posts`));

      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();

        const posts = Object.values(snapshotVal).filter(
          (post) => post.postId === postId
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

  const getCurrUserInfo = async (uid) => {
    const dbRef = ref(getDatabase());
    try {
      const currSnapshot = await get(child(dbRef, `usersInfo/${uid}`));

      if (currSnapshot.exists()) {
        const currSnapshotVal = currSnapshot.val();

        setCurrUser(currSnapshotVal);
      } else {
        console.log("No data available");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addNewCommentToDb = () => {
    const db = getDatabase();
    update(ref(db, "posts/" + post.postId), { comments: post.comments });
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

  useEffect(() => {
    if (user) {
      getCurrUserInfo(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (post !== undefined) addNewCommentToDb();
  }, [post]);

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
          photo={post?.imageUrl}
          text={post?.postText}
          uid={post.uid}
          cuid={firebaseAuth.currentUser.uid}
          postKey={post.postId}
          likes={post.likes}
          time={post.time}
          onUserClick={() => navigate(`/${post.postId}`)}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          marginBottom: 10,
        }}
      >
        <Comments
          sx={{ minWidth: 200, width: "90%", maxWidth: 500 }}
          comments={post.comments === "None" ? [] : post.comments} currUserId={user.uid} />
        <Grid container sx={{ minWidth: 200, width: "90%", maxWidth: 500 }}>
          <Grid item xs={9} >
            <TextField
              sx={{ width: "100%" }}
              type="text"
              multiline
              placeholder="Your comment"
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
            />
          </Grid>
          <Grid item xs={1} ></Grid>
          <Grid item xs={2} >
            <Button
              variant="contained"
              component="span"
              sx={{ width: "100%", height: "100%" }}
              onClick={() => {
                let comments = post.comments === "None" ? [] : post.comments;
                const newComment = {
                  commentId: currUser.userId + getCurrTime(),
                  user: {
                    username: currUser.username,
                    avatarUrl: currUser.avatarUrl,
                    userId: currUser.userId
                  },
                  text: commentText,
                  time: getCurrTime(),
                };
                comments = [...comments, newComment];
                let newPost = { ...post };
                newPost.comments = comments;
                setPost(newPost);
                setCommentText("");
              }}
            >
              Post
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default PostPage;
