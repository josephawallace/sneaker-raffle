// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract Raffle {

    // state variables
    bool public isClosed;
    uint public ticketPrice;
    uint public ticketLimit;
    address public winner;
    address public owner;
    string public name;
    Ticket[] tickets;

    // helper variables
    bytes32 biggest;

    // ticket object
    struct Ticket {
        bytes32 id;
        address holder;
        uint size;
    }

    // events
    event NewTicket(address indexed holder);
    event Closed(address indexed winner);
    event Updated(string message);

    constructor(string memory _name, uint _ticketPrice, uint _ticketLimit) {
        name = _name;
        ticketPrice = _ticketPrice;
        ticketLimit = _ticketLimit;
        isClosed = false;
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier isLive {
        require(isClosed == false);
        _;
    }
    
    function addTicket(uint _size) public payable isLive {
        require(msg.value == ticketPrice);
        bytes memory seed = abi.encodePacked(msg.sender, tickets.length);
        seed = abi.encodePacked(seed, block.timestamp);
        Ticket memory ticket = Ticket(keccak256(seed), msg.sender, _size);
        tickets.push(ticket);
        emit NewTicket(msg.sender);

        if (ticket.id > biggest) {
            biggest = ticket.id;
            winner = ticket.holder;
        }

        if (tickets.length >= ticketLimit) {
            setIsClosed(true);
        } 
        
    }

    // SETTER FUNCTIONS //
    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function setIsClosed(bool _isClosed) private {
        isClosed = _isClosed;
        emit Closed(winner);
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
