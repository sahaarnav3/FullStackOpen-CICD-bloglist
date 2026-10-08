import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import CreateBlogForm from './CreateBlogForm';
import blogService from '../services/blogs';

vi.mock('../services/blogs');

test('form updates state and calls blogService.create with right details', async () => {
  const user = userEvent.setup();
  const setBlogs = vi.fn();
  const setSuccess = vi.fn();
  const currentBlogs = [];

  blogService.create.mockResolvedValue({
    title: 'Testing Form Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    id: '123',
  });

  render(
    <CreateBlogForm
      blogs={currentBlogs}
      setBlogs={setBlogs}
      setSuccessMessage={setSuccess}
    />
  );

  const titleInput = screen.getByLabelText(/title:/i);
  const authorInput = screen.getByLabelText(/author:/i);
  const urlInput = screen.getByLabelText(/url:/i);
  const createButton = screen.getByText('Create');

  await user.type(titleInput, 'Testing Form Title');
  await user.type(authorInput, 'Test Author');
  await user.type(urlInput, 'http://testurl.com');
  await user.click(createButton);

  expect(blogService.create).toHaveBeenCalledWith({
    title: 'Testing Form Title',
    author: 'Test Author',
    url: 'http://testurl.com',
  });

  expect(setBlogs).toHaveBeenCalledTimes(1);
});
