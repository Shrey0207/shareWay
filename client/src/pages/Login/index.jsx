import {
  ChakraProvider,
  theme,
  useColorModeValue,
  Flex,
  Stack,
  Heading,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Link,
  Button,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import FadeInUp from '../../components/Animation/FadeInUP';

export default function Login() {
  //different state variables
  const [msg, setmsg] = useState('Please fill in your credentials');
  const [password, setpassword] = useState('');
  const [UID, setUID] = useState('');
  const [status, setStatus] = useState('Sign in');

  //event handler function
  const handleUIDChange = e => setUID(e.target.value);
  const handlepasswordChange = e => setpassword(e.target.value);
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
              <Heading fontsize={'4xl'}>Sign in to your account</Heading>
              <Text fontsize={'lg'} color={'gray.600'}>
                User Login
              </Text>
              <Text>{msg}</Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gary.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <form>
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
                      onChange={handlepasswordChange}
                    />
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}
                    >
                      <Checkbox> Remember me</Checkbox>
                      <Link color={'orange.400'}>Forgot password</Link>
                    </Stack>
                    <Button
                      bg={'orange.400'}
                      color={'white'}
                      _hover={{ bg: 'orange.500' }}
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
