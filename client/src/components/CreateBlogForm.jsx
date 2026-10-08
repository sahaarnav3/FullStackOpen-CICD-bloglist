import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNotificationActions } from '../stores/NotificationStore';
import { useBloglistActions } from '../stores/bloglistStore';
import { useUserStoreData } from '../stores/userStore';

import { useField } from '../hooks/index';

export default function CreateBlogForm() {
  const {reset: resetTitle, ...title} = useField('text')
  const {reset: resetAuthor, ...author} = useField('text')
  const {reset: resetUrl, ...url} = useField('text')
  const { setNotificationMessage } = useNotificationActions();
  const { addNewBlog } = useBloglistActions();
  const { user } = useUserStoreData();

  const createFormHandler = async (e) => {
    e.preventDefault();
    if (!user)
      return setNotificationMessage(
        'Please login first to create blog',
        'error'
      );
    try {
      if (addNewBlog({ title: title.value, author: author.value, url: url.value }))
        setNotificationMessage(`a new blog ${title.value} added`, 'success');
      resetTitle();
      resetAuthor();
      resetUrl();
    } catch {
      setNotificationMessage('Blog Adding Failed', 'error');
    }
  };

  return (
    <form onSubmit={createFormHandler}>
      <h1>create new</h1>
      <div>
        <TextField
          label="title"
          variant="outlined"
          {...title}
          sx={{ width: '50%' }}
        />
      </div>
      <div>
        <TextField
          label="author"
          variant="outlined"
          {...author}
          sx={{ marginTop: '15px', width: '50%' }}
        />
      </div>
      <div>
        <TextField
          label="url"
          variant="outlined"
          {...url}
          sx={{ marginTop: '15px', width: '50%' }}
        />
      </div>
      <Button variant="contained" type="submit" sx={{ marginTop: '15px' }}>
        CREATE
      </Button>
    </form>
  );
}
