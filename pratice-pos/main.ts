import Blockchain from "../pratice-pos/Blockchain";

// 블록체인 테스트 실행
const myBlockchain = new Blockchain();

// 검증자 등록
myBlockchain.registerValidator("Alice", 50);
myBlockchain.registerValidator("Bob", 30);
myBlockchain.registerValidator("Charlie", 20);

// 블록 추가
myBlockchain.addBlock("Transaction 1");
myBlockchain.addBlock("Transaction 2");
myBlockchain.addBlock("Transaction 3");

// 블록체인 출력
console.log(JSON.stringify(myBlockchain, null, 2));