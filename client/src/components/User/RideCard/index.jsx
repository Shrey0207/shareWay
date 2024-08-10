import React from 'react';
import Card from '../../layouts/Card';
import { Text, Button } from '@chakra-ui/react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import FadeInUp from '../../Animation/FadeInUp';
import axios from 'axios';
import { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const RideCard = props => {
  const { from, to, doj, price, nop, rideID, pid, uid, publisher } = props;
  const [msg, setMsg] = useState('Request Ride');

  const requestRide = async () => {
    try {
      await axios.post(`${apiUrl}/users/${uid}/requests`, {
        publisher_id: pid,
        ride_id: rideID,
      });
      setMsg('Ride Requested');
    } catch (err) {
      alert(`Error: ${err}`);
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
