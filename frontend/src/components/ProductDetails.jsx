import './ProductDetails.css';

import { FormControl, InputLabel, MenuItem, Select, Button, Typography, Container, } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { raffle, fetchName, fetchTicketPrice, buyTicket, walletConnected, holdsTicket, fetchIsClosed, fetchWinner, connectWallet } from '../utils/interact';
import theme from '../static/themes/Theme';
import ViewTicketModal from './ViewTicketModal';

import shoe from '../static/images/shoe.png';
import loadingAnimation from '../static/images/sneaker-loading.gif'
import { ethers } from 'ethers';

const ProductDetails = (props) => {
    const [ wallet, setWallet ] = useState('');
    const [ hasTicket, setHasTicket ] = useState(false);
    const [ raffleDetails, setRaffleDetails ] = useState({ name: '', ticketPrice: 0, isClosed: false, winner: '' });
    const [ size, setSize ] = useState('');
    const [ isReady, setIsReady ] = useState(false);
    const [ loadingMessage, setLoadingMessage ] = useState('') 
    
    const handleSizeSelect = (event) => {
        setSize(event.target.value);
    };

    const sizes = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const sizesList = sizes.map((number) =>
        <MenuItem key={number} value={number}>US M {number}</MenuItem>
    );

    const buyTicketClick = async (size) => {
        if(!size) { return; }
        setLoadingMessage('Waiting on confirmation...')
        setIsReady(false);
        const response = await buyTicket(size);
        if (!response) {
            setIsReady(true);
            console.log('Failed to purchase ticket.');
        } else {
            setLoadingMessage('Buying ticket...');
        }
    };

    const addWalletListener = () => {
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0].toString().toLowerCase());
                } else {
                    setWallet('');
                    console.log('Connect to Metamask using the "Connect to Wallet" button.');
                }
            });
        } else {
            console.log('You must install Metamask.');
        }
    }

    const addNewTicketListener = () => {
        raffle.on('NewTicket', async (holder) => {
            setHasTicket(await holdsTicket());
            setIsReady(true);
            console.log('NewTicketEvent fired.');
        });
    };

    const addRaffleCloseListener = () => {
        raffle.on('Closed', async (winner) => {
            console.log(`Closed event fired with winner: ${winner}`);
            setRaffleDetails({...raffleDetails, isClosed: true, winner: winner});
        });
    }

    const isRaffleDetailsReady = (name, ticketPrice, status, winner) => {
        if (raffleDetails.name === name && raffleDetails.ticketPrice === ethers.utils.formatEther(ticketPrice) && raffleDetails.isClosed === status && raffleDetails.winner === winner) {
            setIsReady(true);
            console.log('hey')
        } else {
            console.log(`raffleDetails:\t ${raffleDetails.name} ${raffleDetails.ticketPrice} ${raffleDetails.isClosed} ${raffleDetails.winner}`);
            console.log(`smart contract:\t ${name} ${ticketPrice} ${status} ${winner}`);
        }
    };

    useEffect(() => {
        console.log('mounting product details...');
        async function detailsEffect() {
            const name = await fetchName();
            const ticketPrice = await fetchTicketPrice();
            const status = await fetchIsClosed();
            const winner = await fetchWinner();
            setRaffleDetails({...raffleDetails, name: name, ticketPrice: ethers.utils.formatEther(ticketPrice), isClosed: status, winner: winner});
            isRaffleDetailsReady(name, ticketPrice, status, winner);
        }

        async function walletEffect() {
            const connection = await walletConnected();
            if (connection) {
                const address = connection.address;
                setWallet(address);
            }
        }

        async function holdingEffect() {
            const holdingTicket = await holdsTicket();
            setHasTicket(holdingTicket);
        }

        detailsEffect();
        walletEffect();
        holdingEffect();
        addWalletListener();
        addNewTicketListener();
        addRaffleCloseListener();

        console.log(raffleDetails.name);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function holdingEffect() {
            const holdingTicket = await holdsTicket();
            setHasTicket(holdingTicket);
        }
        holdingEffect();
    }, [ wallet ]);

    useEffect(() => {
        async function raffleDetailsLoadingEffect() {
            const name = await fetchName();
            const ticketPrice = await fetchTicketPrice();
            const status = await fetchIsClosed();
            const winner = await fetchWinner();
            if (raffleDetails.name === name && raffleDetails.ticketPrice === ethers.utils.formatEther(ticketPrice) && raffleDetails.isClosed === status && raffleDetails.winner === winner) {
                setIsReady(true);
            }
        }
        raffleDetailsLoadingEffect();
    }, [raffleDetails]);

    return (
        <div className='product-details'>
            {isReady ? 
            <Container>
            <Typography variant='h4' m={theme.spacing(0, 0, 4, 0)}>{raffleDetails.name}</Typography>
            <img id="shoe-img" src={shoe} alt="Shoe" />
            <hr />
            <Typography m={theme.spacing(0, 0, 4, 0)}>Ticket Price:    <b>{raffleDetails.ticketPrice} ETH</b></Typography>
            <Typography m={theme.spacing(4, 0, 4, 0)}><b>Description.</b> The Nike Dunk Low Championship Red features a University Red leather upper with white leather overlays and Swooshes. A matching sole and woven tongue label adds the finishing touches to this retro design.</Typography>
            <FormControl fullWidth>
                {!raffleDetails.isClosed &&
                <InputLabel id="size-select-label">Size</InputLabel>
                }
                {!raffleDetails.isClosed &&
                <Select
                    labelId="size-select-label"
                    id="size-select"
                    value={size}
                    label="Size"
                    onChange={handleSizeSelect}
                >
                    {sizesList}
                </Select>
                }
                <hr />
                {!raffleDetails.isClosed &&
                <Button color="secondary" variant="contained" disableElevation onClick={() => buyTicketClick(size)}>
                    BUY RAFFLE TICKET
                </Button>   
                }
                {raffleDetails.isClosed &&
                <Button color="primary" variant="contained" disableElevation onClick={() => console.log('raffle closed.')}>
                    RAFFLE CLOSED
                </Button> 
                }
            </FormControl>
            {hasTicket ?
            <ViewTicketModal hasTicket={hasTicket} winner={raffleDetails.winner} />
            :null
            }
            {!wallet ?
            <Button className="connect-button" sx={{ mt: 4 }} color="warning" variant="contained" disableElevation onClick={connectWallet}>
                CONNECT TO WALLET
            </Button>
            :null
            }
        </Container>
        :
        <div>
            <img id="loading-gif" src={loadingAnimation} alt="Sneaker loading gif" />
            <Typography className="loading-message" variant="h4">{loadingMessage}</Typography>
        </div>
        }
        </div>
    );
}

export default ProductDetails;