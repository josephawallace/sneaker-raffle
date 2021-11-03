async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy("Nike Dunk SB Low Red", 100000000000000, 10);
  
    console.log("Raffle address:", raffle.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });