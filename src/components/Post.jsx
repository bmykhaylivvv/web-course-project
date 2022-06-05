import React from "react";
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
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, child, update, get, set, push} from "firebase/database";

const Post = (props) => {
  const navigate = useNavigate();
  const db = getDatabase();
  const [color, setColor] = React.useState((props.likes!== "None" && props.likes.includes(props.cuid)) ? "error": "default");
  const [likes, setLikes] = React.useState(props.likes==="None"?[]:[...props.likes]);
  React.useEffect(() =>{
    if(likes.length === 0) update(ref(db, "posts/" + props.postKey), {likes: "None"});
    else update(ref(db, "posts/" + props.postKey), {likes: likes});
  }, [likes, db, props.postKey]);
  return (
    <Card sx={{ minWidth: 200, width: "90%", maxWidth: 500 }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            alt={props.userName}
            aria-label="post"
            src={props.userPhoto}
          />
        }
        title={props.userName}
        onClick={() => navigate(`/${props.uid}`)}
      />
      <CardMedia
        onClick={props.onPhotoClick}
        component="img"
        width="450"
        image={props.photo}
        alt="Photo"
      />
      <CardContent sx={{ maxHeight: 600 }}>
        <Typography variant="body2" color="text.secondary">
          {props.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <FavoriteIcon
            color={color} 
            onClick={ () => {
              setColor(color === "error" ? "default" : "error");
              if(color === "default"){
                setLikes([props.cuid, ...likes]);
              }else{
                setLikes([...(likes.filter((value)=> value !== props.cuid))]);
              }
            }}
          />
        </IconButton>
        <Typography>
          {likes.length}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default Post;
