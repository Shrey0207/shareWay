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
        py="3rem"
        my="2rem"
        px="2rem"
        bg={'white'}
        position="relative"
        mx={['1rem', '2rem', '3rem', '4rem']}
        width="80vw"
        borderRadius="16px"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        height={{ xs: '400px', sm: '300px', md: '150px', lg: '150px' }}
      >
        <SimpleGrid columns={[1, 3, 4, 5, 6, 7]} spacing="40px">
          <Box
            w="100%"
            bgColor={'orange.200'}
            textAlign={'center'}
            verticalAlign={'middle'}
            h={'60px'}
            borderRadius={'50px'}
          >
            <Text fontWeight={600} fontSize={'3xl'}>
              {from}
            </Text>
          </Box>
          <Box
            w="100%"
            bgColor={'orange.200'}
            textAlign={'center'}
            verticalAlign={'middle'}
            h={'60px'}
            borderRadius={'50px'}
          >
            <Text fontWeight={600} fontSize={'3xl'}>
              {to}
            </Text>
          </Box>

          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'bold'}>Date of Journey:</Text>
            {doj}
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontSize={'3xl'}>{nop} Seats</Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <b>Price</b>
            <br />
            Rs. {price}
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontSize={'lg'}>
              <b>Ride by</b> <br />
              {publisher ? `${publisher.fname} ${publisher.lname}` : 'Unknown'}
            </Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Button onClick={requestRide}>{msg}</Button>
          </Box>
        </SimpleGrid>
      </Card>
    </FadeInUp>
  );
};

export default RideCard;
