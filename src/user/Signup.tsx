import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Heading, Link, Spinner } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from './signupApi';
import { User } from '../model/common';
import { useDispatch } from "react-redux"
import { SET_SESSION } from '../redux';


const Signup: React.FC = () => {
    const [registrationData, setRegistrationData] = useState<User>({
        user_id: -1,
        username: '',
        email: '',
        password: ''
      });


  const [error, setError] = useState<{ message?: string }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    registerUser(
      registrationData,
      (session) => {

        console.log('User registered successfully:', session);
        setLoading(false);
        dispatch(SET_SESSION(session));
        navigate('/messages');
      },
      (registrationError) => {
        setLoading(false);
        setError({ message: registrationError.message });
      }
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }));
    console.log(name+" "+value);
  };

  return (
    <Box
    maxW="xl"
    minWidth="400px"
    margin="auto"
    p={8}
    borderWidth="1px"
    marginTop="50px"
    borderRadius="lg"
    boxShadow="2xl"
    bg="gray.100"
  >
      <Heading mb={6} textAlign="center" size="xl" color="purple.600">
        Inscription
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Enter your username"
            value={registrationData.username}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={registrationData.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={registrationData.password}
            onChange={handleChange}
          />
        </FormControl>
        <Button type="submit" width="100%" colorScheme="purple" isLoading={loading}>
          Inscription
        </Button>
      </form>

      {}
      {error.message && (
        <Box mt={4} color="red.500">
          <span>{error.message}</span>
        </Box>
      )}

<Box mt={4} textAlign="center">
        <span>Vous avez déjà un compte ? </span>
        <Link as={RouterLink} to="/login" color="purple.600">
          Connectez-vous
        </Link>
      </Box>
    </Box>
    
  );
};

export default Signup;
