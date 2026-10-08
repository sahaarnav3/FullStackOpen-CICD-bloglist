import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import BlogDetails from './BlogDetails';

test('renders complete blog information to unauthenticated users (Without buttons)', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User' },
  };

  const { container } = render(<BlogDetails blog={blog} />);

  const element = screen.getByText(
    /Component testing is done with react-testing-library/i
  );
  expect(element).toBeDefined();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeNull();

  const url = screen.queryByText('http://testurl.com');
  expect(url).not.toBeNull();

  const likes = screen.queryByText('likes 5');
  expect(likes).not.toBeNull();

  const likeButton = screen.queryByText('like');
  expect(likeButton).toBeNull();

  const removeButton = screen.queryByText('remove');
  expect(removeButton).toBeNull();
});

test('Authenticated users who are not the blog’s creator are shown only the like button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testUsername' },
  };

  const user = { name: 'Test User 2', username: 'username2' };
  const { container } = render(<BlogDetails blog={blog} user={user} />);

  const element = screen.getByText(
    /Component testing is done with react-testing-library/i
  );
  expect(element).toBeDefined();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeNull();

  const url = screen.queryByText('http://testurl.com');
  expect(url).not.toBeNull();

  const likes = screen.queryByText('likes 5');
  expect(likes).not.toBeNull();

  const likeButton = screen.queryByText('like');
  expect(likeButton).not.toBeNull();

  const removeButton = screen.queryByText('remove');
  expect(removeButton).toBeNull();
});

test('The blog’s creator is also shown the delete button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testusername' },
  };

  const user = { name: 'Test User', username: 'testusername' };
  const { container } = render(<BlogDetails blog={blog} user={user} />);

  const element = screen.getByText(
    /Component testing is done with react-testing-library/i
  );
  expect(element).toBeDefined();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeNull();

  const url = screen.queryByText('http://testurl.com');
  expect(url).not.toBeNull();

  const likes = screen.queryByText('likes 5');
  expect(likes).not.toBeNull();

  const likeButton = screen.queryByText('like');
  expect(likeButton).not.toBeNull();

  const removeButton = screen.queryByText('remove');
  expect(removeButton).not.toBeNull();
});
