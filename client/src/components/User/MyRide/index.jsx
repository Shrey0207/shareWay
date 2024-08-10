import React from 'react';
import { Box, Button, Text, SimpleGrid } from '@chakra-ui/react';
import Card from '../../layouts/Card';
import FadeInUp from '../../Animation/FadeInUp';
import { useNavigate } from 'react-router-dom';

export const MyRide = ({ from, to, nop, price, rideID, doj }) => {
  const navigate = useNavigate();

  const redirectReq = () => {
    navigate('/user/dashboard/ridestatus/' + rideID);
  };

  return (
    <FadeInUp>
      <Card
        py="3rem"
        my="2rem"
        px="2rem"
        mx={['1rem', '2rem', '3rem', '4rem']}
        width={['90vw', '80vw', '70vw']}
        borderRadius="16px"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        bg="white"
        position="relative"
      >
        <SimpleGrid columns={[1, 2, 3]} spacing="20px">
          <Box
            bgColor="orange.200"
            textAlign="center"
            h="60px"
            borderRadius="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight={600} fontSize={['xl', '2xl', '3xl']}>
              {from}
            </Text>
          </Box>
          <Box
            bgColor="orange.200"
            textAlign="center"
            h="60px"
            borderRadius="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight={600} fontSize={['xl', '2xl', '3xl']}>
              {to}
            </Text>
          </Box>

          <Box textAlign="center">
            <Text fontWeight="bold" fontSize={['md', 'lg', 'xl']}>
              Date of Journey:
            </Text>
            <Text fontSize={['md', 'lg', 'xl']}>{doj}</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize={['md', 'lg', 'xl']} fontWeight="bold">
              {nop}
            </Text>
            <Text fontSize={['sm', 'md', 'lg']}>Seats</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize={['md', 'lg', 'xl']} fontWeight="bold">
              Price
            </Text>
            <Text fontSize={['md', 'lg', 'xl']}>Rs. {price}</Text>
          </Box>
          <Box textAlign="center">
            <Button
              onClick={redirectReq}
              colorScheme="teal"
              size="lg"
              fontSize={['md', 'lg', 'xl']}
            >
              View Details
            </Button>
          </Box>
        </SimpleGrid>
      </Card>
    </FadeInUp>
  );
};

export default MyRide;
