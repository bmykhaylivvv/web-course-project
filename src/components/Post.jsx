import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import { CardActions, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, child, update, get, set } from "firebase/database";
import DeleteIcon from "@mui/icons-material/Delete";

const Post = (props) => {
  const navigate = useNavigate();
  const db = getDatabase();
  const [userAvatar, setUserAvatar] = useState("");
  const [color, setColor] = useState(
    props.likes !== "None" && props.likes.includes(props.cuid)
      ? "error"
      : "default"
  );
  const [likes, setLikes] = useState(
    props.likes === "None" ? [] : [...props.likes]
  );

  const getAvatar = async () => {
    const dbRef = ref(getDatabase());
    try {
      const avatar = await get(
        child(dbRef, "usersInfo/" + props.uid + "/avatarUrl")
      );

      if (avatar.exists()) {
        const avatarVal = avatar.val();
        setUserAvatar(avatarVal);
      } else {
        console.log("No avatar available");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (likes.length === 0)
      update(ref(db, "posts/" + props.postKey), { likes: "None" });
    else update(ref(db, "posts/" + props.postKey), { likes: likes });
  }, [likes, db, props.postKey]);

  useEffect(() => {
    getAvatar();
  }, []);

  const deletePost = () => {
    const dbRef = ref(db, "posts/" + props.postKey);
    set(dbRef, null);
    navigate("/profile");
  };

  return (
    <Card sx={{ minWidth: 200, width: "90%", maxWidth: 500 }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            alt={props.userName}
            aria-label="post"
            src={userAvatar}
          />
        }
        title={
          <div>
            <p>{props.userName}</p>{" "}
            <p style={{ color: "LightGray" }}>{props.time?.split(" ")[0]}</p>
          </div>
        }
        onClick={() => navigate(props.uid === props.cuid ? "/profile" : `/${props.uid}`)}
      />
      <CardMedia
        onClick={props.onPhotoClick}
        component="img"
        height="240"
        sx={{
          objectFit: "contain",
          cursor: props.cursor === undefined ? "pointer" : "",
        }}
        image={props.photo}
        alt="Photo"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setColor(color === "error" ? "default" : "error");
            if (color === "default") {
              setLikes([props.cuid, ...likes]);
            } else {
              setLikes([...likes.filter((value) => value !== props.cuid)]);
            }
          }}
        >
          <FavoriteIcon color={color} />
        </IconButton>
        <Typography>{likes.length}</Typography>
        {props.cuid === props.uid ? (
          <IconButton
            sx={{ marginLeft: "80%", cursor: "pointer" }}
            onClick={deletePost}
          >
            <DeleteIcon />
          </IconButton>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default Post;
