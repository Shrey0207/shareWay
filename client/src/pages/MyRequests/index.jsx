import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import { Box, Text, ChakraProvider, theme } from '@chakra-ui/react';
import RequestCard from '../../components/User/RequestCard';
import LoadingCard from '../../components/layouts/LoadingCard';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const MyRequestRides = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const uid = localStorage.getItem('UID');
        const response = await axios.get(
          `${apiUrl}/users/${uid}/requeststatus`
        );
        setMyRequests(response.data);
      } catch (error) {
        console.error('Error fetching request status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Navbar />

      <Box align={'center'}>
        <Text fontWeight={'bold'} fontSize="38px" my="4rem" mx="5rem">
          My Requests Status
        </Text>
        {loading ? <LoadingCard /> : null}
        {myRequests.length > 0 ? (
          myRequests.map(res => (
            <RequestCard
              key={res.requestID}
              from={res.from}
              to={res.to}
              doj={res.doj}
              price={res.price}
              rideID={res.rideID}
              uid={parseInt(localStorage.getItem('UID'))}
              status={res.requestStatus}
              publisher={{ fname: res.publisherName, lname: '' }}
              email={res.publisherEmail} // Add publisher's email
              phone={res.publisherPhone} // Add publisher's phone number
            />
          ))
        ) : (
          <p>You have not requested any rides.</p>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default MyRequestRides;
