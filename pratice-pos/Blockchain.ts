import Block from "../pratice-pos/Block";

class Blockchain {
    chain: Block[];
    validators: { [key: string]: number }; // 검증자 주소 -> 스테이킹 양
  
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.validators = {};
    }
  
    createGenesisBlock(): Block {
      return new Block(0, Date.now(), "Genesis Block", "0", "System");
    }
  
    getLatestBlock(): Block {
      return this.chain[this.chain.length - 1];
    }
  
    registerValidator(address: string, stakeAmount: number): void {
      if (this.validators[address]) {
        this.validators[address] += stakeAmount;
      } else {
        this.validators[address] = stakeAmount;
      }
    }
  
    selectValidator(): string {
      const totalStake = Object.values(this.validators).reduce((sum, stake) => sum + stake, 0);
      const rand = Math.random() * totalStake;
      let cumulative = 0;
  
      for (const [validator, stake] of Object.entries(this.validators)) {
        cumulative += stake;
        if (rand < cumulative) {
          return validator;
        }
      }
      return Object.keys(this.validators)[0]; // 기본적으로 첫 번째 검증자 선택
    }
  
    addBlock(data: string): void {
      const validator = this.selectValidator();
      const previousBlock = this.getLatestBlock();
      const newBlock = new Block(previousBlock.index + 1, Date.now(), data, previousBlock.hash, validator);
      this.chain.push(newBlock);
      console.log(`✅ 블록 추가됨! 생성자: ${validator}, 블록 해시: ${newBlock.hash}`);
    }
  }
  export default Blockchain