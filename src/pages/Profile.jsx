import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Avatar from "@mui/material/Avatar";
import { getDatabase, ref, child, update, get } from "firebase/database";
import "./Profile.css";

const Profile = () => {
    const { userId } = useParams();
    const [username, setUsername] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userAvatar, setUserAvatar] = useState("")
    const [userPosts, setUserPosts] = useState([]);

    const getUserInfo = async () => {
      const dbRef = ref(getDatabase());
      try {
          const snapshot = await get(child(dbRef, `usersInfo/${userId}`));

          if (snapshot.exists()) {
              const snapshotVal = snapshot.val();

              setUsername(snapshotVal.username);
              setUserEmail(snapshotVal.email)
              setUserAvatar(snapshotVal.avatarUrl)

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

    useEffect(() => {
      getUserInfo();
        getUserPosts();
    }, []);

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
                    </div>
                </div>
                <ImageList
                    sx={{ width: 500, height: 450 }}
                    cols={3}
                    rowHeight={164}
                >
                    {userPosts.map((post) => (
                        <ImageListItem key={post.imageUrl}>
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
