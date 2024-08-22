import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Flex,
  Icon,
  ChakraProvider,
} from '@chakra-ui/react';
import Navbar from '../../components/User/Navbar';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaUser,
} from 'react-icons/fa';

const FinishedRidesDetails = () => {
  const { rideId } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`/ride/details/${rideId}`);
        setRideDetails(response.data.ride);
        setPendingRequests(response.data.pendingRequests);
        setAcceptedRequests(response.data.acceptedRequests);
        setRejectedRequests(response.data.rejectedRequests);
        setLoading(false);
      } catch (error) {
        setError('Failed to load ride details.');
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!rideDetails) {
    return (
      <Box p={5}>
        <Alert status="info">
          <AlertIcon />
          No ride details found.
        </Alert>
      </Box>
    );
  }

  return (
    <ChakraProvider>
      <Navbar />
      <Box p={5}>
        <Card
          p={5}
          shadow="lg"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          mb={5}
          maxW="container.md"
          mx="auto"
        >
          <Heading size="lg" mb={4}>
            Ride Details
          </Heading>
          <SimpleGrid columns={[1, 2]} spacing={5}>
            <Flex align="center">
              <Icon as={FaMapMarkerAlt} w={6} h={6} color="orange.400" />
              <Box ml={3}>
                <Text fontWeight="medium">From</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {rideDetails.from}
                </Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Icon as={FaMapMarkerAlt} w={6} h={6} color="orange.400" />
              <Box ml={3}>
                <Text fontWeight="medium">To</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {rideDetails.to}
                </Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Icon as={FaCalendarAlt} w={6} h={6} color="blue.400" />
              <Box ml={3}>
                <Text fontWeight="medium">Date of Journey</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {new Date(rideDetails.doj).toLocaleDateString()}
                </Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Icon as={FaUsers} w={6} h={6} color="teal.400" />
              <Box ml={3}>
                <Text fontWeight="medium">Seats Available</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {rideDetails.no_of_pass}
                </Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Icon as={FaMoneyBillWave} w={6} h={6} color="green.400" />
              <Box ml={3}>
                <Text fontWeight="medium">Price</Text>
                <Text fontSize="lg" fontWeight="bold">
                  ₹{rideDetails.price}
                </Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Icon as={FaClock} w={6} h={6} color="purple.400" />
              <Box ml={3}>
                <Text fontWeight="medium">Departure Time</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {rideDetails.departureTime || 'Not specified'}
                </Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Icon as={FaClock} w={6} h={6} color="purple.400" />
              <Box ml={3}>
                <Text fontWeight="medium">Arrival Time</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {rideDetails.arrivalTime || 'Not specified'}
                </Text>
              </Box>
            </Flex>
          </SimpleGrid>
        </Card>

        <Card
          p={5}
          shadow="lg"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          mb={5}
          maxW="container.md"
          mx="auto"
        >
          <Heading size="md" mb={4}>
            Pending Requests
          </Heading>
          {pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <Box
                key={request._id}
                p={4}
                borderBottom="1px solid #e2e8f0"
                mb={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderRadius="md"
                _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
                transition="background-color 0.3s, transform 0.3s"
              >
                <Flex align="center">
                  <Icon as={FaUser} w={5} h={5} color="teal.400" />
                  <Box ml={3}>
                    <Text fontWeight="medium">Name</Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {request.requestee_name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Registration No: {request.requestee_id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))
          ) : (
            <Text>No pending requests</Text>
          )}
        </Card>

        <Card
          p={5}
          shadow="lg"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          mb={5}
          maxW="container.md"
          mx="auto"
        >
          <Heading size="md" mb={4}>
            Accepted Requests
          </Heading>
          {acceptedRequests.length > 0 ? (
            acceptedRequests.map(request => (
              <Box
                key={request._id}
                p={4}
                borderBottom="1px solid #e2e8f0"
                mb={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderRadius="md"
                _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
                transition="background-color 0.3s, transform 0.3s"
              >
                <Flex align="center">
                  <Icon as={FaUser} w={5} h={5} color="green.400" />
                  <Box ml={3}>
                    <Text fontWeight="medium">Name</Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {request.requestee_name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Registration No: {request.requestee_id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))
          ) : (
            <Text>No accepted requests</Text>
          )}
        </Card>

        <Card
          p={5}
          shadow="lg"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          mb={5}
          maxW="container.md"
          mx="auto"
        >
          <Heading size="md" mb={4}>
            Rejected Requests
          </Heading>
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map(request => (
              <Box
                key={request._id}
                p={4}
                borderBottom="1px solid #e2e8f0"
                mb={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderRadius="md"
                _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
                transition="background-color 0.3s, transform 0.3s"
              >
                <Flex align="center">
                  <Icon as={FaUser} w={5} h={5} color="red.400" />
                  <Box ml={3}>
                    <Text fontWeight="medium">Name</Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {request.requestee_name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Registration No: {request.requestee_id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))
          ) : (
            <Text>No rejected requests</Text>
          )}
        </Card>
      </Box>
    </ChakraProvider>
  );
};

export default FinishedRidesDetails;
