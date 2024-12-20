import { expect } from "chai";
import hre, { ethers, waffle } from 'hardhat'
import { BigNumber, constants, ContractFactory, Contract, Wallet, Signer } from 'ethers'
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils"
import { Provider } from "@ethersproject/abstract-provider"
import moment from "moment"

import { addComma, strDisplay } from "../scripts/requirement"

let provider
let F8_Factory
let F8_Contract       :any
let Launcpad_Factory
let Launcpad_Contract :any

let Owner             :any
let User1             :any
let User2             :any

let Receipt           :any
let TX_Global         :any

let totalGasUsed = ethers.BigNumber.from('0')

async function NextTime(nTime:any) {
  // Currenct Time
  const blockNumBefore = await ethers.provider.getBlockNumber()
  const blockBefore = await ethers.provider.getBlock(blockNumBefore)
  const timestampBefore = blockBefore.timestamp
  const currentDate = new Date(timestampBefore * 1000)
  console.log("\tCurrent Time : ",timestampBefore," - ",currentDate.toLocaleDateString("en-US"))
    // Time Operations
  const time = moment().utc().unix() + nTime
  await ethers.provider.send("evm_setNextBlockTimestamp", [time])
  await ethers.provider.send("evm_mine", [time]);
    // Next Time
  const blockNumAfter = await ethers.provider.getBlockNumber() 
  const blockAfter = await ethers.provider.getBlock(blockNumAfter) 
  const timestampAfter = blockAfter.timestamp 
  const NextDate = new Date(timestampAfter * 1000);
  console.log("\tSkipped Time : ",timestampAfter," - ",NextDate.toLocaleDateString("en-US"),"\n")
}

//- Mint
async function Mint(account:any) {
  try {
    TX_Global = await F8_Contract.connect(Owner).mintF8(account)
    Receipt = await TX_Global.wait()
    if (Receipt.status) {
      console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
      console.log("NFT Minted...\n")
      console.log("----------------------------------------------------------\n")
      totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
    }
  } catch (error) {
    console.log(error)
  }  
}

//- Transfer
async function Transfer(from:any, to:any, tokenId:any) {
  try {
    TX_Global = await F8_Contract.connect(Owner).transferFrom(from, to, tokenId)
    Receipt = await TX_Global.wait()
    if (Receipt.status) {
      console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
      console.log("NFT Transfered...\n")
      console.log("----------------------------------------------------------\n")
      totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
    }
  } catch (error) {
    console.log(error)
  }        
}

//- Insert Mission
async function InsertMission(missionName: any, missionAmount: any, rebornAmount: any, expiryDate: any) {
  try {
    TX_Global = await F8_Contract.connect(Owner).insertMission(missionName, missionAmount, rebornAmount, expiryDate)
    Receipt = await TX_Global.wait()
    if (Receipt.status) {
      console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
      console.log("Mission Inserted...\n")
      console.log("----------------------------------------------------------\n")
      totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
    }
  } catch (error) {
    console.log(error)
  }  
}

//- Claim Airdrop 
async function ClaimRewardAirdrop(missionId: any, tokenId: any) {
  try {
    TX_Global = await F8_Contract.connect(Owner).missionRewardClaim(missionId, tokenId)
    Receipt = await TX_Global.wait()
    if (Receipt.status) {
      console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
      console.log("Claim Rewared...\n")
      console.log("----------------------------------------------------------\n")
      totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
    }
  } catch (error) {
    console.log(error)
  }   
}

//- Buy Token on LP
async function buyToken(amount: any) {
  try {
    TX_Global = await Launcpad_Contract.connect(Owner).buyToken(amount)
    Receipt = await TX_Global.wait()
    if (Receipt.status) {
      console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
      console.log("Amount:",formatEther(amount),"ETH - Token Buyed...\n")
      console.log("----------------------------------------------------------\n")
      totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
    }
  } catch (error) {
    console.log(error)
  }  
}

