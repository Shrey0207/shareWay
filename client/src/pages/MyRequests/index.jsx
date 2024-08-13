import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import { Box, Text, ChakraProvider, theme } from '@chakra-ui/react';
import RequestCard from '../../components/User/RequestCard'; // Ensure correct import path
import LoadingCard from '../../components/layouts/LoadingCard';

const MyRequestRides = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);

    // Dummy data
    const dummyRequests = [
      {
        ride_id: 'ride1',
        publisher_id: 'publisher1',
        from: 'Location A',
        to: 'Location B',
        doj: '2024-08-15',
        price: 300,
        nop: 3,
        status: 'pending',
        publisherName: 'John Doe',
      },
      {
        ride_id: 'ride2',
        publisher_id: 'publisher2',
        from: 'Location C',
        to: 'Location D',
        doj: '2024-08-20',
        price: 500,
        nop: 2,
        status: 'approved',
        publisherName: 'Jane Smith',
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setLoad(false);
      setMyRequests(dummyRequests);
    }, 1000); // 1 second delay to simulate loading
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
              key={res.ride_id}
              from={res.from}
              to={res.to}
              doj={res.doj}
              price={res.price}
              nop={res.nop}
              rideID={res.ride_id}
              pid={res.publisher_id}
              uid={parseInt(localStorage.getItem('UID'))}
              status={res.status}
              publisher={{ fname: res.publisherName, lname: '' }} // Assuming publisherName is used here
            />
          ))
        ) : (
          <p>You have not requested any rides.</p>
        )}
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
    </ChakraProvider>
  );
};

export default MyRequestRides;
