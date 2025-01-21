import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }


  @SubscribeMessage('message') 
  handleMessage(
    @MessageBody() data: { sender: string, text: string },
    @ConnectedSocket() client: Socket,
  ){
    console.log(`Mensaje recibido de ${client.id}:`, data.sender, data.text);

    client.broadcast.emit('message', { sender: data.sender, text: data.text });
  }
}