describe("F8 NFT Test", function() {

  before(async () =>{
    [Owner, User1, User2] = await ethers.getSigners()    
    provider = ethers.provider
    console.log("Owner Address: ",Owner.address)    
    console.log("User1 Address: ",User1.address)    
    console.log("User2 Address: ",User2.address,"\n")    
  })
  
  it("Fake Launchpad Contract Deploy", async function () {
    //- Deploy
    Launcpad_Factory = await ethers.getContractFactory("Launchpad")
    Launcpad_Contract = await Launcpad_Factory.deploy()
    await Launcpad_Contract.deployed()
    TX_Global = Launcpad_Contract.deployTransaction
    Receipt = await TX_Global.wait()
    console.log("Launchpad Contract Deploy Address: ",Launcpad_Contract.address)
    console.log("Owner Address: ",Owner.address)
    console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
    console.log("----------------------------------------------------------\n")
    totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
  })  

  it("F8 Contract Deploy", async function () {
    //- Deploy
    F8_Factory = await ethers.getContractFactory("F8")
    F8_Contract = await F8_Factory.deploy("FEight","F8","https://playprovidence.io/nft/", Launcpad_Contract.address)
    await F8_Contract.deployed()
    TX_Global = F8_Contract.deployTransaction
    Receipt = await TX_Global.wait()
    console.log("F8 Contract Deploy Address: ",F8_Contract.address)
    console.log("Owner Address: ",Owner.address)
    console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
    console.log("----------------------------------------------------------\n")
    totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
  })


  it("Contract Base Variables Control", async function () {
    //- Name
    TX_Global = await F8_Contract.connect(Owner).name()
    console.log("F8 NFT Name: ",TX_Global)
    //- Symbol
    TX_Global = await F8_Contract.connect(Owner).symbol()
    console.log("F8 NFT Symbol: ",TX_Global)
    //- Total Supply
    TX_Global = await F8_Contract.totalSupply()
    console.log("Total Supply: ",TX_Global)    
  })


  it("NFT Mint", async function () {
    // Mint
    await Mint(Owner.address);
    await Mint(Owner.address);
    await Mint(User1.address);
    await Mint(Owner.address);
    await Mint(Owner.address);
    await Mint(User2.address);
    await Mint(User2.address);
    await Mint(User1.address);

    // Get Token URI
    TX_Global = await F8_Contract.connect(Owner).tokenURI(0)
    console.log("0 Token URI: ",TX_Global)
    
    // Balance Of 
    TX_Global = await F8_Contract.connect(Owner).balanceOf(Owner.address)
    console.log("Balance Of: ",parseInt(TX_Global))

    // Owner Of 
    TX_Global = await F8_Contract.connect(Owner).ownerOf(0)
    console.log("Owner Of: ",TX_Global)
    console.log("----------------------------------------------------------\n")    

    //- Get List
    TX_Global = await F8_Contract.connect(Owner).getList(Owner.address)
    console.log("Owner List:",TX_Global)

    TX_Global = await F8_Contract.connect(User1).getList(User1.address)
    console.log("User 1 List:",TX_Global)

    TX_Global = await F8_Contract.connect(User2).getList(User2.address)
    console.log("User 2 List:",TX_Global)

    //- Transfer
    await Transfer(Owner.address, User2.address, 1);

    //- Get List
    TX_Global = await F8_Contract.connect(Owner).getList(Owner.address)
    console.log("Owner List:",TX_Global)

    TX_Global = await F8_Contract.connect(User1).getList(User1.address)
    console.log("User 1 List:",TX_Global)

    TX_Global = await F8_Contract.connect(User2).getList(User2.address)
    console.log("User 2 List:",TX_Global)

    TX_Global = await F8_Contract.connect(Owner).balanceOf(Owner.address)
    console.log("Balance Of: ",parseInt(TX_Global))

    console.log("__________________________________________________________________\n") 
  })

  it("Mission", async function () {
    await InsertMission("Whitelist", 0, 0, 1764571897)
    await InsertMission("Airdrop", parseEther("1"), 0,1764571897)
    await InsertMission("Reborn", 0, parseEther("5"), 1764571897)
    // Get Mission
    TX_Global = await F8_Contract.connect(Owner).viewMission("0")
    console.log("Mission Details:",TX_Global,"\n")
    // Get Mission
    TX_Global = await F8_Contract.connect(Owner).viewMission("1")
    console.log("Mission Details:",TX_Global,"\n")    
    // Get Mission
    TX_Global = await F8_Contract.connect(Owner).viewMission("2")
    console.log("Mission Details:",TX_Global,"\n")    
  })

  it("Treasury", async function () {
    // Deposit 
    try {
      TX_Global = await F8_Contract.connect(Owner).depositReward({value: parseEther("10")})
      Receipt = await TX_Global.wait()
      if (Receipt.status) {
        console.log("TX: ",TX_Global.hash," - Gas: ",strDisplay(Receipt.gasUsed))
        console.log("Balance Deposited...\n")
        console.log("----------------------------------------------------------\n")
        totalGasUsed = totalGasUsed.add(Receipt.gasUsed)
      }
    } catch (error) {
      console.log(error)
    }    

    // Deposit View
    TX_Global = await F8_Contract.connect(Owner).viewDepositReward()
    console.log("Deposit Balance:",TX_Global,"\n")    

    // Claim Reward
    await ClaimRewardAirdrop(2,0)

    // Buy Token
    await buyToken(parseEther("4.01"));

    // Claim Reward
    await ClaimRewardAirdrop(2,0)

    // Deposit View
    TX_Global = await F8_Contract.connect(Owner).viewDepositReward()
    console.log("Deposit Balance:",TX_Global,"\n") 
    
    TX_Global = await F8_Contract.connect(Owner).missionStatus(Owner.address,1,0)
    console.log("Mission Status:",TX_Global)

    //- Get List
    TX_Global = await F8_Contract.connect(Owner).getList(Owner.address)
    console.log("Owner List:",TX_Global)

  })

  it("Total Gas", async function() {
    console.log("Total Gas: ",strDisplay(totalGasUsed))
  })

})
