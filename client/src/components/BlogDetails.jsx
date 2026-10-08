import {
  Card,
  CardContent,
  Typography,
  Link,
  CardActions,
  Button,
  Box,
  TextField,
} from '@mui/material';

import { useBloglistActions } from '../stores/bloglistStore';
import { useNotificationActions } from '../stores/NotificationStore';
import { useUserStoreData } from '../stores/userStore';
import { useNavigate } from 'react-router-dom';
import { useField } from '../hooks/index';

const BlogDetails = ({ blog }) => {
  const { updateBlogLike, deleteBlog, addComment } = useBloglistActions();
  const { setNotificationMessage } = useNotificationActions();
  const { user } = useUserStoreData();
  const navigate = useNavigate();
  const { reset: resetComment, ...comment } = useField('text');

  if (!blog) return <h1>404 - Blog Not Found</h1>;

  function updateBlogHandler(blog) {
    if (updateBlogLike(blog))
      setNotificationMessage('Likes Updated', 'success');
    else setNotificationMessage("Likes couldn't be updated", 'error');
  }

  function deleteBlogHandler(blog) {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (!confirm) return;
    if (deleteBlog(blog)) {
      setNotificationMessage('Blog Deleted', 'success');
      navigate('/');
    } else setNotificationMessage("Blog can't be deleted", 'error');
  }

  function commentHandler() {
    if (addComment(blog, comment.value))
      setNotificationMessage('Comment Added Successfully', 'success');
    else
      setNotificationMessage(
        "Comment couldn't be added. Please Try Again",
        'error'
      );
    resetComment();
  }

  return (
    blog && (
      <Card
        variant="outlined"
        sx={{
          maxWidth: '75%',
          borderRadius: '4px',
          borderColor: '#e0e0e0',
          boxShadow: 'none',
          marginTop: '20px',
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 500, mb: 1.5, color: '#111' }}
          >
            {blog.title}
          </Typography>

          <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
            {blog.author}
          </Typography>

          <Link
            href="reactpatterns.com"
            underline="hover"
            target="_blank"
            rel="noopener"
            sx={{ display: 'inline-block', mb: 1, color: '#1976d2' }}
          >
            {blog.url}
          </Link>

          <Typography variant="body2" sx={{ color: '#666' }}>
            Added by {blog.user.name}
          </Typography>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: '#111' }}
            >
              {blog.likes} likes
            </Typography>
          </Box>

          {user && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: '#1976d2',
                borderColor: '#b3d4fc',
                px: 2,
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: '#f0f7ff',
                },
              }}
              onClick={() => updateBlogHandler(blog)}
            >
              LIKE
            </Button>
          )}
          {user && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: '#f44336',
                borderColor: '#ffcdd2',
                px: 2,
                '&:hover': {
                  borderColor: '#f44336',
                  backgroundColor: '#ffebee',
                },
              }}
              onClick={() => deleteBlogHandler(blog)}
              disabled={blog.user.username === user.username ? '' : 'disabled'}
            >
              REMOVE
            </Button>
          )}
          <br />
        </CardActions>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h5" gutterBottom>
            comments
          </Typography>
          <div style={{ display: 'flex' }}>
            <TextField
              {...comment}
              placeholder="add a comment"
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              style={{ marginLeft: '10px' }}
              onClick={commentHandler}
            >
              Add Comment
            </Button>
          </div>
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment}>
                <Typography variant="body1">{comment}</Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  );
};

export default BlogDetails;
