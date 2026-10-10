import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";

import CreateBlogForm from "./CreateBlogForm";
import blogService from "../services/blogs";
import useUserStore from "../stores/userStore";
import useBloglistStore from "../stores/bloglistStore";

vi.mock("../services/blogs");

test("form updates state and calls blogService.create with right details", async () => {
  useUserStore.setState({
    user: {
      username: "testuser",
      name: "Test User",
      token: "test-token",
    },
    token: "Bearer test-token",
  });

  useBloglistStore.setState({
    blogs: [],
  });

  const user = userEvent.setup();

  blogService.create.mockResolvedValue({
    title: "Testing Form Title",
    author: "Test Author",
    url: "http://testurl.com",
    id: "123",
    likes: 0,
  });

  render(<CreateBlogForm />);

  await user.type(screen.getByLabelText(/title/i), "Testing Form Title");
  await user.type(screen.getByLabelText(/author/i), "Test Author");
  await user.type(screen.getByLabelText(/url/i), "http://testurl.com");
  await user.click(screen.getByRole("button", { name: /create/i }));

  await waitFor(() => {
    expect(blogService.create).toHaveBeenCalledWith({
      title: "Testing Form Title",
      author: "Test Author",
      url: "http://testurl.com",
    });
  });

  expect(useBloglistStore.getState().blogs).toHaveLength(1);

  expect(useBloglistStore.getState().blogs[0]).toMatchObject({
    title: "Testing Form Title",
    author: "Test Author",
    url: "http://testurl.com",
    id: "123",
  });
});

test("form does not create a blog because user is not logged in", async () => {
  vi.clearAllMocks();
  
  useUserStore.setState({
    user: null,
    token: "",
  });
  useBloglistStore.setState({
    blogs: [],
  });

  const user = userEvent.setup();

  render(<CreateBlogForm />);

  await user.type(screen.getByLabelText(/title/i), "Testing Form Title");
  await user.type(screen.getByLabelText(/author/i), "Test Author");
  await user.type(screen.getByLabelText(/url/i), "http://testurl.com");
  await user.click(screen.getByRole("button", { name: /create/i }));

  expect(blogService.create).not.toHaveBeenCalled();

  expect(useBloglistStore.getState().blogs).toHaveLength(0);
});
