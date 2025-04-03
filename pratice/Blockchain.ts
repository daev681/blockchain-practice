import Block from "./Block";

class Blockchain {
  chain: Block[];
  difficulty: number = 2; // 난이도 설정
  
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    return new Block(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isValidChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export default Blockchain;
