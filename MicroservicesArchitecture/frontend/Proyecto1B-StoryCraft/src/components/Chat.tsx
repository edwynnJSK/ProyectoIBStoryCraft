import React, { useEffect, useRef, useState } from "react";
import "../styles/Chat.css";
import { useAuth } from "../context/AuthContext";
import { io, Socket } from "socket.io-client";

const Chat: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [message, setMessage] = useState("");
    const { username } = useAuth();
    const socketRef = useRef<Socket | null>(null);

 useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socketUrl = `${protocol}://localhost:3000`;

    const socket = io(socketUrl, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to the WebSocket server");
    });

   /*socket.addEventListener("message", (event) => {
        const decodedMessage = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          { sender: decodedMessage.sender, text: decodedMessage.text },
        ]);
      });*/

      socket.on("message", (data: { sender: string; text: string }) => {
        setMessages((prev) => [...prev, data]);
      });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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
        sender: displayName, 
        text: message,      
      };

    if (socketRef.current) {
        socketRef.current.emit("message",userMessage);
        console.log("Message sent:", JSON.stringify(userMessage));
    }

    setMessages((prev) => [
        ...prev,
        { sender: "You", text: message },
      ]);
      //setMessage("");
  };


    return (
        <div className={`chat-container ${isExpanded ? "expanded" : ""}`}>
        <div className="chat-icon" onClick={toggleChat}>
          💬
        </div>
  
        {isExpanded && (
          <div className="chat-window">
            <div className="chat-header">
              <h4>Chat</h4>
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