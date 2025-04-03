import express, { Request, Response } from "express";
import Blockchain from "../pratice-pow/Blockchain";
import P2PNetwork from "./P2PNetwork";

const HTTP_PORT: number = 3000;
const P2P_PORT: number = 6000;

const blockchain = new Blockchain();
const p2pNetwork = new P2PNetwork(P2P_PORT, blockchain);

const app = express();
app.use(express.json());

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

interface MineRequest {
  miner: string;
}

interface ConnectRequest {
  peer: string;
}

// ✅ 블록체인 조회
app.get("/blocks", (req: Request, res: Response) => {
  res.json(blockchain.chain);
});

// ✅ 트랜잭션 추가
app.post("/transaction", (req: Request, res: Response) => {
  const { from, to, amount }: Transaction = req.body;
  blockchain.addTransaction({ from, to, amount });
  res.json({ message: "Transaction added" });
});

// ✅ 블록 마이닝
app.post("/mine", (req: Request, res: Response) => {
  const { miner }: MineRequest = req.body;
  const newBlock = blockchain.minePendingTransactions(miner);

  // 📡 새로운 블록을 P2P 네트워크에 전파
  p2pNetwork.broadcastNewBlock(newBlock);

  res.json({ message: "Block mined", newBlock });
});

// ✅ 새로운 노드 연결
app.post("/connect", (req: Request, res: Response) => {
  const { peer }: ConnectRequest = req.body;
  p2pNetwork.connectToPeer(peer);
  res.json({ message: `Connected to ${peer}` });
});

app.listen(HTTP_PORT, () => {
  console.log(`🚀 Server running on http://localhost:${HTTP_PORT}`);
});
