const { expect } = require("chai");
const exp = require("constants");
const { type } = require("os");

describe('Raffle', () => {

    let Raffle;
    let raffle;

    let raffleName = 'My Raffle';
    let ticketPrice = 100000000000000;
    let ticketLimit = 3;

    let owner;
    let addr1;
    let addr2;
    let addr3;

        
    beforeEach(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        Raffle = await ethers.getContractFactory('Raffle');
        raffle = await Raffle.deploy(raffleName, ticketPrice, ticketLimit);
        await raffle.deployed();
    });
    
    it('Should properly initialize', async () => {
        expect(await raffle.name()).to.equal(raffleName);
        expect(await raffle.ticketPrice()).to.equal(ticketPrice);
        expect(await raffle.ticketLimit()).to.equal(ticketLimit);
        expect(await raffle.owner()).to.equal(owner.address);
    });

    it('Should add ticket', async () => {
        await raffle.connect(owner).addTicket(4)
        expect(await raffle.getTicketCount()).to.equal(1); 
    });

    it('Should declare a winner', async () => {
        await raffle.connect(owner).addTicket(4)
        await raffle.connect(addr1).addTicket(4)
        await raffle.connect(addr2).addTicket(4)
        
        expect(await raffle.winner()).to.equal(addr2.address);
    });

});