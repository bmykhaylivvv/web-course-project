import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
      <p>Home111</p>
    </div>
  );
};

export default Home;
