import { ethers, Wallet } from "ethers"; 
import { attestFromEth, getEmitterAddressEth, parseSequenceFromLogEth } from "@certusone/wormhole-sdk";
import axios from "axios"; 
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


async function attest() {
    const networkTokenAttestation = await attestFromEth(
        fujiTokenBridge, // Token Bridge Address
        signer,
         //Private Key to sign and pay for TX + RPC Endpoint
        comoEstasTokenAddress
    );
    return networkTokenAttestation
}
// attest();

async function retrieveVAA() {

    const networkTokenAttestation = await attest(); 
    console.log('networkTokenAttestation: ', networkTokenAttestation); 

    const emitterAddr = getEmitterAddressEth(fujiTokenBridge);
    console.log('emitterAddr: ', emitterAddr); 
    const seq = parseSequenceFromLogEth(
        networkTokenAttestation,
        fujiCoreBridge
    );
    console.log('seq: ', seq); 

    const vaaURL = `https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/${wormholeChainId}/${emitterAddr}/${seq}`;
    console.log("Searching for: ", vaaURL);
    let vaaBytes; 
    try {
        vaaBytes = await axios.get(vaaURL); 
    } catch (e) {
        console.log('axios error: ', e); 
    }
    console.log('vaaBytes axios: ', vaaBytes); 
    // let vaaBytes = await (await fetch(vaaURL)).json();
    while (vaaBytes == null) {
      console.log("VAA not found, retrying in 5s!");
      await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
      vaaBytes = await (await fetch(vaaURL)).json();
      console.log('VAA found: ', vaaBytes); 
    }
}
retrieveVAA(); 

// 'AQAAAAABAPu8meqd3RgOVYria56q/tv0oLIJNo7ceTe/qrQ8W3URTfcaeq2Pt4zBN3M7dfW24WxCcHh9y8K4JleYhkMvNB8AYzY/PeY8AQAABgAAAAAAAAAAAAAAAGHkTlBspWWebAu6m2eFhvotcpdWAAAAAAAAEOcBAgAAAAAAAAAAAAAAAGp5iZuJ8G3cqG1xuupSKAlI1lVDAAYSSFRLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIb2xhc1Rva2VuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
  
