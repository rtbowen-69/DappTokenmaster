const { expect } = require("chai")

const NAME = "TokenMaster"
const SYMBOL = "TM"

const OCCASION_NAME = "ETH Texas"
const OCCASION_COST = ethers.utils.parseUnits('1', 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Apr 27"
const OCCASION_TIME = "6:00PM MST"
const OCCASION_LOCATION = "Austin, Texas"

describe("TokenMaster", () => {
  let TokenMaster
  let deployer, buyer

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners()   // setup accounts

    const TokenMaster = await ethers.getContractFactory("TokenMaster")// Gets the contract from hasrdhat
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)       //This deploys contract ticketMaster to this test environment to test

    const transaction = await tokenMaster.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    )

    await transaction.wait()  // wait for transaction to be written to the blockchain before testing for the results
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME)// Confirms the name matches "TokenMaster"
    })

    it("Sets the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address) // deployer of contract is owner of contract
      
    })

  })

  describe("Occasions", () => {

    it("Updates ocassions count", async () => {
      const totalOccasions = await tokenMaster.totalOccasions()
      expect(totalOccasions).to.be.equal(1)
    })

    it("Returns occasions attributes", async () => {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.id).to.be.equal(1)
      expect(occasion.name).to.be.equal(OCCASION_NAME)
      expect(occasion.cost).to.be.equal(OCCASION_COST)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS)
      expect(occasion.date).to.be.equal(OCCASION_DATE)
      expect(occasion.time).to.be.equal(OCCASION_TIME)
      expect(occasion.location).to.be.equal(OCCASION_LOCATION)      
    })

  })  

  describe("Minting", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('1', 'ether')

    beforeEach(async () => {
      const transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
      await transaction.wait()

    })

    it("Updates ticket count", async () => {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1)      
    })

    it("Updates buyer status", async () => {
      const status = await tokenMaster.hasBought(ID, buyer.address)
      expect(status).to.be.equal(true)      
    })

    it("Updates seat status", async () => {
      const owner = await tokenMaster.seatTaken (ID, SEAT)
      expect(owner).to.be.equal(buyer.address)      
    })

    it("Updates overall seating status", async () => {
      const seats = await tokenMaster.getSeatsTaken(ID)
      expect(seats.length).to.equal(1)
      expect(seats[0]).to.equal(SEAT)           
    })

    it("Updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance (tokenMaster.address)
      expect(balance).to.be.equal(AMOUNT)      
    })

  })

  describe("Withdrawl", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('1', 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)
      
      let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
      await transaction.wait()

      transaction = await tokenMaster.connect(deployer).withdraw()
      await transaction.wait()
    }) 

    it("Updates owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })   

    it("Updates contract balance", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address)
      expect(balance).to.equal(0)
    })   

  })
  
})
