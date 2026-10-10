import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import BlogDetails from './BlogDetails';
import { MemoryRouter } from "react-router-dom";
import useUserStore from "../stores/userStore";


test('renders complete blog information to unauthenticated users (Without buttons)', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User' },
  };

  const { container } = render(
    <MemoryRouter>
      <BlogDetails blog={blog} />
    </MemoryRouter>,
  );

  const element = screen.getByText(
    /Component testing is done with react-testing-library/i
  );
  expect(element).toBeDefined();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeNull();

  const url = screen.queryByText('http://testurl.com');
  expect(url).not.toBeNull();

  const likes = screen.queryByText('5 likes');
  expect(likes).not.toBeNull();

  const likeButton = screen.queryByText('like');
  expect(likeButton).toBeNull();

  const removeButton = screen.queryByText('remove');
  expect(removeButton).toBeNull();
});

test('Authenticated users who are not the blog’s creator are shown only the like button', async () => {
  useUserStore.setState({
    user: {
      username: "testuser",
      name: "Test Userr",
      token: "test-token",
    },
    token: "Bearer test-token",
  });

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testUsername' },
  };

  const { container } = render(
    <MemoryRouter>
      <BlogDetails blog={blog} />
    </MemoryRouter>,
  );

  const element = screen.getByText(
    /Component testing is done with react-testing-library/i
  );
  expect(element).toBeDefined();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeNull();

  const url = screen.queryByText('http://testurl.com');
  expect(url).not.toBeNull();

  const likes = screen.queryByText('5 likes');
  expect(likes).not.toBeNull();

  const likeButton = screen.queryByText('like');
  expect(likeButton).toBeNull();

  const removeButton = screen.queryByText('remove');
  expect(removeButton).toBeNull();
});

test('The blog’s creator is also shown the delete button', async () => {
  useUserStore.setState({
    user: {
      username: "testusername",
      name: "Test User",
      token: "test-token",
    },
    token: "Bearer test-token",
  });

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testusername' },
  };

  const { container } = render(
    <MemoryRouter>
      <BlogDetails blog={blog} />
    </MemoryRouter>,
  );

  const element = screen.getByText(
    /Component testing is done with react-testing-library/i
  );
  expect(element).toBeDefined();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeNull();

  const url = screen.queryByText('http://testurl.com');
  expect(url).not.toBeNull();

  const likes = screen.queryByText('5 likes');
  expect(likes).not.toBeNull();

  const likeButton = screen.queryByText('LIKE');
  expect(likeButton).not.toBeNull();

  const removeButton = screen.queryByText('REMOVE');
  expect(removeButton).not.toBeNull();
});
