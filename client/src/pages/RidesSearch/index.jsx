import axios from 'axios';
import React, { useState } from 'react';
import Navbar from '../../components/User/Navbar';
import RideCard from '../../components/User/RideCard';
import LoadingCard from '../../components/layouts/LoadingCard';
import {
  ChakraProvider,
  Text,
  theme,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Input,
  Heading,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion'; // For animations
import dayjs from 'dayjs';

const apiUrl = process.env.REACT_APP_API_URL;

const RidesSearch = () => {
  const [allRides, setAllRides] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [doj, setDoj] = useState('');
  const [seats, setSeats] = useState(1);
  const [msg, setmsg] = useState('Please fill the following details');
  const [loading, setLoad] = useState(false);

  // Set min date for date input to today's date
  const today = dayjs().format('YYYY-MM-DD');

  const handleFromChange = e => setFrom(e.target.value);
  const handleToChange = e => setTo(e.target.value);
  const handleDojChange = e => setDoj(e.target.value);
  const handleSeatsChange = value => {
    if (value >= 1 && value <= 5) setSeats(value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      setLoad(true);

      const params = {};
      if (from) params.from_location = from;
      if (to) params.to_location = to;
      if (doj) params.doj = doj;
      if (seats) params.seats = seats;

      const dat = await axios.get(`${apiUrl}/rides/search`, { params });
      setAllRides(dat.data);
      setLoad(false);

      setmsg(
        dat.status === 200 && dat.data.length > 0
          ? 'Scroll to view rides'
          : "Couldn't find rides"
      );
    } catch (err) {
      console.log(err);
      setLoad(false);
      setmsg('An error occurred while searching for rides.');
    }
  };

  const handleShowAllRides = async () => {
    try {
      setLoad(true);
      const dat = await axios.get(`${apiUrl}/rides/future`);
      setAllRides(dat.data);
      setLoad(false);
      setmsg(
        dat.status === 200 && dat.data.length > 0
          ? 'Scroll to view all upcoming rides'
          : 'No upcoming rides found'
      );
    } catch (err) {
      console.log(err);
      setLoad(false);
      setmsg('An error occurred while fetching all rides.');
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Stack
        spacing={8}
        mx={'auto'}
        maxW={{ base: 'full', md: 'lg' }}
        py={4}
        px={4}
      >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}> Search Rides</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            {msg}
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          w={{ base: 'full', md: 'md' }}
          transition="0.3s"
          _hover={{ boxShadow: '2xl' }}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="publish_ride">
                <HStack spacing={4}>
                  <FormLabel>From</FormLabel>
                  <Input
                    placeholder={'Enter pick-up point'}
                    id="from"
                    type="text"
                    onChange={handleFromChange}
                  />

                  <FormLabel>To</FormLabel>
                  <Input
                    placeholder={'Enter drop point'}
                    id="to"
                    type="text"
                    onChange={handleToChange}
                  />
                </HStack>
                <br />
                <HStack>
                  <FormLabel>Date of Journey</FormLabel>
                  <Input
                    placeholder={'Date of Journey'}
                    id="doj"
                    type="date"
                    min={today}
                    onChange={handleDojChange}
                  />
                </HStack>
                <br />
                <HStack>
                  <FormLabel>Seats</FormLabel>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSeatsChange(seats - 1)}
                    style={{
                      padding: '10px',
                      backgroundColor: theme.colors.blue[400],
                      color: 'white',
                      borderRadius: '5px',
                    }}
                  >
                    -
                  </motion.button>
                  <Text fontSize={'lg'}>{seats}</Text>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSeatsChange(seats + 1)}
                    style={{
                      padding: '10px',
                      backgroundColor: theme.colors.blue[400],
                      color: 'white',
                      borderRadius: '5px',
                    }}
                  >
                    +
                  </motion.button>
                </HStack>
              </FormControl>
              <Stack spacing={10} mt={6}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }}
                  type="submit"
                >
                  Search Ride
                </Button>
                <Button
                  bg={'gray.400'}
                  color={'white'}
                  _hover={{ bg: 'gray.500' }}
                  onClick={handleShowAllRides}
                >
                  Show All Rides
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
      <Box align={'center'}>
        {loading ? <LoadingCard /> : null}
        {allRides
          .filter(res => res.PublisherID !== localStorage.getItem('UID'))
          .map(res => (
            <RideCard
              key={res._id}
              uid={parseInt(localStorage.getItem('UID'))}
              to={res.to}
              from={res.from}
              doj={res.doj}
              nop={res.no_of_pass}
              price={res.price}
              rideID={res._id}
              pid={res.PublisherID}
              publisher={{
                fname: res.publisher_fname,
                lname: res.publisher_lname,
              }}
              arrivalTime={res.arrivalTime}
              departureTime={res.departureTime}
            />
          ))}
      </Box>
    </ChakraProvider>
  );
};

export default RidesSearch;
