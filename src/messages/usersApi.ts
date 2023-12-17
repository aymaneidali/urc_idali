import { UserPublic } from "../model/common";

export async function listUsers(): Promise<UserPublic[]> {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication": "Bearer " + sessionStorage.getItem("token"),
        },
      });

      if (response.ok) {
        const users = await response.json();
        return users as UserPublic[];
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
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return [];
    }
  }
