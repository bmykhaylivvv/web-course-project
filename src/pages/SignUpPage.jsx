import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../config/firebase-config";
import { getDatabase, ref, set } from "firebase/database";

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
            <p>SignUp Page</p>

            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
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
            <button onClick={() => signUpWithEmailAndPassword()}>
                Sign Up
            </button>
            <button onClick={() => navigate("/signin")}>
                I have account!)
            </button>
        </div>
    );
};

export default SignUp;
