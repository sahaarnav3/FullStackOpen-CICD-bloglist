import { useEffect, useState } from 'react';
import userService from '../services/users';

import Typography from '@mui/material/Typography';

//Row realted things
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let data = await userService.fetchUsers();
        setUsers(data);
      } catch (error) {
        console.log('Error Occurred in fetching Users. Try Again');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Typography variant="h4">Loading...</Typography>
      ) : (
        <div>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <h3 style={{ margin: 0 }}>Name</h3>
                  </TableCell>
                  <TableCell>
                    <h3 style={{ margin: 0 }}>Username</h3>
                  </TableCell>
                  <TableCell>
                    <h3 style={{ margin: 0 }}>Blogs Created</h3>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link to={`/users/${row.id}`}>{row.name}</Link>
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.blogs.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}
