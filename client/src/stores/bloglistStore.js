//we have to make it such that all the operations reagarding can be done and only when user is logged in.
//handle notifications in the components only, use zustand to handle only state.

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import blogService from '../services/blogs';

const useBloglistStore = create((set, get) => {
  return {
    blogs: [],
    actions: {
      initialize: async () => {
        const data = await blogService.getAll();
        const sortedData = data.sort((a, b) => b.likes - a.likes);
        set({
          blogs: sortedData,
        });
      },
      addNewBlog: async (blogDetails) => {
        const blogResponse = await blogService.create(blogDetails);
        if (blogResponse) {
          set({
            blogs: get().blogs.concat(blogResponse),
          });
          return true;
        }
        return false;
      },
      updateBlogLike: async (blogDetails) => {
        const requestBody = { likes: blogDetails.likes + 1 };
        const updatedResponse = await blogService.update(
          requestBody,
          blogDetails.id
        );
        if (updatedResponse) {
          set({
            blogs: get()
              .blogs.map((blog) =>
                blog.id === blogDetails.id ? updatedResponse : blog
              )
              .sort((a, b) => b.likes - a.likes),
          });
          return true;
        }
        return false;
      },
      deleteBlog: async (blogDetails) => {
        const response = await blogService.deleteBlog(blogDetails.id);
        if (response.status === 204) {
          set({
            blogs: get()
              .blogs.filter((blog) => blog.id !== blogDetails.id)
              .sort((a, b) => b.likes - a.likes),
          });

          return true;
        }
        return false;
      },
      addComment: async (blogDetails, comment) => {
        const response = await blogService.addComment(blogDetails.id, {
          comment: comment,
        });
        if (response.status === 200) {
          set({
            blogs: get().blogs.map((blog) =>
              blog.id === blogDetails.id ? {...blog, comments: blog.comments.concat(comment)} : blog
            ),
          });
          return true;
        }
        return false;
      },
    },
  };
});

export const useBloglistData = () =>
  useBloglistStore(
    useShallow((state) => ({
      blogs: state.blogs,
    }))
  );

export const useBloglistActions = () =>
  useBloglistStore((state) => state.actions);
