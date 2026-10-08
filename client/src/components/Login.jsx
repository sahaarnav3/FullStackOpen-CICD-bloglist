import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNotificationActions } from '../stores/NotificationStore';
import { useUserStoreData, useUserStoreActions } from '../stores/userStore';
import { useField } from '../hooks';

const Login = () => {
  const { reset: resetUsername, ...username } = useField('text');
  const { reset: resetPassword, ...password } = useField('password');
  const { setNotificationMessage } = useNotificationActions();
  const { loginUser } = useUserStoreActions();
  const { user } = useUserStoreData();
  const navigate = useNavigate();

  // if (user) return navigate('/'); // this is not the right way, we need to let the component completely render before changing the state.
  //so we need to use useEffect so that the component completely finishes rendering or you can use the Navigate component. Navigate is better for this scenario.
  if (user) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!loginUser({ username: username.value, password: password.value }))
        throw new Error();
      resetUsername;
      resetPassword;
      navigate('/');
      setNotificationMessage('Successfully Logged In', 'success');
    } catch {
      setNotificationMessage('Wrong username or password', 'error');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Log in to application</h1>
      <div>
        <TextField
          label="username"
          {...username}
          variant="standard"
          sx={{
            '& .MuiInput-root': {
              fontSize: '1.4rem', // Increases input and placeholder size
            },
            '& .MuiInputLabel-root': {
              fontSize: '1.1rem', // Increases floating label size
            },
          }}
        />
      </div>
      <div>
        <TextField
          label="password"
          {...password}
          variant="standard"
          sx={{
            '& .MuiInput-root': {
              fontSize: '1.4rem', // Increases input and placeholder size
            },
            '& .MuiInputLabel-root': {
              fontSize: '1.1rem', // Increases floating label size
            },
            marginTop: '15px',
          }}
        />
      </div>
      <Button variant="contained" type="submit" sx={{ marginTop: '15px' }}>
        LOGIN
      </Button>
    </form>
  );
};

export default Login;
