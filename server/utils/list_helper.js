const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return {};
  return blogs.reduce(
    (acc, curr) => (curr.likes > acc.likes ? curr : acc),
    blogs[0]
  );
};

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return {};
  let mostBlogsList = blogs.reduce((acc, curr) => {
    acc[curr.author] = (acc[curr.author] || 0) + 1;
    return acc;
  }, {});
  let finalAuthor = { author: '', blogs: 0 };
  Object.keys(mostBlogsList).forEach((author) => {
    if (mostBlogsList[author] > finalAuthor.blogs) {
      finalAuthor = { author: author, blogs: mostBlogsList[author] };
    }
  });
  return finalAuthor;
};

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return {};
  let highestLikedAuthor = blogs.reduce((acc, curr) => {
    if (curr.likes > acc.likes) acc = curr;
    return acc;
  }, blogs[0]);
  return blogs.reduce(
    (acc, curr) => {
      if (curr.author === acc.author) acc.likes += curr.likes;
      return acc;
    },
    { author: highestLikedAuthor.author, likes: 0 }
  );
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
