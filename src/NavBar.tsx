import React from 'react';
import { Flex, Box, Spacer, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { CLEAR_SESSION } from './redux';
import { RootState } from './model/common';

const NavBar: React.FC = () => {
  const session = useSelector((state: RootState) => state.session.session);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(CLEAR_SESSION());
    console.log("Déconnexion !");
    navigate("/login");
  }

  return (
    <Flex
      p={4}
      // Changement de la couleur de fond
      color="white"
      align="center"
      boxShadow="sm" // Ajout d'une légère ombre pour la profondeur
    >
      <Box padding={"15px"} borderRadius={"0px 33px"}  bg="purple.600">
        <Text fontSize="xl" fontWeight="bold">UBO Relay Chat</Text>
      </Box>
      <Spacer />
      <Box padding={"15px"} borderRadius={"33px 0px"}  bg="purple.600">
        {session.token ? (
          <Link onClick={onLogout} color="white" mr={4} fontWeight="bold">
            Déconnexion
          </Link>
        ) : (
          <Link as={RouterLink} to="/login" color="white" mr={4} fontWeight="bold">
            Connexion
          </Link>
        )}
      </Box>
    </Flex>
  );
};

export default NavBar;
