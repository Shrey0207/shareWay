import React from 'react';
import { Box, Text, SimpleGrid, Badge, IconButton } from '@chakra-ui/react';
import {
  CheckCircleIcon,
  CloseIcon,
  WarningIcon,
  EmailIcon,
  PhoneIcon,
} from '@chakra-ui/icons';
import FadeInUp from '../../components/Animation/FadeInUp';
import Card from '../../components/layouts/Card';

const getStatusBadge = status => {
  switch (status) {
    case 'pending':
      return {
        colorScheme: 'yellow',
        icon: <WarningIcon />,
        text: 'Pending',
      };
    case 'approved':
      return {
        colorScheme: 'green',
        icon: <CheckCircleIcon />,
        text: 'Approved',
      };
    case 'rejected':
      return {
        colorScheme: 'red',
        icon: <CloseIcon />,
        text: 'Rejected',
      };
    default:
      return {
        colorScheme: 'gray',
        icon: null,
        text: 'Unknown',
      };
  }
};

const FinishedRideCard = ({ ride, isRequestedRide }) => {
  const { from, to, doj, price, no_of_pass, status, publisher, email, phone } =
    ride;
  const { colorScheme, icon, text } = getStatusBadge(status);

  return (
    <FadeInUp>
      <Card
        py="2rem"
        my="1.5rem"
        px="2rem"
        bg={'white'}
        position="relative"
        mx={['1rem', '1.5rem', '2rem', '3rem']}
        width="100%"
        maxW="800px"
        borderRadius="12px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)"
      >
        <SimpleGrid columns={[1, 2, 3, 4]} spacing="20px">
          <Box
            w="100%"
            bgColor={'orange.200'}
            textAlign={'center'}
            borderRadius={'12px'}
            py="2"
            px="4"
          >
            <Text fontWeight={600} fontSize={'lg'}>
              {from}
            </Text>
          </Box>
          <Box
            w="100%"
            bgColor={'orange.200'}
            textAlign={'center'}
            borderRadius={'12px'}
            py="2"
            px="4"
          >
            <Text fontWeight={600} fontSize={'lg'}>
              {to}
            </Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Date of Journey</Text>
            <Text fontSize={'md'}>{doj}</Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Price</Text>
            <Text fontSize={'md'}>Rs. {price}</Text>
          </Box>
          {!isRequestedRide && (
            <Box w="100%" textAlign={'center'}>
              <Text fontWeight={'medium'}>Seats Available</Text>
              <Text fontSize={'md'}>{no_of_pass}</Text>
            </Box>
          )}
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Ride by</Text>
            <Text fontSize={'md'}>
              {publisher ? `${publisher.fname} ${publisher.lname}` : 'Unknown'}
            </Text>
          </Box>
          {isRequestedRide && (
            <Box w="100%" textAlign={'center'}>
              <Text fontWeight={'medium'}>Status</Text>
              <Badge colorScheme={colorScheme} variant="solid" px={4} py={2}>
                {icon} {text}
              </Badge>
            </Box>
          )}
          {status === 'approved' && (
            <Box w="100%" textAlign={'center'}>
              <IconButton
                icon={<EmailIcon />}
                colorScheme="blue"
                variant="outline"
                aria-label="Email Publisher"
                onClick={() => (window.location.href = `mailto:${email}`)}
                m="2"
              />
              <IconButton
                icon={<PhoneIcon />}
                colorScheme="green"
                variant="outline"
                aria-label="Call Publisher"
                onClick={() => (window.location.href = `tel:${phone}`)}
                m="2"
              />
            </Box>
          )}
        </SimpleGrid>
      </Card>
    </FadeInUp>
  );
};

export default FinishedRideCard;
