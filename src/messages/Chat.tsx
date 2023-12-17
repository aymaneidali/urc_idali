import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControl, Input,  Spinner} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMessages, sendMessage } from './messagesApi';
import { useSelector } from 'react-redux';
import { Message, RootState, Session } from '../model/common';

const Chat = () => {
  const session = useSelector((state: RootState) => state.session.session);
  const navigate = useNavigate();
  const [message_text, set_message_text] = useState('');
  const [message_list, set_message_list] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const {id} = useParams();
  const receiver_id = (id == null || id == undefined ? 0 : id) as number;
  const [msgLoading,setMsgLoading] = useState<boolean>(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    scrollMessageContainerToBottom();
  }, [message_list]);

  const scrollMessageContainerToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const verifyParams = (session: Session): boolean => {
    if (session.token != null && session.id != null && id != null) {
      return true;
    } else {
      navigate('/login');
      return false;
    }
  };
  const  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message_text.trim().length === 0) {
      return;
    }
    verifyParams(session);
    if (verifyParams(session)) {
      setLoading(true);
      const msg = message_text as string;
      set_message_text("");
      await sendMessage({ sender_id: session.id!, receiver_id: receiver_id!, message_text: msg });
      set_message_list([...message_list,{id:Math.floor(Math.random() * (99999)), sender_id: session.id!, receiver_id: receiver_id!, message_text: message_text, timestamp: new Date().toLocaleTimeString() }])
      console.log(message_list);
      setLoading(false);

    }
  };
  const fetchMessages = async () => {
    try {
      setMsgLoading(true);
      const messagesData = await getMessages({sender_id: session.id!, receiver_id: receiver_id});
      console.log(messagesData);
      set_message_list(messagesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  return (
    <Box
    
      width="100%"
    margin="30px"
    padding="30px"
    borderRadius="0 33px"
      
      backgroundColor="purple.100" 
      
      display="flex"
      flexDirection="column"
      alignItems="center"
      boxShadow="xl"
    >
       <Box
        ref={messageContainerRef}
        marginTop="auto"
        width="100%"
        maxHeight="80%"
        overflowY="auto"
      >
        {msgLoading ? (
          <Box textAlign="center" mb={40}>
            <Spinner size="xl" />
          </Box>
        ):
        message_list.map((message) => (
          <Box
            key={message.id}
            textAlign={message.sender_id === session.id ? 'right' : 'left'}
            mb={2}
          >
            <Box
                p={3}
                borderRadius="md"
                border="1px solid purple.200" 
                display="inline-block"
                minWidth="50px"
                fontSize="16"
                maxWidth="50%"
                backgroundColor={message.sender_id === session.id ? 'purple.300' : 'white'} 
              >
              <span>
                {message.message_text}
              </span>
              <Box fontSize="11" color="purple.700">
                  {message.timestamp}
                </Box>
            </Box>
          </Box>
        ))}
        
      </Box>
      <Box id="input_box" width="100%">
        <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
            <Input
              name="message_text"
              placeholder="Saisissez votre message..."
              value={message_text}
              onChange={(e) => set_message_text(e.target.value)}
              bg="white" 
            />

          </FormControl>
          <Button type="submit" width="100%" colorScheme="purple" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Envoyer'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Chat;
