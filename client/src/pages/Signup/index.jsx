import {
  ChakraProvider,
  Flex,
  Stack,
  theme,
  useColorModeValue,
  Heading,
  Text,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Select as ChakraSelect } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import FadeInUp from '../../components/Animation/FadeInUP';

export default function Signup() {
  const [msg, setmsg] = useState('Please fill in the following details');
  const [AID, setAID] = useState();
  const [name, setName] = useState('');
  const [lname, setLName] = useState('');
  const [phone, setContact] = useState();
  const [userType, setType] = useState('STUDENT');
  const [designation, setDesig] = useState('Student');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [stat, setStat] = useState('Register User');

  ///event handler functions
  const handlepasswordChange = e => setPassword(e.target.value);
  const handleCpasswordChange = e => setCpassword(e.target.value);
  const handleNameChange = e => setName(e.target.value);
  const handleLNameChange = e => setLName(e.target.value);
  const handleAIDChange = e => setAID(e.target.value);
  const handleContactChange = e => setContact(e.target.value);
  const handleDesigChange = e => {
    const selectedValue = e.target.value;
    setDesig(selectedValue);

    if (selectedValue === 'Student') {
      setType('STUDENT');
    } else if (selectedValue === 'Teacher') {
      setType('TEACHER');
    } else {
      setType('EMPLOYEE');
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <FadeInUp>
        <Flex
          min={'100vh'}
          align={'enter'}
          justify={'center'}
          bg={useColorModeValue('gray.100', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign Up</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                Sign up to avail our car pooling services.
              </Text>
              <Text>{msg}</Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={5}
            >
              <Stack spacing={4}>
                <form>
                  <FormControl id="Name">
                    <FormLabel>First Name</FormLabel>
                    <Input
                      placeholder={'First name'}
                      type="text"
                      id="Name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </FormControl>
                  <FormControl id="LName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      placeholder={'Last Name'}
                      type="text"
                      id="LName"
                      value={lname}
                      onChange={handleLNameChange}
                    />
                  </FormControl>
                  <FormControl id="AID">
                    <FormLabel>Registration Number</FormLabel>
                    <Input
                      placeholder={'XX15062'}
                      type="text"
                      id="AID"
                      value={AID}
                      onChange={handleAIDChange}
                    />
                  </FormControl>
                  <FormControl id="Contact">
                    <FormLabel>Contact</FormLabel>
                    <Input
                      placeholder={'9876543210'}
                      type="text"
                      id="contact"
                      value={phone}
                      onChange={handleContactChange}
                      pattern="[0-9]{10}"
                      maxLength={10}
                    />
                  </FormControl>
                  <FormControl id="Desig">
                    <FormLabel>Designation</FormLabel>

                    <ChakraSelect onChange={handleDesigChange}>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Employee">Employee</option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                      placeholder={'Choose a password'}
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlepasswordChange}
                    />
                  </FormControl>
                  <FormControl id="cpassword">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      placeholder={'Re-enter your password'}
                      type="password"
                      id="cpassword"
                      value={cpassword}
                      onChange={handleCpasswordChange}
                    />
                  </FormControl>
                  <Stack spacing={10} mt={'1rem'}>
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                      type="submit"
                    >
                      {stat}
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
