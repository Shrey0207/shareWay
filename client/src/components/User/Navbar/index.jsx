import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
export default function Navbar() {
  const [name, setName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('tokenID');
        if (token) {
          const response = await axios.get(`${apiUrl}/user/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Check if the request was successful
          if (response.data.success) {
            const user = response.data.user;
            setName(`${user.fname} ${user.lname}`);
          } else {
            console.error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const publishRide = () => {
    navigate('/user/dashboard/publish');
  };
  const myprofile = () => {
    navigate('/user/profile');
  };
  const frides = () => {
    navigate('/user/finishedrides');
  };
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <ChakraProvider theme={theme}>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Text fontWeight={'bold'}>ShareWay</Text>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <Link href="/user/UserRides">My Rides</Link>
              <Link href="/user/dashboard/search">Search Rides</Link>
              <Link href="/user/dashboard/myrequests">Requests Status</Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              variant={'solid'}
              bgColor={'orange.200'}
              size={'sm'}
              mr={4}
              leftIcon={<AddIcon />}
              onClick={publishRide}
            >
              Publish Ride
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1565802527863-1353e4ebce91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=712&q=80'
                  }
                />
              </MenuButton>
              <MenuList>
                <Text p={'1rem'} fontWeight={'bold'}>
                  {name}
                </Text>
                <MenuItem onClick={myprofile}>My Profile</MenuItem>
                <MenuItem onClick={frides}>Finished Rides</MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4} p={'1rem'}>
              <Link href="/user/UserRides">My Rides</Link>
              <Link href="/user/dashboard/search">Search Rides</Link>
              <Link href="/user/dashboard/myrequests">Requests Status</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </ChakraProvider>
  );
}
