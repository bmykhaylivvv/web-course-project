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
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {props.comments.map((comment) => (
          <div key={comment.commentId}>
            <ListItem alignItems="flex-start" >
                <ListItemAvatar>
                <Avatar alt={comment.user.username} src={comment.user.avatarUrl} 
                onClick={() => navigate(comment.user.userId === props.currUserId ? "/profile" : `/${comment.user.userId}`)}/>
                </ListItemAvatar>
                <ListItemText
                primary={comment.user.username + " " + comment.time.split(' ')[0]}
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