import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "@firebase/auth";

const SignInPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signUpError, setSignUpError] = useState("");

    const logInWithEmailAndPassword = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );

            navigate("/");
        } catch (err) {
            // TO DO! Handle errors
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
        <div>
            <p>SignIn Page</p>
            <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {signUpError}
            <button onClick={() => logInWithEmailAndPassword()}>
                Sign In
            </button>
            <button onClick={() => navigate("/signup")}>
                Create new account!)
            </button>
        </div>
    );
};

export default SignInPage;
