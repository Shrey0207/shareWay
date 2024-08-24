import React, { useEffect, useState } from 'react';
import Navbar from '../../components/User/Navbar';
import {
  Text,
  ChakraProvider,
  theme,
  Box,
  Table,
  Thead,
  Th,
  Td,
  Tr,
  Tbody,
  Button,
  TableContainer,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const Profile = () => {
  const [user, setUser] = useState(null);
  const toast = useToast();

  const handleUpdateClick = () => {
    // Show a toast notification when the button is clicked
    toast({
      title: 'Update not allowed.',
      description: 'Please contact the administrator to update your data.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenID')}`,
          },
        });

        // Check if the request was successful
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <ChakraProvider theme={theme}>
      <Navbar />

      <Text fontWeight={'bold'} fontSize="38px" my="4rem" mx="5rem">
        Welcome {user.fname} {user.lname}!
      </Text>
      <Box
        align="center"
        px={'2rem'}
        maxW={['460px', '700px', '1000px', '1300px']}
      >
        <TableContainer mb={'2rem'}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Data</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>First Name</Td>
                <Td>{user.fname}</Td>
              </Tr>
              <Tr>
                <Td>Last Name</Td>
                <Td>{user.lname}</Td>
              </Tr>
              <Tr>
                <Td>Registration No.</Td>
                <Td>{user.UID}</Td>
              </Tr>
              <Tr>
                <Td>Email</Td>
                <Td>{user.email}</Td>
              </Tr>
              <Tr>
                <Td>Phone</Td>
                <Td>{user.phone}</Td>
              </Tr>
              <Tr>
                <Td>User Type</Td>
                <Td>{user.user_type}</Td>
              </Tr>
              <Tr>
                <Td>Designation</Td>
                <Td>{user.designation}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Button onClick={handleUpdateClick}>Update Data</Button>{' '}
        {/* Handle click event */}
      </Box>

      <br />
      <br />
      <br />
      <br />
    </ChakraProvider>
  );
};

export default Profile;
