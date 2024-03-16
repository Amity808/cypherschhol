const Web3 = require('web3')
const config = require('config')
const contractAbi = require('../contract/abi.json')
// import { json } from 'express/lib/response';
// import { resolve } from 'path';

config.config();
const abi = ''
const jsonABi =''

const Provider_WS_URL = process.env.WSS_PROVIDE //WSS_PROVIDE

let connectors = {}

const setupProviderAndSubscription = () => {
    let provider = new Web3.providers.WebsocketProvider(Provider_WS_URL)
    let web3 = new Web3(provider)
    let contractAddress = contractAbi.address || process.env.SMART_CONTRACT_ADDRESS
    console.log('Contract Address', contractAddress);
    let contract = new web3.eth.Contract(contractAbi.abi, contractAddress)
    connectors = { web3: web3, contract: contract, provider: provider, watchedAddresses: contractAddress }
    let setupNewProvider = false
    let sequentialRetryCount = 0

    const setupNewProviderAndSubs = async () => {
        const sleepsTimeMins = 10 || sequentialRetryCount * 1000
        console.log('sleeping', sleepsTimeMins);
        await sleep(sleepsTimeMins)
        sequentialRetryCount++
        if(!setupNewProvider) {
            setupNewProvider = true
            setupProviderAndSubscription()
        }
    }

    provider.on('error', async (error) => {
        console.log("websocketProvider has encounter an error", error);
        await setupNewProviderAndSubs()
    })

    provider.on('end', async () => {
        console.log("WebsocketProvider has ended, will restart");
        setupNewProviderAndSubs()
    })
}

setupProviderAndSubscription()
function sleep(ms, onSleep) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
        if(onSleep) {
            onSleep()
        }
    })
}



export default connectors