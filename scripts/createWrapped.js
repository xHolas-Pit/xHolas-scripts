import { ethers, Wallet } from "ethers"; 

const targetTokenBridgeAddress = ""; 

await targetTokenBridge.createWrapped(
    Buffer.from(vaaBytes.vaaBytes, "base64"),
    {
      gasLimit: 2000000,
    }
  );
  await new Promise((r) => setTimeout(r, 5000)); //Time out to let block propogate
  const wrappedTokenAddress = await targetTokenBridge.wrappedAsset(
    network.wormholeChainId,
    Buffer.from(tryNativeToHexString(network.testToken, "ethereum"), "hex")
  );
  console.log("Wrapped token created at: ", wrappedTokenAddress);