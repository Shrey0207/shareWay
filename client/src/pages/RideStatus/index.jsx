import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Text,
  Flex,
  Icon,
  SimpleGrid,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';
import Navbar from '../../components/User/Navbar'; // Adjust the import path if necessary
import axios from 'axios';
import LoadingCard from '../../components/layouts/LoadingCard'; // Adjust the import path if necessary

const apiUrl = process.env.REACT_APP_API_URL;

const RideStatus = () => {
  const { slug } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/rides/${slug}/requests/`);
        setRideDetails(response.data);
      } catch (error) {
        console.error('Error fetching ride details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [slug]);

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Box align={'center'} py="2rem">
        <Text
          fontWeight={'bold'}
          fontSize="38px"
          mt="1rem"
          mb="1.5rem"
          mx="5rem"
        >
          Ride Details
        </Text>
        {loading ? (
          <LoadingCard />
        ) : (
          rideDetails && (
            <Box
              bg="white"
              p={['1rem', '2rem']}
              borderRadius="16px"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
              maxW="800px"
              mx={['1rem', '2rem', '3rem']}
              textAlign="left"
            >
              <SimpleGrid columns={[1, 2]} spacing="20px">
                <Flex align="center">
                  <Icon as={FaMapMarkerAlt} w={6} h={6} color="orange.400" />
                  <Box ml="3">
                    <Text fontWeight={'medium'}>From</Text>
                    <Text fontSize={'lg'} fontWeight={'bold'}>
                      {rideDetails.from}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center">
                  <Icon as={FaMapMarkerAlt} w={6} h={6} color="orange.400" />
                  <Box ml="3">
                    <Text fontWeight={'medium'}>To</Text>
                    <Text fontSize={'lg'} fontWeight={'bold'}>
                      {rideDetails.to}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center">
                  <Icon as={FaCalendarAlt} w={6} h={6} color="blue.400" />
                  <Box ml="3">
                    <Text fontWeight={'medium'}>Date of Journey</Text>
                    <Text fontSize={'lg'} fontWeight={'bold'}>
                      {rideDetails.doj}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center">
                  <Icon as={FaUsers} w={6} h={6} color="teal.400" />
                  <Box ml="3">
                    <Text fontWeight={'medium'}>Seats Available</Text>
                    <Text fontSize={'lg'} fontWeight={'bold'}>
                      {rideDetails.no_of_pass}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center">
                  <Icon as={FaMoneyBillWave} w={6} h={6} color="green.400" />
                  <Box ml="3">
                    <Text fontWeight={'medium'}>Price</Text>
                    <Text fontSize={'lg'} fontWeight={'bold'}>
                      Rs. {rideDetails.price}
                    </Text>
                  </Box>
                </Flex>
              </SimpleGrid>
            </Box>
          )
        )}
      </Box>
    </ChakraProvider>
  );
};

export default RideStatus;
