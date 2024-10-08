import {
  ChakraProvider,
  theme,
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={'3vh'}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <ChakraProvider theme={theme}>
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        bottom={0}
        left={0}
        right={0}
        position={'absolute'}
      >
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>
            © 2024 National Institute of Technology, Silchar. All rights
            reserved
          </Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton
              label={'Gmail'}
              href={'mailto:shreytolasaria4297@gmail.com'}
            >
              <FaGoogle />
            </SocialButton>
            <SocialButton
              label={'GitHub'}
              href={'https://github.com/Shrey0207'}
            >
              <FaGithub />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
