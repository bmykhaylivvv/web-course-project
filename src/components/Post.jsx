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
import ToggleButton from "@mui/material/ToggleButton";

const Post = (props) => {
  const navigate = useNavigate();
  const [color, setColor] = React.useState("default");
  const [selected, setSelected] = React.useState(false);
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
            onClick={() => setColor(color === "error" ? "default" : "error")}
          />
        </IconButton>
        <ToggleButton
          value="check"
          selected={selected}
          onChange={() => {
            setSelected(!selected);
          }}
        >
          <FavoriteIcon />
        </ToggleButton>
        {/* <IconButton aria-label="add to favourites">
          <FavoriteIcon onClick={() =>toggleLike()}/>
        </IconButton> */}
      </CardActions>
    </Card>
  );
};

export default Post;
