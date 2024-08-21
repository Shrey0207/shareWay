import {
  ChakraProvider,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Input,
  Heading,
  Text,
  IconButton,
  HStack,
  useColorModeValue,
  useToast,
  theme,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../components/User/Navbar';
import FadeInUp from '../../components/Animation/FadeInUp';
import moment from 'moment';
const apiUrl = process.env.REACT_APP_API_URL;

const PublishRide = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const UID = localStorage.getItem('UID');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [nop, setNop] = useState(1); // Start with 1 passenger by default
  const [doj, setDoj] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [price, setPrice] = useState('');
  const [msg, setMsg] = useState('Please fill in the details.');

  const handleSubmit = async event => {
    event.preventDefault();

    // Validate the date is not in the past
    const currentDate = moment().format('YYYY-MM-DD');
    if (moment(doj).isBefore(currentDate)) {
      toast({
        title: 'Invalid Date',
        description: 'Cannot post a ride in the past.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('tokenID');
      const { status } = await axios.post(
        `${apiUrl}/users/${UID}/rides`,
        { from, to, no_of_pass: nop, doj, arrivalTime, departureTime, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (status === 200) {
        setMsg('Ride successfully posted');
        setTimeout(() => navigate('/user/UserRides'), 800);
      } else {
        setMsg("Couldn't post the ride");
      }
    } catch (err) {
      console.log(err);
      setMsg("Couldn't post the ride");
    }
  };

  // Increase and decrease passenger count
  const incrementNop = () => setNop(prev => prev + 1);
  const decrementNop = () => setNop(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <FadeInUp>
        <Flex
          minH={'93vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={1} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Publish a Ride</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                {msg}
              </Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <form onSubmit={handleSubmit}>
                  <FormControl id="from">
                    <FormLabel>From</FormLabel>
                    <Input
                      placeholder="Enter pick-up point"
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="to">
                    <FormLabel>To</FormLabel>
                    <Input
                      placeholder="Enter drop point"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="doj">
                    <FormLabel>Date of Journey</FormLabel>
                    <Input
                      type="date"
                      value={doj}
                      min={moment().format('YYYY-MM-DD')} // Set the minimum date to today
                      onChange={e => setDoj(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="arrivalTime">
                    <FormLabel>Arrival Time</FormLabel>
                    <Input
                      type="time"
                      value={arrivalTime}
                      onChange={e => setArrivalTime(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="departureTime">
                    <FormLabel>Departure Time</FormLabel>
                    <Input
                      type="time"
                      value={departureTime}
                      onChange={e => setDepartureTime(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="nop">
                    <FormLabel>Number of Co-Passengers</FormLabel>
                    <HStack maxW="200px">
                      <IconButton
                        icon={<MinusIcon />}
                        onClick={decrementNop}
                        aria-label="Decrease passengers"
                      />
                      <Input
                        value={nop}
                        readOnly
                        textAlign="center"
                        width="60px"
                      />
                      <IconButton
                        icon={<AddIcon />}
                        onClick={incrementNop}
                        aria-label="Increase passengers"
                      />
                    </HStack>
                  </FormControl>
                  <FormControl id="price">
                    <FormLabel>Price per head</FormLabel>
                    <Input
                      placeholder="Price per head"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                  </FormControl>
                  <Stack spacing={10} pt={4}>
                    <Button
                      bg={'orange.400'}
                      color={'white'}
                      _hover={{ bg: 'orange.500' }}
                      type="submit"
                    >
                      Publish Ride
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </FadeInUp>
    </ChakraProvider>
  );
};

export default PublishRide;
