import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import "./HomePage.css";

import { firebaseAuth } from "../config/firebase-config";

const Home = () => {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await firebaseAuth.signOut();
      navigate("/signin");
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        navigate("/signin");
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="feed-posts">
        <Post
          userName={"kkulykk"}
          userPhoto={
            "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
          }
          photo={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
          text={"Summer vibes..."}
        />
        <Post
          userName={"kkulykk"}
          userPhoto={
            "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
          }
          photo={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
          text={"Summer vibes..."}
        />
        <Post
          userName={"kkulykk"}
          userPhoto={
            "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
          }
          photo={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
          text={"Summer vibes..."}
        />
      </div>
      {/* <button onClick={() => navigate("/profile")}>My Profile</button>
      <button onClick={() => logOut()}>Log Out</button> */}
    </div>
  );
};

export default Home;
