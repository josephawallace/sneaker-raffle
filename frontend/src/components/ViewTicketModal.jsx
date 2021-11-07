import './ViewTicketModal.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { walletConnected } from '../utils/interact';

const baseURL = 'http://localhost:5000/api'

const ViewTicketModal = (props) => {

    const [ user, setUser ] = useState({address: '', email: '', phone: '', shippingAddress: ''});
    const [ updatedUser, setUpdatedUser ] = useState(user);
    const [ open, setOpen ] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        async function submitUser() {
            const connection = await walletConnected();
            if (connection) {
                try {
                    console.log(updatedUser);
                    console.log(updatedUser.email);
                    const response = await axios.put(`${baseURL}/user/${connection.address}/update`, updatedUser);
                    setUser(response.data);
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('Failed to connect to Ethereum wallet.');
            }
        }

        submitUser();
    };

    const onEmailFieldChange = (email) => {
        setUpdatedUser({...updatedUser, email: email.target.value});
    }

    useEffect(() => {
        console.log('mounting view ticket modal...');
        async function fetchUser() {
            const connection = await walletConnected();
            if (connection) {
                const response = await axios.get(`${baseURL}/user/${connection.address}`);    
                if (response.data) { setUser(response.data); setUpdatedUser(response.data); }
            } else {
                console.log('Failed to connect to Ethereum wallet.');
            }
        }
        fetchUser();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(user);
        if (!user.address) { return; } // if there is no user was loaded into state
        if (!(user.phone || user.email)) {
            setOpen(true);
        }
    }, [user]);

    return (
        <div>
            <Button sx={{ mt: 4 }} className="view-ticket" color="primary" variant="contained" disableElevation onClick={handleClickOpen}>
                VIEW TICKETS
            </Button>
            {/* if the user doesnt have a contact record in the database render below */}
            {(user.email) ?
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Your tickets</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Ticket details appear here.
                </DialogContentText>
                </DialogContent>
            </Dialog>
            :null
            }
            {/* if the user has a record in the database render the ticket */}
            {!(user.email) ?
            <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Get an update if you win!</DialogTitle>
            <DialogContent>
            <DialogContentText>
                We will send updates on changes to the raffle status.
                The winner will receive a link to input shipping information to receive the prize.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={onEmailFieldChange}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
        :null
        }
        </div>
    );
};

export default ViewTicketModal;