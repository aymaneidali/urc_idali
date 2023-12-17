import { Message } from "../model/common";

export async function sendMessage(message : Message): Promise<void> {
    try {
      const response = await fetch("/api/sendmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication": "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({sender_id: message.sender_id, receiver_id: message.receiver_id, message_text: message.message_text}),
      });

      if (response.ok) {
        console.log("Message envoyé !");
      } else {
        try {
          const errorResponse = await response.json();
          console.error("Erreur côté serveur:", errorResponse);
        } catch (error) {
          console.error("Erreur lors de la conversion de la réponse JSON:", error);
        }
        
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      
    }
  }


export async function getMessages(message : Message): Promise<Message[]> {
  try {
    const response = await fetch("/api/getmessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authentication": "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({sender_id: message.sender_id, receiver_id: message.receiver_id}),
    });

    if (response.ok) {
      const messages = await response.json();
      return messages as Message[];
      
    } else {
      try {
        const errorResponse = await response.json();
        
        console.error("Erreur côté serveur:", errorResponse);
      } catch (error) {
        console.error("Erreur lors de la conversion de la réponse JSON:", error);
      }
        
        return [];
      }
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    
    return [];
  }
}
