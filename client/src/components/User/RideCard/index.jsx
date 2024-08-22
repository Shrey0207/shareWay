import React, { useState, useEffect } from 'react';
import { useToast, Box, Text, Button, SimpleGrid } from '@chakra-ui/react';
import axios from 'axios';
import FadeInUp from '../../Animation/fadeinup';
import Card from '../../layouts/Card';

const apiUrl = process.env.REACT_APP_API_URL;

const RideCard = ({
  from,
  to,
  doj,
  price,
  nop,
  rideID,
  pid,
  uid,
  publisher,
  arrivalTime, // New arrival time prop
  departureTime, // New departure time prop
}) => {
  const [msg, setMsg] = useState('Request Ride');
  const toast = useToast();

  useEffect(() => {
    const checkRequestStatus = async () => {
      const uid = localStorage.getItem('UID');

      try {
        const response = await axios.get(`${apiUrl}/users/${uid}/requests`);
        console.log('Response data:', response.data);
        const requests = response.data;
        const existingRequest = requests.find(
          request => request.ride_id._id === rideID
        );

        if (existingRequest) {
          setMsg(
            existingRequest.status === 'pending'
              ? 'Ride Requested'
              : 'Requested'
          );
        }
      } catch (err) {
        console.error('Error fetching request status:', err);
      }
    };

    checkRequestStatus();
  }, [rideID, uid]);

  const requestRide = async () => {
    try {
      const response = await axios.post(`${apiUrl}/users/${uid}/requests`, {
        publisher_id: pid,
        ride_id: rideID,
      });

      setMsg('Ride Requested');
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <FadeInUp>
      <Card
        py="2rem"
        my="1.5rem"
        px="2rem"
        bg={'white'}
        position="relative"
        mx={['1rem', '1.5rem', '2rem', '3rem']}
        width="100%"
        maxW="800px"
        borderRadius="12px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)"
      >
        <SimpleGrid columns={[1, 2, 3, 4]} spacing="20px">
          <Box
            w="100%"
            bgColor={'orange.200'}
            textAlign={'center'}
            borderRadius={'12px'}
            py="2"
            px="4"
          >
            <Text fontWeight={600} fontSize={'lg'}>
              {from}
            </Text>
          </Box>
          <Box
            w="100%"
            bgColor={'orange.200'}
            textAlign={'center'}
            borderRadius={'12px'}
            py="2"
            px="4"
          >
            <Text fontWeight={600} fontSize={'lg'}>
              {to}
            </Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Date of Journey</Text>
            <Text fontSize={'md'}>{doj}</Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Seats Available</Text>
            <Text fontSize={'md'}>{nop}</Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Price</Text>
            <Text fontSize={'md'}>Rs. {price}</Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Ride by</Text>
            <Text fontSize={'md'}>
              {publisher ? `${publisher.fname} ${publisher.lname}` : 'Unknown'}
            </Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Arrival Time</Text>
            <Text fontSize={'md'}>{arrivalTime}</Text> {/* Arrival time */}
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Departure Time</Text>
            <Text fontSize={'md'}>{departureTime}</Text> {/* Departure time */}
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Button onClick={requestRide} colorScheme="teal" size="sm">
              {msg}
            </Button>
          </Box>
        </SimpleGrid>
      </Card>
    </FadeInUp>
  );
};

export default RideCard;
