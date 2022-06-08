import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";

export default function Comments(props) {
  const navigate = useNavigate();
  return (
    <List sx={{ width: '90%', minWidth: 200, maxWidth: 500, bgcolor: 'background.paper' }}>
        {props.comments.map((comment) => (
          <div key={comment.commentId}>
            <ListItem alignItems="flex-start" >
                <ListItemAvatar>
                <Avatar alt={comment.user.username} src={comment.user.avatarUrl} 
                onClick={() => navigate(comment.user.userId === props.currUserId ? "/profile" : `/${comment.user.userId}`)}/>
                </ListItemAvatar>
                <ListItemText
                primary={<div style={{width:"100%"}}><p style={{width:"70%", display: "inline-block"}}>{comment.user.username}</p> <p style={{color:"LightGray", float:'right', width:"20%", display: "inline-block"}}>{ comment.time.split(' ')[0]}</p></div>}
                // <p>{props.userName}</p> <p style={{color:"LightGray"}}>{ props.time.split(' ')[0]}</p>
                secondary={
                    <React.Fragment>
                    {comment.text}
                    </React.Fragment>
                }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
    </List>
  );
}