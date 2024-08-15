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
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons';
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
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rideResponse, requestResponse] = await Promise.all([
          axios.get(`${apiUrl}/rides/${slug}/requests/`),
          axios.get(`${apiUrl}/rides/${slug}/requesters`),
        ]);

        setRideDetails(rideResponse.data);
        setPendingRequests(
          requestResponse.data.requests.filter(req => req.status === 'pending')
        );
        setAcceptedRequests(
          requestResponse.data.requests.filter(req => req.status === 'approved')
        );
        setRejectedRequests(
          requestResponse.data.requests.filter(req => req.status === 'rejected')
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleStatusChange = async (requestId, status) => {
    try {
      await axios.put(`${apiUrl}/rides/${slug}/request/${requestId}`, {
        status,
      });

      // Update state based on the status change
      if (status === 'approved') {
        setPendingRequests(prevRequests =>
          prevRequests.filter(req => req._id !== requestId)
        );
        setAcceptedRequests(prevAccepted =>
          prevAccepted.concat(
            pendingRequests.find(req => req._id === requestId)
          )
        );
      } else if (status === 'rejected') {
        setPendingRequests(prevRequests =>
          prevRequests.filter(req => req._id !== requestId)
        );
        setRejectedRequests(prevRejected =>
          prevRejected.concat(
            pendingRequests.find(req => req._id === requestId)
          )
        );
      }

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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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
                        />
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
                <Text>No pending requests</Text>
              )}
            </Box>
            {/* Render accepted requests */}
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
                Accepted Requests
              </Text>
              {acceptedRequests.length > 0 ? (
                acceptedRequests.map((request, index) => (
                  <Box
                    key={index}
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
                      />
                      <Box ml="3">
                        <Text fontWeight={'medium'}>Name</Text>
                        <Text fontSize={'lg'} fontWeight={'bold'}>
                          {request.requesteeName}
                        </Text>
                        <Text fontSize={'sm'} color="gray.600">
                          Registration No: {request.requestee_id}
                        </Text>
                      </Box>
                    </Flex>
                    <HStack>
                      <IconButton
                        icon={<PhoneIcon />}
                        colorScheme="teal"
                        variant="outline"
                        aria-label="Call"
                        as="a"
                        href={`tel:${request.requesteePhone}`}
                      />
                      <IconButton
                        icon={<EmailIcon />}
                        colorScheme="teal"
                        variant="outline"
                        aria-label="Email"
                        as="a"
                        href={`mailto:${request.requesteeEmail}`}
                      />
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text>No accepted requests</Text>
              )}
            </Box>
            {/* Render rejected requests */}
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
                Rejected Requests
              </Text>
              {rejectedRequests.length > 0 ? (
                rejectedRequests.map((request, index) => (
                  <Box
                    key={index}
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
                      />
                      <Box ml="3">
                        <Text fontWeight={'medium'}>Name</Text>
                        <Text fontSize={'lg'} fontWeight={'bold'}>
                          {request.requesteeName}
                        </Text>
                        <Text fontSize={'sm'} color="gray.600">
                          Registration No: {request.requestee_id}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Text>No rejected requests</Text>
              )}
            </Box>
          </>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default RideStatus;
