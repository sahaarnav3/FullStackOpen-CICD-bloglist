import Blog from './BlogDetails';
import { useNavigate } from 'react-router-dom';
import { useBloglistData } from '../stores/bloglistStore';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { blogs } = useBloglistData();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    paddingBottom: 5,
  };

  return (
    <div>
      <h1>blogs</h1>
      {blogs.map((blog) => (
        <div className="blog" style={blogStyle} key={blog.id}>
          <div>
            <span>
              {blog.title} {blog.author}{' '}
            </span>
            <button onClick={() => navigate(`/blog-details/${blog.id}`)}>
              view
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
