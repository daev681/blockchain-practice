import * as crypto from "crypto";

class Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;
  validator: string; // 블록을 생성한 검증자

  constructor(index: number, timestamp: number, data: string, previousHash: string, validator: string) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.validator = validator;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto.createHash("sha256")
      .update(this.index + this.timestamp + this.data + this.previousHash + this.validator)
      .digest("hex");
  }
}

export default Block;