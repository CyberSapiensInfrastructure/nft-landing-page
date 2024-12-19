import { Box, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <Box>
      <Link to="/admin">
        <ChakraLink>Admin Panel</ChakraLink>
      </Link>
    </Box>
  );
} 