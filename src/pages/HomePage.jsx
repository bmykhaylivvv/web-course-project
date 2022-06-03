import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
            <p>Home111</p>
            <button onClick={() => navigate('/profile')}>My Profile</button>
            <button onClick={() => logOut()}>Log Out</button>
        </div>
    );
};

export default Home;
