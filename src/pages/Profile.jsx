import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, child, update, get } from "firebase/database";
import "./Profile.css";
import { firebaseAuth } from "../config/firebase-config";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [colorOfFollow, setColorOfFollow] = useState();
  const [currFollowing, setCurrFollowing] = useState();

  const user = firebaseAuth.currentUser;

  const getUserInfo = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `usersInfo/${userId}`));
      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();

        setUsername(snapshotVal.username);
        setUserEmail(snapshotVal.email);
        setUserAvatar(snapshotVal.avatarUrl);
        setUserFollowers(snapshotVal.followers);
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
          (post) => post.uid === userId
        );

        setUserPosts(currentUserPosts);
      } else {
        console.log("No data available");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrUserInfo = async (uid) => {
    const dbRef = ref(getDatabase());
      try {
        const currSnapshot = await get(child(dbRef, `usersInfo/${uid}`));
        
        if (currSnapshot.exists()) {
          const currSnapshotVal = currSnapshot.val();

          setCurrFollowing(currSnapshotVal.following);

          const follows = currSnapshotVal.following;
          setColorOfFollow((follows === "None" || !follows.includes(userId)) ? "success" : "error");
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
  }

  const updateFollowingsInDb = async () => {
    const db = getDatabase();
    if (currFollowing.length === 0) update(ref(db, "usersInfo/" + user.uid), { following: "None" });
    else update(ref(db, "usersInfo/" + user.uid), { following: currFollowing });
  };

  const updateFollowersInDb = async () => {
    const db = getDatabase();
    if (userFollowers.length === 0) update(ref(db, "usersInfo/" + userId), { followers: "None" });
    else update(ref(db, "usersInfo/" + userId), { followers: userFollowers });
  };

  useEffect(() => {
    getUserInfo();
    getUserPosts();
  }, []);

  useEffect(() => {
    if (user) {
      getCurrUserInfo(user.uid);
    }
  }, [user]);

  useEffect(() => {
    updateFollowingsInDb();
    if (userFollowers.length !== 0) {
      updateFollowersInDb();
    }
  }, [currFollowing, userFollowers]);

  return (
    <div>
      <Header />
      <div className="profile-page">
        <div className="my-profile-info">
          <Avatar
            alt={username}
            src={userAvatar}
            sx={{ width: 80, height: 80 }}
          />
          <div className="my-profile-text-data">
            <h3>{username}</h3>
            <p>{userEmail}</p>
            <p>{userFollowers === "None" ? 0 : userFollowers.length} followers</p>
            <Button variant="contained" size="small" color={colorOfFollow}
            onClick={() => {
              setColorOfFollow(colorOfFollow === "success" ? "error" : "success");
              let newFollowing;
              let newFollowers;
              if (colorOfFollow === "error") {
                newFollowing = [...currFollowing.filter((value) => value !== userId)];
                if (newFollowing.length === 0)
                  newFollowing = "None";
                newFollowers = [...userFollowers.filter((value) => value !== user.uid)];
                if (newFollowers.length === 0)
                  newFollowers = "None";
              } else {
                if (currFollowing === "None" || currFollowing === undefined) {
                  newFollowing = [userId];
                } else {
                  newFollowing = [...currFollowing, userId];
                }

                if (userFollowers === "None" || userFollowers === undefined) {
                  newFollowers = [user.uid];
                } else {
                  newFollowers = [...userFollowers, user.uid];
                }
              }

              setCurrFollowing(newFollowing);
              setUserFollowers(newFollowers);
            }}>{colorOfFollow === undefined ? "" : (colorOfFollow === "success" ? "follow" : "unfollow")}</Button>
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
              onClick={() => navigate(`/${username}/${post.postId}`)}
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

export default Profile;
