import { useState, useEffect } from 'react';
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import {
  useNotificationData,
  useNotificationActions,
} from './stores/NotificationStore';
import { useBloglistData, useBloglistActions } from './stores/bloglistStore';
import { useUserStoreData, useUserStoreActions } from './stores/userStore';

import BlogDetails from './components/BlogDetails';
import CreateBlogForm from './components/CreateBlogForm';
import FallbackComponent from './components/FallbackComponent';
import Home from './components/Home';
import Login from './components/Login';
import Notification from './components/Notification';
import Users from './components/Users';
import UserDetails from './components/UserDetails';

import blogService from './services/blogs';

const App = () => {
  const navigate = useNavigate();
  const { message, severity } = useNotificationData();
  const { setNotificationMessage } = useNotificationActions();
  const { blogs } = useBloglistData();
  const { initialize } = useBloglistActions();
  const { user } = useUserStoreData();
  const { checkUserPresent, logoutUser } = useUserStoreActions();

  useEffect(() => {
    initialize();
    checkUserPresent();
  }, []);

  const match = useMatch('/blog-details/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    window.location.reload();
  };

  return (
    <Container>
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Blog App
              </Typography>
              <Button color="inherit" sx={{ fontSize: '16px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  BLOGS
                </Link>
              </Button>
              <Button color="inherit" sx={{ fontSize: '16px' }}>
                <Link
                  to="/users"
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  USERS
                </Link>
              </Button>
              <Button color="inherit" sx={{ fontSize: '16px' }}>
                <Link
                  to="/create"
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  NEW BLOG
                </Link>
              </Button>
              {user ? (
                <Button
                  color="inherit"
                  onClick={() => handleLogout()}
                  sx={{ fontSize: '16px' }}
                >
                  LOGOUT
                </Button>
              ) : (
                <Button color="inherit" sx={{ fontSize: '16px' }}>
                  <Link
                    to="/login"
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    LOGIN
                  </Link>
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </Box>
        <Notification />
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateBlogForm />} />
            <Route
              path="/blog-details/:id"
              element={<BlogDetails blog={blog} />}
            />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </ErrorBoundary>
      </>
    </Container>
  );
};

export default App;
