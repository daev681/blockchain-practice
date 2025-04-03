import WebSocket, { WebSocketServer } from "ws";
import Blockchain from "../pratice-pow/Blockchain";
import Block from "../pratice-pow/Block";

class P2PNetwork {
  blockchain: Blockchain;
  sockets: WebSocket[] = [];
  server: WebSocketServer;

  constructor(port: number, blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.server = new WebSocketServer({ port });

    this.server.on("connection", (socket) => this.connectSocket(socket));
    console.log(`📡 P2P Server running on ws://localhost:${port}`);
  }

  connectSocket(socket: WebSocket) {
    this.sockets.push(socket);
    console.log("✅ New peer connected");
    
    socket.on("message", (message) => this.handleMessage(socket, message));
  }

  connectToPeer(peerUrl: string) {
    const socket = new WebSocket(peerUrl);
    socket.on("open", () => this.connectSocket(socket));
  }

  broadcast(message: any) {
    this.sockets.forEach((socket) => socket.send(JSON.stringify(message)));
  }

  handleMessage(socket: WebSocket, message: any) {
    const data = JSON.parse(message);

    if (data.type === "NEW_BLOCK") {
      const newBlock = data.block as Block;
      if (this.blockchain.isValidChain()) {
        this.blockchain.chain.push(newBlock);
        console.log("📦 New block added to chain:", newBlock);
      }
    }
  }

  broadcastNewBlock(block: Block) {
    this.broadcast({ type: "NEW_BLOCK", block });
  }
}

export default P2PNetwork;
