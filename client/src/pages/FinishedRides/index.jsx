import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Stack,
  useToast,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import axios from 'axios';
import FinishedRideCard from './finishedridecard';
import Navbar from '../../components/User/Navbar';

const FinishedRides = () => {
  const [rides, setRides] = useState({
    oldPostedRides: [],
    oldRequestedRides: [],
  });
  const toast = useToast();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const uid = localStorage.getItem('UID');
        const { data } = await axios.get(
          `http://localhost:8000/user/${uid}/completedrides`
        );
        setRides(data);
      } catch (error) {
        toast({
          title: 'Error fetching rides',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchRides();
  }, [toast]);

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Box
        p={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Heading mb={6} textAlign="center">
          Completed Rides
        </Heading>
        <Stack
          spacing={5}
          maxW="800px" // Set a max-width to ensure it doesn't stretch too wide on large screens
          width="100%"
        >
          {rides.oldPostedRides.map(ride => (
            <FinishedRideCard
              key={ride._id}
              ride={ride}
              isRequestedRide={false}
            />
          ))}
          {rides.oldRequestedRides.map(ride => (
            <FinishedRideCard
              key={ride._id}
              ride={ride}
              isRequestedRide={true}
            />
          ))}
        </Stack>
      </Box>
    </ChakraProvider>
  );
};

export default FinishedRides;
