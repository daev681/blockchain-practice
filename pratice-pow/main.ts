import Blockchain from "./Blockchain";
import Block from "./Block";

const myChain = new Blockchain();
console.log("Genesis Block:", myChain.chain);

const block1 = new Block(1, Date.now(), "Transaction 1", myChain.getLatestBlock().hash);
myChain.addBlock(block1);
const block2 = new Block(2, Date.now(), "Transaction 2", myChain.getLatestBlock().hash);
myChain.addBlock(block2);

console.log("Blockchain:", myChain.chain);
console.log("Is blockchain valid?", myChain.isValidChain());