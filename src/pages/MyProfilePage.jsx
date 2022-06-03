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

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];

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
    updates["/usersInfo/" + firebaseAuth.currentUser.uid] = {
      email: currentUserInfo.email,
      username: currentUserInfo.username,
      avatarUrl: downloadUrl,
    };

    await update(ref(db), updates);
    getUserInfo(firebaseAuth.currentUser.uid);
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

        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
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
