import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Card, Heading, Text, Spinner, Stack } from '@chakra-ui/react';

const FinishedRidesDetails = () => {
  const { rideId } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`/ride/details/${rideId}`);
        console.log('Ride details response:', response.data);
        setRideDetails(response.data.ride);
        setPendingRequests(response.data.pendingRequests);
        setAcceptedRequests(response.data.acceptedRequests);
        setRejectedRequests(response.data.rejectedRequests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ride details:', error);
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

  if (!rideDetails) {
    return <Text>No ride details found.</Text>;
  }

  return (
    <Box p={5}>
      <Card p={5} shadow="md">
        <Heading size="lg" mb={4}>
          Ride Details
        </Heading>
        <Stack spacing={2}>
          <Text>
            <strong>From:</strong> {rideDetails.from}
          </Text>
          <Text>
            <strong>To:</strong> {rideDetails.to}
          </Text>
          <Text>
            <strong>Date of Journey:</strong> {rideDetails.doj}
          </Text>
          <Text>
            <strong>Price:</strong> ₹{rideDetails.price}
          </Text>
          <Text>
            <strong>Arrival Time:</strong> {rideDetails.arrivalTime}
          </Text>
          <Text>
            <strong>Departure Time:</strong> {rideDetails.departureTime}
          </Text>
        </Stack>
      </Card>

      <Card mt={5} p={5} shadow="md">
        <Heading size="md" mb={3}>
          Pending Requests
        </Heading>
        {pendingRequests.length > 0 ? (
          pendingRequests.map(request => (
            <Text key={request._id}>{request.requestee_id}</Text>
          ))
        ) : (
          <Text>No pending requests</Text>
        )}
      </Card>

      <Card mt={5} p={5} shadow="md">
        <Heading size="md" mb={3}>
          Accepted Requests
        </Heading>
        {acceptedRequests.length > 0 ? (
          acceptedRequests.map(request => (
            <Text key={request._id}>{request.requestee_id}</Text>
          ))
        ) : (
          <Text>No accepted requests</Text>
        )}
      </Card>

      <Card mt={5} p={5} shadow="md">
        <Heading size="md" mb={3}>
          Rejected Requests
        </Heading>
        {rejectedRequests.length > 0 ? (
          rejectedRequests.map(request => (
            <Text key={request._id}>{request.requestee_id}</Text>
          ))
        ) : (
          <Text>No rejected requests</Text>
        )}
      </Card>
    </Box>
  );
};

export default FinishedRidesDetails;
