import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const INFURA_URL: string = process.env.INFURA_URL as string;
const PRIVATE_KEY: string = process.env.PRIVATE_KEY as string;

if (!INFURA_URL || !PRIVATE_KEY) {
    throw new Error("Missing environment variables: INFURA_URL or PRIVATE_KEY");
}

// 블록체인 연결
const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(INFURA_URL);

// 지갑 설정
const wallet: ethers.Wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 스마트 계약 정보
const contractAddress: string = "0xYourDeployedContractAddress"; // 배포된 계약 주소
const contractABI: string[] = [
    "function setValue(uint256 _value) public",
    "function getValue() public view returns (uint256)"
];

// 스마트 계약 인스턴스 생성
const contract: ethers.Contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function main(): Promise<void> {
    try {
        // 값 설정
        const tx: ethers.TransactionResponse = await contract.setValue(42);
        await tx.wait();
        console.log("Transaction completed:", tx.hash);

        // 값 조회
        const value: bigint = await contract.getValue();
        console.log("Stored Value:", value.toString());
    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch(console.error);
