import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contractAddress = "0xYourDeployedContractAddress"; // 배포된 계약 주소
const contractABI = [
    "function setValue(uint256 _value) public",
    "function getValue() public view returns (uint256)"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function main() {
    // 값 설정
    const tx = await contract.setValue(42);
    await tx.wait();
    console.log("Transaction completed:", tx.hash);

    // 값 조회
    const value = await contract.getValue();
    console.log("Stored Value:", value.toString());
}

main().catch(console.error);