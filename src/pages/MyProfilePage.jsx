import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, firebaseStorage } from "../config/firebase-config";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";
import Avatar from "@mui/material/Avatar";
import { getDatabase, ref, child, update, get } from "firebase/database";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import "./MyProfilePage.css";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userPosts, setUserPosts] = useState([]);

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

  const getUserPosts = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `posts`));

      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();

        const currentUserPosts = Object.values(snapshotVal).filter(
          (post) => post.uid === firebaseAuth.currentUser.uid
        );

        setUserPosts(currentUserPosts);
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
    updates["/usersInfo/" + firebaseAuth.currentUser.uid] = {
      email: currentUserInfo.email,
      username: currentUserInfo.username,
      avatarUrl: downloadUrl,
    };

    await update(ref(db), updates);
    getUserInfo(firebaseAuth.currentUser.uid);
    navigate(0);
    setFile(null);
    setFileName("");
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        navigate("/signin");
      }

      if (userCred) {
        getUserInfo(userCred.uid);
        getUserPosts();
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="my-profile-page">
        <div className="my-profile-info">
          <Avatar
            alt={currentUserInfo?.username}
            src={currentUserInfo?.avatarUrl}
            sx={{ width: 80, height: 80 }}
          />
          <div className="my-profile-text-data">
            <h3>Hello, {currentUserInfo?.username}</h3>
            <p>{currentUserInfo?.email}</p>
            <input type="file" onChange={(e) => handleFileAdd(e)} />
            <button onClick={() => updateAvatar()}>Update profile photo</button>
          </div>
        </div>

        <ImageList
          sx={{ minWidth: 200, maxWidth: 550, width: "90%", height: 450 }}
          cols={3}
          rowHeight={164}
        >
          {userPosts.map((post) => (
            <ImageListItem
              key={post.imageUrl}
              onClick={() =>
                navigate(`/${currentUserInfo?.username}/${post.uid}`)
              }
            >
              <img
                src={`${post.imageUrl}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${post.imageUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={post.postText}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
};

export default MyProfilePage;
