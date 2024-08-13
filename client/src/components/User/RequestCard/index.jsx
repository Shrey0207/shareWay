import React, { useState, useEffect } from 'react';
import { Box, Text, SimpleGrid, Badge, IconButton } from '@chakra-ui/react';
import {
  CheckCircleIcon,
  WarningIcon,
  CloseIcon,
  EmailIcon,
  PhoneIcon,
} from '@chakra-ui/icons';
import FadeInUp from '../../Animation/FadeInUp';
import Card from '../../layouts/Card';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

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

const RequestCard = ({
  from,
  to,
  doj,
  price,
  rideID,
  uid,
  publisher,
  status, // Status prop
  email, // Publisher's email
  phone, // Publisher's phone
}) => {
  const [requestStatus, setRequestStatus] = useState(status || 'Unknown');

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/${uid}/requests`);
        const requests = response.data;
        const existingRequest = requests.find(
          request => request.ride_id._id === rideID
        );

        if (existingRequest) {
          setRequestStatus(existingRequest.status);
        }
      } catch (err) {
        console.error('Error fetching request status:', err);
      }
    };

    checkRequestStatus();
  }, [rideID, uid]);

  const { colorScheme, icon, text } = getStatusBadge(requestStatus);

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
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Ride by</Text>
            <Text fontSize={'md'}>
              {publisher ? `${publisher.fname} ${publisher.lname}` : 'Unknown'}
            </Text>
          </Box>
          <Box w="100%" textAlign={'center'}>
            <Text fontWeight={'medium'}>Status</Text>
            <Badge colorScheme={colorScheme} variant="solid" px={4} py={2}>
              {icon} {text}
            </Badge>
          </Box>
          {requestStatus === 'approved' && (
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

export default RequestCard;
