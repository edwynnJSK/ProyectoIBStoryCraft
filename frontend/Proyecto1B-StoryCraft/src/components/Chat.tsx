import React, { useEffect, useRef, useState } from "react";
import "../styles/Chat.css";
import { useAuth } from "../context/AuthContext";

const Chat: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [message, setMessage] = useState("");
    const { username } = useAuth();
    const socketRef = useRef<WebSocket | null>(null);

 // Conectar con el servidor WebSocket al montar el componente
 useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socketUrl = `${protocol}://localhost:3001`;

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      console.log("Connection established with the WebSocket server");
    });

    socket.addEventListener("message", (event) => {
        const decodedMessage = JSON.parse(event.data); // Decodificar el mensaje
        // Agregar el mensaje recibido a la lista
        setMessages((prev) => [
          ...prev,
          { sender: decodedMessage.sender, text: decodedMessage.text },
        ]);
      });

    // Limpieza al desmontar el componente
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  const toggleChat = () => {
    setIsExpanded((prev) => !prev);
  };
  
  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const displayName = username?.trim() === "" ? "Anonymous" : username;
    const userMessage = {
        sender: displayName,  // Nombre del usuario
        text: message,        // Contenido del mensaje
      };

    // Enviar mensaje al servidor WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(userMessage)); // Envías el objeto JSON
        console.log("Message sent:", message);
    }

    setMessages((prev) => [
        ...prev,
        { sender: "You", text: message },
      ]);
      setMessage(""); // Limpiar el campo de entrada
  };


    return (
        <div className={`chat-container ${isExpanded ? "expanded" : ""}`}>
        <div className="chat-icon" onClick={toggleChat}>
          💬
        </div>
  
        {isExpanded && (
          <div className="chat-window">
            <div className="chat-header">
              <h4>Chat en Tiempo Real</h4>
              <button className="close-btn" onClick={toggleChat}>
                ✖
              </button>
            </div>
  
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender === "You" ? "sent" : "received"
                  }`}
                >
                  <span className="sender">{msg.sender}:</span> {msg.text}
                </div>
              ))}
            </div>
  
            <div className="chat-input">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    );
};

export default Chat;