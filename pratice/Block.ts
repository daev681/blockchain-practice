import crypto from "crypto";

class Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;
  nonce: number = 0;
  
  constructor(index: number, timestamp: number, data: string, previousHash: string) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(this.index + this.timestamp + this.data + this.previousHash)
      .digest("hex");
  }

  mineBlock(difficulty: number): void {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }

}

export default Block;
