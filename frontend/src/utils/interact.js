import axios from 'axios';
import { ethers } from 'ethers';
import RaffleJSON from './Raffle.json'

require('dotenv').config();

const baseURL = 'http://localhost:5000/api';

const alchemyAPIKey = process.env.REACT_APP_ALCHEMY_API_KEY;
const provider = new ethers.providers.AlchemyProvider('ropsten', alchemyAPIKey);
const contractABI = RaffleJSON.abi;
const contractAddress = '0x66116e4Ed7BE48b095613863CD4A2b4DC924DB64';

export const raffle = new ethers.Contract(contractAddress, contractABI, provider);

export const fetchName = async () => {
    const name = await raffle.name();
    return name; 
};

export const fetchTicketPrice = async () => {
    const ticketPrice = await raffle.ticketPrice();
    return ticketPrice;
};

export const fetchIsClosed = async () => {
    const isClosed = await raffle.isClosed();
    return isClosed;
};

export const fetchTicketLimit = async () => {
    const ticketLimit = raffle.ticketLimit();
    return ticketLimit;
};

export const fetchWinner = async () => {
    const winner = raffle.winner();
    return winner;
};

export const fetchTickets = async () => {
    const tickets = raffle.getTickets();
    return tickets;
};

export const fetchTicket = async (index) => {
    const ticketLimit = raffle.getTicket(index);
    return ticketLimit;
};

export const fetchTicketCount = async () => {
    const ticketCount = raffle.ticketCount();
    return ticketCount;
};

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
            const accounts = await web3Provider.send('eth_requestAccounts', []);
            return {address: accounts[0], status: 'wallet connected'}
        } catch(err) {
            console.log(err);
        }
    } else {
        console.log('You must install Metamask.');
    }
};

export const walletConnected = async () => {
    if (window.ethereum) {
        try {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await web3Provider.send('eth_accounts', []);
            if (accounts.length > 0) {
                return {address: accounts[0], status: 'wallet connected'};
            }
        } catch(err) {
            return console.log(err)
        } 
    } else {
        console.log('You must install Metamask.');
    }
};

export const buyTicket = async (size) => {
    const connection = await walletConnected();
    if (connection) {
        try {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = web3Provider.getSigner();
            const raffleWithSigner = raffle.connect(signer);
            const ticketPrice = await raffle.ticketPrice();
            const result = await raffleWithSigner.addTicket(size, { gasLimit: 192000, value: ticketPrice,});
            return {address: connection.address, tx: result, status: 'success'}
        } catch(err) {
            console.log(err);
        }
        try {
            const response = axios.post(`${baseURL}/user/create`, { address: connection.address });
            console.log(`response.data: ${response.data}`);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            await connectWallet();
            buyTicket(size);
        } catch (err) {
            console.log('Failed to connect to Ethereum wallet.');
        }      
    }
};

export const holdsTicket = async () => {
    const connection = await walletConnected();
    if (connection) {
        const connectionAddress = connection.address.toString().toLowerCase();
        const tickets = await raffle.getTickets();
        for (let i = 0; i < tickets.length; i++) {
            const holderAddress = tickets[i].holder.toString().toLowerCase();
            if (holderAddress === connectionAddress) {
                return {address: connection.address, status: 'holds ticket'};
            }
        }
    } else {
        console.log('Failed to connect to Ethereum wallet.');
    }
};