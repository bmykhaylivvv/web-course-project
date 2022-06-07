import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, firebaseStorage } from "../config/firebase-config";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./AddPostPage.css";

import {
  getDatabase,
  ref,
  child,
  update,
  get,
  set,
  push,
} from "firebase/database";

const AddPostPage = () => {
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addNewPost = async () => {
    const db = getDatabase();
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(
        child(dbRef, `usersInfo/${firebaseAuth.currentUser.uid}`)
      );

      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();

        const newPostKey = push(child(ref(db), "posts")).key;
        set(ref(db, "posts/" + newPostKey), {
          postId: newPostKey,
          username: snapshotVal.username,
          uid: firebaseAuth.currentUser.uid,
          imageUrl: imageUrl,
          postText: postText,
          likes: "None",
        });

        navigate("/profile");
      } else {
        console.log("No data available");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileAdd = async (event) => {
    const storageRef = sRef(
      firebaseStorage,
      `/postImages/${Date.now()}${event.target.files[0].name}`
    );
    await uploadBytes(storageRef, event.target.files[0]);
    const downloadUrl = await getDownloadURL(storageRef);

    setImageUrl(downloadUrl);
  };
  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        navigate("/signin");
      }
    });
  }, []);

  return (
    <div className="add-post-page">
      <Header />
      <div className="add-post-text">
        <h3>Add new post</h3>
        {imageUrl ? (
          <img className="image-post" src={imageUrl} alt="User avatar" />
        ) : null}
        <input type="file" onChange={(e) => handleFileAdd(e)} />
      </div>

      <TextField
        sx={{ width: "90%", minWidth: "200px", maxWidth:"500px", marginBottom: "50px" }}
        type="text"
        multiline
        placeholder="Your post text"
        onChange={(e) => setPostText(e.target.value)}
      />
      {imageUrl ? (
      <Button variant="contained" onClick={() => addNewPost()}>
        Add post
      </Button>
      ) : null}
    </div>
  );
};

export default AddPostPage;
