// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

/**
@title Raffle for a featured sneaker
@author Joseph A. Wallace
@notice Manages raffle status and selects a random winner on its close
*/
contract Raffle {

    /// @notice toggle for the raffle to accept new tickets
    bool public isClosed;

    /// @notice price of a single raffle ticket
    uint public ticketPrice;

    /// @notice number of tickets available for purchase before the raffle closes
    uint public ticketLimit;

    /// @notice address of the randomly selected raffle winner
    address public winner;

    /// @notice address of the contract owner, capable of making changes to the raffle state
    address public owner;

    /// @notice name of the raffle/name of the product being raffled
    string public name;

    /// @notice array of tickets that have been purchased
    Ticket[] tickets;

    /// @notice value of the largest ticket id
    bytes32 biggest;

    /// @notice smart contract abstraction of a raffle ticket
    struct Ticket {
        bytes32 id;
        address holder;
        uint size;
    }

    /// @notice alert of a new ticket being purchased and added as a candidate to win the raffle
    /// @param holder address of the account that bought the raffle ticket
    event NewTicket(address indexed holder);

    /// @notice alert of the raffle being closed
    /// @param winner address of the randomly selected ticket holder
    event Closed(address indexed winner);

    /// @notice alert that the details of the raffle have changed
    /// @param message description of the changes that have taken place
    event Updated(string message);

    /**
    @notice initialize raffle details
    @param _name name of the raffle/name of the product being raffled
    @param _ticketPrice price of a single raffle ticket
    @param _ticketLimit number of tickets available for purchase before the raffle closes
    */
    constructor(string memory _name, uint _ticketPrice, uint _ticketLimit) {
        name = _name;
        ticketPrice = _ticketPrice;
        ticketLimit = _ticketLimit;
        isClosed = false;
        owner = msg.sender;
    }

    /// @notice ensures the owner is calling a function
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    /// @notice ensures the raffle is currently open
    modifier isLive {
        require(isClosed == false);
        _;
    }
    
    /**
    @notice adds ticket to the raffle and selects the winner
    @dev the win condition is defined here to be the address that produces the largest hex value from the seed being hashed
    @param _size shoe size associated with the ticket
    */
    function addTicket(uint _size) public payable isLive {
        require(msg.value == ticketPrice);
        bytes memory seed = abi.encodePacked(msg.sender, tickets.length);
        seed = abi.encodePacked(seed, block.timestamp);
        Ticket memory ticket = Ticket(keccak256(seed), msg.sender, _size);
        tickets.push(ticket);
        emit NewTicket(msg.sender);

        if (ticket.id > biggest) { // win condition
            biggest = ticket.id;
            winner = ticket.holder;
        }

        if (tickets.length >= ticketLimit) { // close condition
            setIsClosed(true);
        } 
    }

    // SETTER FUNCTIONS //
    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function setIsClosed(bool _isClosed) private {
        isClosed = _isClosed;
        if (isClosed) {
            emit Closed(winner); // make an announcement if the raffle is closed with the current standing winner
        }
    }

    function setTicketPrice(uint _ticketPrice) public onlyOwner {
        ticketPrice = _ticketPrice;
    }

    function setTicketLimit(uint _ticketLimit) public onlyOwner {
        ticketLimit = _ticketLimit;
    }

    function setOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function update(string memory _name, bool _isClosed, uint _ticketPrice, uint _ticketLimit) public onlyOwner {
        setName(_name);
        setIsClosed(_isClosed);
        setTicketPrice(_ticketPrice);
        setTicketLimit(_ticketLimit);
        emit Updated("Raffle updated.");
    }


    // GETTER FUNCTION //
    function getTicketCount() public view returns(uint) {
        return tickets.length;
    }

    function getTicket(uint _index) public view returns(Ticket memory) {
        return tickets[_index];
    }

    function getTickets() public view returns(Ticket[] memory) {
        return tickets;
    }

    function getBiggest() public onlyOwner view returns(bytes32) {
        return biggest;
    }
    
    // RESET FUNCTION //
    function reset() public onlyOwner {
        delete name;
        delete isClosed;
        delete ticketPrice;
        delete ticketLimit;
        delete winner;
        delete tickets;
        delete biggest;
    }
}
