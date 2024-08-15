import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Text,
  Flex,
  Icon,
  SimpleGrid,
  ChakraProvider,
  Button,
  useToast,
  SlideFade,
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
} from 'react-icons/fa';
import Navbar from '../../components/User/Navbar';
import axios from 'axios';
import LoadingCard from '../../components/layouts/LoadingCard';

const apiUrl = process.env.REACT_APP_API_URL;

const RideStatus = () => {
  const { slug } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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

    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/rides/${slug}/requesters`);
        setPendingRequests(
          response.data.requests.filter(req => req.status === 'pending')
        );
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchRideDetails();
    fetchPendingRequests();
  }, [slug]);

  const handleStatusChange = async (requestId, status) => {
    try {
      await axios.put(`${apiUrl}/rides/${slug}/request/${requestId}`, {
        status,
      });
      setPendingRequests(prevRequests =>
        prevRequests.filter(req => req._id !== requestId)
      );
      toast({
        title: `Request ${status === 'approved' ? 'accepted' : 'rejected'}`,
        status: status === 'approved' ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        `Error ${status === 'approved' ? 'approving' : 'rejecting'} request:`,
        error
      );
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
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
          <>
            {rideDetails && (
              <Box
                bg="white"
                p={['1rem', '2rem']}
                borderRadius="16px"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                maxW="800px"
                mx={['1rem', '2rem', '3rem']}
                textAlign="left"
                animation="fadeIn 0.5s ease-out"
              >
                <SimpleGrid columns={[1, 2]} spacing="20px">
                  <Flex align="center">
                    <Icon
                      as={FaMapMarkerAlt}
                      w={6}
                      h={6}
                      color="orange.400"
                      transition="color 0.3s ease"
                    >
                      <Box
                        _hover={{
                          color: 'orange.600',
                          transform: 'scale(1.1)',
                        }}
                        transition="transform 0.3s ease, color 0.3s ease"
                      />
                    </Icon>
                    <Box ml="3">
                      <Text fontWeight={'medium'}>From</Text>
                      <Text fontSize={'lg'} fontWeight={'bold'}>
                        {rideDetails.from}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center">
                    <Icon
                      as={FaMapMarkerAlt}
                      w={6}
                      h={6}
                      color="orange.400"
                      transition="color 0.3s ease"
                    >
                      <Box
                        _hover={{
                          color: 'orange.600',
                          transform: 'scale(1.1)',
                        }}
                        transition="transform 0.3s ease, color 0.3s ease"
                      />
                    </Icon>
                    <Box ml="3">
                      <Text fontWeight={'medium'}>To</Text>
                      <Text fontSize={'lg'} fontWeight={'bold'}>
                        {rideDetails.to}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center">
                    <Icon
                      as={FaCalendarAlt}
                      w={6}
                      h={6}
                      color="blue.400"
                      transition="color 0.3s ease"
                    >
                      <Box
                        _hover={{ color: 'blue.600', transform: 'scale(1.1)' }}
                        transition="transform 0.3s ease, color 0.3s ease"
                      />
                    </Icon>
                    <Box ml="3">
                      <Text fontWeight={'medium'}>Date of Journey</Text>
                      <Text fontSize={'lg'} fontWeight={'bold'}>
                        {rideDetails.doj}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center">
                    <Icon
                      as={FaUsers}
                      w={6}
                      h={6}
                      color="teal.400"
                      transition="color 0.3s ease"
                    >
                      <Box
                        _hover={{ color: 'teal.600', transform: 'scale(1.1)' }}
                        transition="transform 0.3s ease, color 0.3s ease"
                      />
                    </Icon>
                    <Box ml="3">
                      <Text fontWeight={'medium'}>Seats Available</Text>
                      <Text fontSize={'lg'} fontWeight={'bold'}>
                        {rideDetails.no_of_pass}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center">
                    <Icon
                      as={FaMoneyBillWave}
                      w={6}
                      h={6}
                      color="green.400"
                      transition="color 0.3s ease"
                    >
                      <Box
                        _hover={{ color: 'green.600', transform: 'scale(1.1)' }}
                        transition="transform 0.3s ease, color 0.3s ease"
                      />
                    </Icon>
                    <Box ml="3">
                      <Text fontWeight={'medium'}>Price</Text>
                      <Text fontSize={'lg'} fontWeight={'bold'}>
                        Rs. {rideDetails.price}
                      </Text>
                    </Box>
                  </Flex>
                </SimpleGrid>
              </Box>
            )}
            <Box
              bg="white"
              p={['1rem', '2rem']}
              borderRadius="16px"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
              maxW="800px"
              mx={['1rem', '2rem', '3rem']}
              mt="2rem"
              textAlign="left"
              animation="slideInUp 0.5s ease-out"
            >
              <Text fontWeight={'bold'} fontSize="24px" mb="1rem">
                Pending Requests
              </Text>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request, index) => (
                  <SlideFade key={index} in={true} offsetY="20px">
                    <Box
                      p="1rem"
                      borderBottom="1px solid #e2e8f0"
                      mb="1rem"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      borderRadius="8px"
                      _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
                      transition="background-color 0.3s, transform 0.3s"
                    >
                      <Flex align="center">
                        <Icon
                          as={FaUser}
                          w={5}
                          h={5}
                          color="teal.400"
                          transition="color 0.3s ease"
                        >
                          <Box
                            _hover={{
                              color: 'teal.600',
                              transform: 'scale(1.1)',
                            }}
                            transition="transform 0.3s ease, color 0.3s ease"
                          />
                        </Icon>
                        <Box ml="3">
                          <Text fontWeight={'medium'}>Name</Text>
                          <Text fontSize={'lg'} fontWeight={'bold'}>
                            {request.requesteeName}
                          </Text>
                        </Box>
                      </Flex>
                      <Box>
                        <Button
                          colorScheme="teal"
                          mr={3}
                          _hover={{ bg: 'teal.500', transform: 'scale(1.05)' }}
                          transition="transform 0.3s, background-color 0.3s"
                          onClick={() =>
                            handleStatusChange(request._id, 'approved')
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          colorScheme="red"
                          _hover={{ bg: 'red.500', transform: 'scale(1.05)' }}
                          transition="transform 0.3s, background-color 0.3s"
                          onClick={() =>
                            handleStatusChange(request._id, 'rejected')
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  </SlideFade>
                ))
              ) : (
                <Text>No pending requests.</Text>
              )}
            </Box>
          </>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default RideStatus;
