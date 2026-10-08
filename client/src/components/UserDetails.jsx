import { useParams } from 'react-router-dom';
import userService from '../services/users';
import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';

export default function UserDetails() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await userService.fetchUserBlogs(id);
      setUserDetails(details);
      setLoading(false)
    };
    fetchDetails();
  }, []);
  return (
    <>
      {loading ? (
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
      ) : (
        <div>
          <Typography variant="h4" gutterBottom>
            {userDetails?.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            added blogs
          </Typography>
          <ul>
            {userDetails &&
              userDetails.blogs.map((blog) => (
                <li key={blog.id}>
                  <Typography variant="body1">{blog.title}</Typography>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}
