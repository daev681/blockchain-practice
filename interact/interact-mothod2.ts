import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const INFURA_URL = process.env.INFURA_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

if (!INFURA_URL || !PRIVATE_KEY) {
    throw new Error("Missing environment variables: INFURA_URL or PRIVATE_KEY");
}

/**
 * 함수 시그니처 생성 함수
 * @param functionSignature 함수 시그니처 문자열 (예: "setValue(uint256)")
 * @returns 4바이트 함수 selector (예: "0x60fe47b1")
 */
function getFunctionSelector(functionSignature: string): string {
    const hash = crypto.createHash("keccak256").update(functionSignature).digest("hex");
    return "0x" + hash.substring(0, 8); // 앞 4바이트(8자리)만 사용
}

// 사용 예제
const GET_VALUE_SIGNATURE = getFunctionSelector("setValue(uint256)");
const SET_VALUE_SIGNATURE = getFunctionSelector("getValue()");

const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";


/**
 * JSON-RPC 요청을 보내는 함수
 */
async function sendJsonRpcRequest(method: string, params: any[]): Promise<any> {
    const response = await fetch(INFURA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method,
            params,
            id: 1
        }),
    });

    const json = await response.json();
    if (json.error) {
        throw new Error(json.error.message);
    }
    return json.result;
}

/**
 * 스마트 계약 값 조회 (eth_call)
 */
async function getValue(): Promise<string> {
    const data = GET_VALUE_SIGNATURE;
    
    const result = await sendJsonRpcRequest("eth_call", [
        {
            to: CONTRACT_ADDRESS,
            data: data
        },
        "latest"
    ]);

    return parseInt(result, 16).toString();
}

/**
 * 스마트 계약 값 설정 (eth_sendRawTransaction)
 */
async function setValue(newValue: number): Promise<string> {
    const ethers = await import("ethers");
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const provider = new ethers.JsonRpcProvider(INFURA_URL);

    const nonce = await provider.getTransactionCount(wallet.address, "latest");
    const gasPrice = await provider.getGasPrice();
    
    const data = SET_VALUE_SIGNATURE + newValue.toString(16).padStart(64, "0");

    const tx = {
        to: CONTRACT_ADDRESS,
        gasLimit: 100000, // 적절한 가스 제한 설정
        gasPrice: gasPrice,
        nonce: nonce,
        data: data,
    };

    const signedTx = await wallet.signTransaction(tx);
    const txHash = await sendJsonRpcRequest("eth_sendRawTransaction", [signedTx]);

    return txHash;
}

/**
 * 실행 함수
 */
async function main() {
    try {
        console.log("Setting value...");
        const txHash = await setValue(42);
        console.log("Transaction Hash:", txHash);

        console.log("Fetching value...");
        const value = await getValue();
        console.log("Stored Value:", value);
    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch(console.error);
