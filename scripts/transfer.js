import { ethers, Wallet } from "ethers"; 
import { attestFromEth, getEmitterAddressEth, parseSequenceFromLogEth } from "@certusone/wormhole-sdk";
import axios from "axios"; 
import TokenBridgeABI from "../artifacts/contracts/WormholeTokenBridge/TokenBridge.sol/TokenBridge.json" assert {type: 'json'}
// bridge Holas from fuji to ethereum 

const mnemonic = "hip return humble loan machine bulk mail finger monitor tree knock fiber"; 
const walletMnemonic = Wallet.fromMnemonic(mnemonic); 
const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/C/rpc');
// const signer = provider.getSigner(walletMnemonic.address)
const signer = walletMnemonic.connect(provider);

const wormholeChainId = 6; 

const fujiCoreBridge = "0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C";
const fujiTokenBridge = "0x61E44E506Ca5659E6c0bba9b678586fA2d729756"; 

const holasTokenAddress = "0x6A79899B89F06DDca86D71Baea52280948d65543"; 
const comoEstasTokenAddress = "0x2e53F4f07148b61b9FD4baBBfc408d4a49974ef4"; 

const tokenBridgeABI = TokenBridgeABI; 
console.log('abi: ', tokenBridgeABI);
const tokenBridgeContract = new ethers.Contract(fujiTokenBridge, tokenBridgeABI, signer);
tokenBridgeContract.connect(signer); 

const arbiterFee = 0
const amount = 1000000
const recipientChain = 2; // goerli
const recipient = ethers.utils.hexlify(ethers.utils.hexZeroPad('0xB0E5477a850ECf7c6C587e48b1b029957BB1b53c', 32))
const nonce = 30
console.log(recipient)

async function main() {
    const tx = await tokenBridgeContract.transferTokens(
        holasTokenAddress, 
        ethers.BigNumber.from(amount - arbiterFee), 
        recipientChain,
        recipient, 
        arbiterFee, 
        nonce,
        {
            value: amount,
            gasLimit: 1000000,
        }
    )
    console.log(tx); 
    console.log(await tx.wait())
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})