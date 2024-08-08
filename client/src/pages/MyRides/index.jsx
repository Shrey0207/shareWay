import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/User/Navbar';
import { Text, ChakraProvider, Box, theme } from '@chakra-ui/react';
import MyRide from '../../components/User/MyRide';
import LoadingCard from '../../components/layouts/LoadingCard';
const apiUrl = process.env.REACT_APP_API_URL;

const MyRides = () => {
  const [allRides, setAllRides] = useState([]);
  const UID = localStorage.getItem('UID');
  const [loading, setLoad] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoad(true);
        const response = await axios.get(`${apiUrl}/user/${UID}/rides`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenID')}`,
          },
        });
        setLoad(false);
        setAllRides(response.data);
      } catch (err) {
        console.log(err);
        setLoad(false);
      }
    };

    fetchRides();
  }, [UID]);
  return (
    <ChakraProvider theme={theme}>
      <Navbar />

      <Box align={'center'}>
        <Text fontWeight={'bold'} fontSize="38px" my="4rem" mx="5rem">
          My Ongoing Rides
        </Text>

        {loading === true ? <LoadingCard /> : null}

        {allRides.map((res, index) => {
          return (
            <MyRide
              key={res.id || index}
              UID={parseInt(localStorage.getItem('UID'))}
              from={res.from}
              to={res.to}
              doj={res.doj}
              price={res.price}
              rideID={res.id}
              nop={res.no_of_pass}
            />
          );
        })}
        {allRides.length === 0 ? (
          <p>Oops! Looks like you have not published any rides.</p>
        ) : null}
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
    </ChakraProvider>
  );
};

export default MyRides;
