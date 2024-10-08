import {
  ChakraProvider,
  theme,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FadeInUp from '../../components/Animation/fadeinup';
import jwt from 'jwt-decode';

export default function Login() {
  const navigate = useNavigate();
  const [UID, setUID] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('Please fill in your credentials');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Sign in');

  const handleUIDChange = e => setUID(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);

  useEffect(() => {
    if (token) {
      const user = jwt(token); // Decode the token to get user information
      localStorage.setItem('tokenID', token);
      localStorage.setItem('fname', user.fname); // Store fname in localStorage
      localStorage.setItem('lname', user.lname); // Store lname in localStorage
    }
  }, [token]);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL; // Access the environment variable
      let dat = await axios.post(`${apiUrl}/user/login`, {
        UID: UID,
        password,
      });
      // console.log('data : ' + dat.data);
      // console.log('----');
      // console.log(dat.data.user);
      // console.log('----');
      setToken(dat.data.token);
      if (dat.status === 200) {
        setMsg('SUCCESSFUL SIGNIN!');
        setStatus('Signin successful');
        localStorage.setItem('UID', UID);
        setTimeout(() => {
          navigate('/user/UserRides');
        }, 1000);
      } else {
        setStatus('Please Try Again');
        setMsg('INCORRECT CREDENTIALS');
      }
    } catch (error) {
      setStatus('Please Try Again');
      setTimeout(() => {
        setStatus('Sign in');
        setMsg('Please fill in your credentials');
      }, 3000);
      console.log(error);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <FadeInUp>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                User Login
              </Text>
              <Text>{msg}</Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <form onSubmit={handleSubmit}>
                  <FormControl id="UID">
                    <FormLabel>Registration Number</FormLabel>
                    <Input
                      placeholder={'Registration Number'}
                      id="UID"
                      type="text"
                      value={UID}
                      onChange={handleUIDChange}
                    />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                      placeholder={'Password'}
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Link color={'orange.400'}>Forgot password?</Link>
                    </Stack>
                    <Button
                      bg={'orange.400'}
                      color={'white'}
                      _hover={{
                        bg: 'orange.500',
                      }}
                      type="submit"
                    >
                      {status}
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
}
