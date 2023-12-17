import { Box, Heading, Spinner, Text } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { listUsers } from "./usersApi";
import { RootState, UserPublic } from "../model/common";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UserList = () => {
  const {id_receiver} = useParams();
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSelector((state: RootState)=> state.session.session);
  const navigate = useNavigate();
  const {id} = useParams();
  const receiver_id = (id == null || id == undefined ? -1 : id) as number;

  useEffect(() => {

    console.log(id_receiver)
    const fetchUsers = async () => {
      try {
        const usersData = await listUsers();
        console.log(usersData);
        setUsers(usersData);
        const isReceiverInUsers = usersData.some((user) => user.user_id === receiver_id);

        if (!isReceiverInUsers) {
          navigate("/messages")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchUsers();
  }, []);


  const handleUserClick = (userId: number) => {
    navigate(`/messages/user/${userId}`);
  };

  return (
    <Box
    width={['80%', '25%']}
    
    margin="30px"
    padding="30px"
    borderRadius="33px 0"
    bg="purple.100"
    boxShadow="xl" 
  >
       {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box>
           <Heading
            fontSize="2xl"
            mb="4"
            borderBottom="2px solid" 
            borderBottomColor="purple.500"
            color="purple.500" 
          >
            Utilisateurs
          </Heading>
          <ul>
          {users.map((user) => user.user_id !== session.id && (
              <Box
                key={user.user_id}
                onClick={() => handleUserClick(user.user_id)}
                backgroundColor={user.user_id === receiver_id ? "gray.300" : "gray.100"}
                p="3"
                mb="2"
                borderRadius="md"
                cursor="pointer"
                _hover={{ backgroundColor: "purple.100", color: "purple.700" }} 
              >
                 <Text fontSize="lg" fontWeight="bold" color="purple.600">
                  {user.username}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {user.last_login}
                </Text>
              </Box>
            ))}
          </ul>
          {}
        </Box>
      )}
    </Box>
  );
};

export default UserList;
