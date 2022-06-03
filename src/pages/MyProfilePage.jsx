import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, firebaseStorage } from "../config/firebase-config";
import {
    ref as sRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

import { getDatabase, ref, child, update, get } from "firebase/database";


const MyProfilePage = () => {
    const navigate = useNavigate();
    const [currentUserInfo, setCurrentUserInfo] = useState({});
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleFileAdd = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const getUserInfo = async (userId) => {
        const dbRef = ref(getDatabase());
        try {
            const snapshot = await get(child(dbRef, `usersInfo/${userId}`));

            if (snapshot.exists()) {
                const snapshotVal = snapshot.val();
                const currentUserInfoObject = {
                    username: snapshotVal.username,
                    email: snapshotVal.email,
                    avatarUrl: snapshotVal.avatarUrl,
                };

                setCurrentUserInfo(currentUserInfoObject);
            } else {
                console.log("No data available");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateAvatar = async () => {
        const storageRef = sRef(
            firebaseStorage,
            `/userAvatars/${Date.now()}${fileName}`
        );
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        const db = getDatabase();
        const updates = {};
        updates['/usersInfo/' + firebaseAuth.currentUser.uid] = {
            email: currentUserInfo.email,
            username: currentUserInfo.username,
            avatarUrl: downloadUrl
        };

        await update(ref(db), updates);
        getUserInfo(firebaseAuth.currentUser.uid)
        setFile(null)
        setFileName('')

    };

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

            if (userCred) {
                getUserInfo(userCred.uid);
            }
        });
    }, []);

    return (
        <div>
            <h3>MyProfilePage</h3>
            <img src={currentUserInfo?.avatarUrl} alt="User avatar" />
            <input type="file" onChange={(e) => handleFileAdd(e)} />
            <button onClick={() => updateAvatar()}>
                Update profile photo
            </button>
            <p>{currentUserInfo?.username}</p>
            <p>{currentUserInfo?.email}</p>
            <button onClick={() => logOut()}>Log Out</button>
        </div>
    );
};

export default MyProfilePage;
