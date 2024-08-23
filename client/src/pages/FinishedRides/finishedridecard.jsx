import React from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  CloseIcon,
  WarningIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
} from '@chakra-ui/icons';
import FadeInUp from '../../components/Animation/fadeinup';
import Card from '../../components/layouts/Card';
import { useNavigate } from 'react-router-dom';

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
  const { from, to, doj, price, status, publisherName } = ride;
  const { icon, text, colorScheme } = getStatusBadge(status);

  const navigate = useNavigate();

  // Icon for indicating whether the ride was requested or posted
  const rideTypeIcon = isRequestedRide ? (
    <ArrowForwardIcon color="red.600" />
  ) : (
    <ArrowBackIcon color="green.600" />
  );

  // Darker theme colors based on ride type
  const rideBackgroundColor = useColorModeValue(
    isRequestedRide ? 'red.100' : 'green.100',
    isRequestedRide ? 'red.600' : 'green.600'
  );

  return (
    <FadeInUp>
      <Card
        py="2rem"
        my="1.5rem"
        px="2rem"
        bg={useColorModeValue('white', 'gray.800')}
        position="relative"
        mx={['1rem', '1.5rem', '2rem', '3rem']}
        width="100%"
        maxW="800px"
        borderRadius="12px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)"
      >
        <SimpleGrid columns={4} spacing="20px" alignItems="center">
          <Box
            w="100%"
            textAlign="center"
            display="flex"
            alignItems="center"
            bg={rideBackgroundColor}
            borderRadius="12px"
            py="2"
            px="4"
          >
            {rideTypeIcon}
            <Text fontWeight={600} fontSize="lg" ml={3}>
              {isRequestedRide ? 'Requested' : 'Posted'}
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
          {/* Conditionally render the publisher field only for requested rides */}
          {isRequestedRide && (
            <Box w="100%" textAlign={'center'}>
              <Text fontWeight={'medium'}>Publisher</Text>
              <Text fontSize={'md'}>{publisherName}</Text>
            </Box>
          )}
          {/* Conditionally render the status badge only for requested rides */}
          {isRequestedRide && (
            <Box w="100%" textAlign={'center'}>
              <Badge colorScheme={colorScheme} fontSize="lg">
                {icon} {text}
              </Badge>
            </Box>
          )}
          <Box w="100%" textAlign={'center'}>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={() => navigate(`/ride/details/${ride._id}`)}
            >
              View Details
            </Button>
          </Box>
        </SimpleGrid>
      </Card>
    </FadeInUp>
  );
};

export default FinishedRideCard;
