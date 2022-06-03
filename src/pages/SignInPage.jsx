import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "@firebase/auth";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const SignInPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  const logInWithEmailAndPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      navigate("/feed");
    } catch (err) {
      const errCode = err.code;
      const errMessage = err.message;
      console.log(errCode);

      if (errCode === "auth/wrong-password") {
        setSignInError("Wrong password");
      } else if (errCode === "auth/user-not-found") {
        setSignInError("User not found");
      } else if (errCode === "auth/too-many-requests") {
        setSignInError("Too many requests");
      } else if (errCode === "auth/invalid-email") {
        setSignInError("Invalid email");
      } else {
        setSignInError("Check input fields (internal-error)");
      }
    }
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (userCred) {
        navigate("/feed");
      }
    });
  }, []);

  return (
    <div className="signup-page">
      <h1>Sign In</h1>
      <div className="signup-fields">
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
      {signInError}
      <Button
        sx={{ marginBottom: "10px" }}
        variant="contained"
        onClick={() => logInWithEmailAndPassword()}
      >
        Sign In
      </Button>
      <Button onClick={() => navigate("/signup")}>Create new account</Button>
    </div>
  );
};

export default SignInPage;
