import React from "react";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";

const Post = (props) => {
  return (
    <Card sx={{ maxWidth: 450, maxHeight: 450 }}>
      <CardHeader
        onClick={props.onUserClick}
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            alt={props.userName}
            aria-label="post"
            src={props.userPhoto}
          />
        }
        title={props.userName}
      />
      <CardMedia
        onClick={props.onPhotoClick}
        component="img"
        height="250"
        image={props.photo}
        alt="Photo"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
