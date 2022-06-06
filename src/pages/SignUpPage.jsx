import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../config/firebase-config";
import { getDatabase, ref, set } from "firebase/database";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./SignUp.css";

const NEW_USER_AVATAR_URL =
  "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const addNewUser = (userId, username, email, avatarUrl) => {
    const db = getDatabase();
    set(ref(db, "usersInfo/" + userId), {
      username: username,
      email: email,
      avatarUrl: avatarUrl,
      following: "None",
      followers: "None",
      userId: userId
    });
  };

  const signUpWithEmailAndPassword = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      addNewUser(user.uid, username, user.email, NEW_USER_AVATAR_URL);

      navigate("/");
    } catch (errCode) {
      if (errCode === "auth/weak-password") {
        setSignUpError("Weak password");
      } else if (errCode === "auth/email-already-in-use") {
        setSignUpError("Email already in use");
      } else if (errCode === "auth/too-many-requests") {
        setSignUpError("Too many requests");
      } else if (errCode === "auth/invalid-email") {
        setSignUpError("Invalid email");
      } else {
        setSignUpError("Check input fields (internal-error)");
      }
    }
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (userCred) {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="signup-page">
      <h1>SignUp</h1>
      <div className="signup-fields">
        <TextField
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='signup-page-error'>
        {signUpError}
      </div>      <Button
        sx={{ marginBottom: "10px" }}
        variant="contained"
        onClick={() => signUpWithEmailAndPassword()}
      >
        Sign Up
      </Button>
      <Button onClick={() => navigate("/signin")}>I have an account!</Button>
    </div>
  );
};

export default SignUp;
