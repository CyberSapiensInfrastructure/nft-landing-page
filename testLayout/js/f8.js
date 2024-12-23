"use strict";

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask Installed!');
} 
else
{
    console.log('MetaMask not installed, please install MetaMask!');	
	document.querySelector('#connect_wallet').innerHTML = "Install MetaMask";
	document.querySelector("#wallet_address").textContent = "Metamask is not installed, Please install.";
}

const connectwalletbutton = document.querySelector('#connect_wallet');

let provider
let Transactions
let TXWait = 1
let TX
let receipt

let f8address     = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d'			
let launchaddress = '0x5Da9f3af025808Ec69702Ee45cd315241432b2F6'

let f8Abi = [
	{
		"inputs": [
		  {
			"internalType": "string",
			"name": "name_",
			"type": "string"
		  },
		  {
			"internalType": "string",
			"name": "symbol_",
			"type": "string"
		  },
		  {
			"internalType": "string",
			"name": "baseUri_",
			"type": "string"
		  },
		  {
			"internalType": "address",
			"name": "intfLP",
			"type": "address"
		  }
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "sender",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  },
		  {
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  }
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "operator",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "approver",
			"type": "address"
		  }
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "operator",
			"type": "address"
		  }
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  }
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "receiver",
			"type": "address"
		  }
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "sender",
			"type": "address"
		  }
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  }
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "account",
			"type": "address"
		  }
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	  },
	  {
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	  },
	  {
		"inputs": [],
		"name": "noChange",
		"type": "error"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  },
		  {
			"indexed": true,
			"internalType": "address",
			"name": "approved",
			"type": "address"
		  },
		  {
			"indexed": true,
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "Approval",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  },
		  {
			"indexed": true,
			"internalType": "address",
			"name": "operator",
			"type": "address"
		  },
		  {
			"indexed": false,
			"internalType": "bool",
			"name": "approved",
			"type": "bool"
		  }
		],
		"name": "ApprovalForAll",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"internalType": "address",
			"name": "previousOwner",
			"type": "address"
		  },
		  {
			"indexed": true,
			"internalType": "address",
			"name": "newOwner",
			"type": "address"
		  }
		],
		"name": "OwnershipTransferred",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": true,
			"internalType": "address",
			"name": "from",
			"type": "address"
		  },
		  {
			"indexed": true,
			"internalType": "address",
			"name": "to",
			"type": "address"
		  },
		  {
			"indexed": true,
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "Transfer",
		"type": "event"
	  },
	  {
		"inputs": [],
		"name": "LP",
		"outputs": [
		  {
			"internalType": "contract ILaunchpad",
			"name": "",
			"type": "address"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "to",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  }
		],
		"name": "balanceOf",
		"outputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "depositReward",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "getApproved",
		"outputs": [
		  {
			"internalType": "address",
			"name": "",
			"type": "address"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "_address",
			"type": "address"
		  }
		],
		"name": "getList",
		"outputs": [
		  {
			"internalType": "uint256[]",
			"name": "",
			"type": "uint256[]"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "getMissionCounter",
		"outputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "string",
			"name": "_missionName",
			"type": "string"
		  },
		  {
			"internalType": "uint256",
			"name": "_missionAmount",
			"type": "uint256"
		  },
		  {
			"internalType": "uint256",
			"name": "_rebornAmount",
			"type": "uint256"
		  },
		  {
			"internalType": "uint256",
			"name": "_expiryDate",
			"type": "uint256"
		  }
		],
		"name": "insertMission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "owner",
			"type": "address"
		  },
		  {
			"internalType": "address",
			"name": "operator",
			"type": "address"
		  }
		],
		"name": "isApprovedForAll",
		"outputs": [
		  {
			"internalType": "bool",
			"name": "",
			"type": "bool"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "to",
			"type": "address"
		  }
		],
		"name": "mintF8",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "_missionId",
			"type": "uint256"
		  },
		  {
			"internalType": "uint256",
			"name": "_tokenId",
			"type": "uint256"
		  }
		],
		"name": "missionRewardClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "_account",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "_missionId",
			"type": "uint256"
		  },
		  {
			"internalType": "uint256",
			"name": "_tokenId",
			"type": "uint256"
		  }
		],
		"name": "missionStatus",
		"outputs": [
		  {
			"internalType": "bool",
			"name": "",
			"type": "bool"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "name",
		"outputs": [
		  {
			"internalType": "string",
			"name": "",
			"type": "string"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "owner",
		"outputs": [
		  {
			"internalType": "address",
			"name": "",
			"type": "address"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "ownerOf",
		"outputs": [
		  {
			"internalType": "address",
			"name": "",
			"type": "address"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "from",
			"type": "address"
		  },
		  {
			"internalType": "address",
			"name": "to",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "from",
			"type": "address"
		  },
		  {
			"internalType": "address",
			"name": "to",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  },
		  {
			"internalType": "bytes",
			"name": "data",
			"type": "bytes"
		  }
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "operator",
			"type": "address"
		  },
		  {
			"internalType": "bool",
			"name": "approved",
			"type": "bool"
		  }
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "string",
			"name": "_uri",
			"type": "string"
		  }
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "bytes4",
			"name": "interfaceId",
			"type": "bytes4"
		  }
		],
		"name": "supportsInterface",
		"outputs": [
		  {
			"internalType": "bool",
			"name": "",
			"type": "bool"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "symbol",
		"outputs": [
		  {
			"internalType": "string",
			"name": "",
			"type": "string"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "tokenURI",
		"outputs": [
		  {
			"internalType": "string",
			"name": "",
			"type": "string"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "from",
			"type": "address"
		  },
		  {
			"internalType": "address",
			"name": "to",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		  }
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "newOwner",
			"type": "address"
		  }
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "_missionId",
			"type": "uint256"
		  },
		  {
			"internalType": "string",
			"name": "_missionName",
			"type": "string"
		  },
		  {
			"internalType": "uint256",
			"name": "_missionAmount",
			"type": "uint256"
		  },
		  {
			"internalType": "uint256",
			"name": "_rebornAmount",
			"type": "uint256"
		  },
		  {
			"internalType": "bool",
			"name": "_isComplete",
			"type": "bool"
		  },
		  {
			"internalType": "uint256",
			"name": "_expiryDate",
			"type": "uint256"
		  }
		],
		"name": "updateMission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "viewDepositReward",
		"outputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "_missionId",
			"type": "uint256"
		  }
		],
		"name": "viewMission",
		"outputs": [
		  {
			"components": [
			  {
				"internalType": "string",
				"name": "missionName",
				"type": "string"
			  },
			  {
				"internalType": "uint256",
				"name": "missionAmount",
				"type": "uint256"
			  },
			  {
				"internalType": "uint256",
				"name": "rebornAmount",
				"type": "uint256"
			  },
			  {
				"internalType": "bool",
				"name": "isComplete",
				"type": "bool"
			  },
			  {
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			  }
			],
			"internalType": "struct F8Lib.F8Mission",
			"name": "",
			"type": "tuple"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "_to",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "_amount",
			"type": "uint256"
		  }
		],
		"name": "withdrawReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  }
]

let launchAbi = [
	{
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "_amount",
			"type": "uint256"
		  }
		],
		"name": "buyToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "_account",
			"type": "address"
		  }
		],
		"name": "buyTokenStatus",
		"outputs": [
		  {
			"internalType": "bool",
			"name": "",
			"type": "bool"
		  },
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  }
]

//- Load First Init
window.addEventListener('load', async () => { 
	init(); 
	connectwalletbutton.onclick = onConnect;
});

function init() {
	console.log("Initializing F8 NFT")
	console.log("Contract Address: ", f8address)
	document.getElementById('loader').style.display = 'none'

	//- Control Https Protocol
	/*
	if(location.protocol !== 'https:') {
	  const alert = document.querySelector("#https_error");
	  alert.style.display = "block";
	  location.replace("/");
	  document.querySelector('#https_error').innerHTML="HTTPS Not Found";
	  document.querySelector("#connectwallet").innerHTML="Blocked Connection";
	  document.querySelector("#connectwallet").setAttribute("disabled", "disabled")
	  return;
	}
	*/
}

//- Connect Wallet
async function onConnect() {
	try {
		provider = new ethers.providers.Web3Provider(window.ethereum,"any")
		document.querySelector('#connect_wallet').innerHTML = "Connected"
	} 
	catch(e) {
		console.log("Could not get a Wallet Connection", e);
		return;
	}
	provider.on("accountsChanged", (accounts) => { 
		console.log("Address: ",accounts[0])
		AccountData(); 
	});
  	provider.on("chainChanged", (chainId) => { 
		console.log("Chain: ",chainId)
		AccountData(); 
	});	  
    AccountData();
}

//- Disconnect Wallet
async function onDisconnect() {
	console.log("Disconnected the Wallet connection", provider);
	if ( provider.close ) {
	  await provider.close();
	  await web3Modal.clearCachedProvider();
	  provider = null;
	}
	document.querySelector("#wallet_address").textContent = "Not Connected";
}

async function AccountData() {
	await provider.send("eth_requestAccounts", [])
	const signer = provider.getSigner()
    
	//- User Address
	const userAddress = await signer.getAddress()
	console.log("User Address: ", userAddress)
    document.querySelector("#wallet_address").textContent = userAddress
	document.querySelector("#status_label").textContent = "Connected"
	
	//- Areken Contract
    const f8Contract = new ethers.Contract(f8address, f8Abi, signer)
	const launchContract = new ethers.Contract(launchaddress, launchAbi, signer)

	//- Chain Id
	const chainId = await provider.getNetwork();
	console.log("ChainID: ",chainId);

//- Get Name
	await f8Contract.symbol().then((result) => {
		if (result !== "") {
			document.querySelector("#nft_symbol").textContent = 'Symbol: '+result
			console.log("Symbol: ", result); 
		} else {
			document.querySelector("#nft_symbol").textContent = "Error"
		}
	},(error) => {
		//let errstr = error.error.message.replace('execution reverted:','Error : ')
		console.log(error)
		SnackAlert(error)		
	})

//- Get Symbol
	await f8Contract.name().then((result) => {
		if (result !== "") {
			document.querySelector("#nft_name").textContent = 'Name: '+result
			console.log("Name: ", result); 
		} else {
			document.querySelector("#nft_name").textContent = "Error"
		}
	},(error) => {
		let errstr = error.error.message.replace('execution reverted:','Error : ')
		console.log(errstr)
		SnackAlert(errstr)		
	})

//- Total Supply
	await f8Contract.totalSupply().then((result) => {
		if (result !== "") {
			console.log("Total Supply: ", parseInt(result.toString()))
		}
	}, (error) => {
		let errstr = error.error.message.replace('execution reverted:','Error : ')
		console.log(errstr)
		SnackAlert(errstr)		
	})

//- Mint
	async function MintToken() {
		try {
			let acccountAddr = document.getElementById('account_addr').value;
			TX = await f8Contract.mintF8(acccountAddr)
			document.getElementById('loader').style.display='block'
			receipt = await TX.wait(TXWait)
			if (receipt.status) {
				console.log("Receipt: ",receipt)
				console.log("Gas Use: ",ethers.BigNumber.from(receipt.gasUsed))
				var link = `Transaction Receipt Link : http://http://37.27.176.234:3000/tx/${receipt.transactionHash}\n`			
				console.log(link)
				document.getElementById('loader').style.display='none'
				SnackAlert("Mint F8 NFT ")
			}
		} catch (error) {
			//let errstr = error.data.message.replace('execution reverted:','Error : ')
			console.log("Error: ", error)
			SnackAlert(error)		
		}
	}
	var MintButton = document.getElementById("token_mint")
	MintButton.onclick = MintToken

/*
//- SetBasee URI
async function setBaseURI() {
	try {
		let baseURI = document.getElementById('token_id').value;
		TX = await f8Contract.setBaseURI(baseURI)
		document.getElementById('loader').style.display='block'
		receipt = await TX.wait(TXWait)
		if (receipt.status) {
			console.log("Receipt: ",receipt)
			console.log("Gas Use: ",ethers.BigNumber.from(receipt.gasUsed))
			var link = `Transaction Receipt Link : http://http://37.27.176.234:3000/tx/${receipt.transactionHash}\n`			
			console.log(link)
			document.getElementById('loader').style.display='none'
			SnackAlert("Base URI Updated")
		}
	} catch (error) {
		//let errstr = error.data.message.replace('execution reverted:','Error : ')
		console.log("Error: ", error)
		SnackAlert(error)		
	}
}
var MintButton = document.getElementById("token_mint")
MintButton.onclick = setBaseURI
*/

//- Get URI
    async function GetTokenURI() {
		const _tokenId = document.getElementById('token_id').value;
		console.log("TokenID: ",_tokenId);
		await f8Contract.tokenURI(_tokenId).then((result) => {		
			document.getElementById('providence_info').textContent = result+".json \n\n" 
			result = result+".json"
			console.log("Metadata File Name : ",result)
			$.getJSON(result, function(data) {
				var feature = `Token ID: ${data.tokenid} Description: ${data.description}`
				var text = 
				`Token ID: ${data.tokenid} \n
				Description: ${data.description} `
				for (var i=0; i<data.attributes.length; i++) {
					text += `${data.attributes[i].trait_type} : ${data.attributes[i].value} \n`
					feature += `${data.attributes[i].trait_type} : ${data.attributes[i].value}`
				} 
				var link = `<abbr title="${feature}"><image src="${data.image}" width="560" height="560"></abbr>`
				console.log("Link: ", link)	
				document.getElementById('providence_info').textContent += text
				$('#nft_image').html(link)
			})
		}, (error) => {
			let errstr = error.error.message.replace('execution reverted:','Error : ')
			console.log(errstr)
			SnackAlert(errstr)			
		})
    }
    var TokenUriButton = document.getElementById("token_uri");
    TokenUriButton.onclick = GetTokenURI;

//- Token Lists
	let text;
	async function _myTokenList(token_id) {
		await f8Contract.tokenURI(token_id).then((result) => {
			console.log(token_id,".NFT: ",result); 
			document.getElementById('providence_info').textContent += result+".json" 
			document.getElementById('providence_info').textContent += "\n______________________\n"
			//- Json Contents
			$.getJSON(result+".json", function(data) {
				console.log("data:",data)
				var feature = `Token ID: ${data.tokenid} Description: ${data.description}`
				var text = 
				`Token ID: ${data.tokenid} Description: ${data.description} `
				for (var i=0; i<data.attributes.length; i++) {
					text += `${data.attributes[i].trait_type} : ${data.attributes[i].value}\n`
					feature += `${data.attributes[i].trait_type} : ${data.attributes[i].value}`
				} 				
				document.getElementById('providence_info').textContent += "\n\t"+text
			})

		}, (error) => {
			let errstr = error.data.message.replace('execution reverted:','Error : ')
			console.log(errstr)
			SnackAlert(errstr)			
		})
	}
	async function MyTokenList() {
		text = " ";
		text += '<table style="width: 100%;"> ';
		text += '<tr> <td style="padding: 2px !important;">';	
		document.getElementById('providence_info').textContent = ""

		console.log("User Address: ", userAddress)

		await f8Contract.getList(userAddress).then((result) => {
			console.log("List: ", result);
			var count = Object.keys(result).length;
			console.log("My F8 NFT Count:", count);
			for (let i=0; i < count; i++) {
				console.log("Token ID:", result[i].toString());
				_myTokenList(result[i].toString());
				text += '<p style="text-align: center;" class="fon_standart">Token ID: <b>'+result[i]+'</b></p>'
			}
			document.getElementById("time_line").innerHTML=text += '</td> </tr> </table>'
		}, (error) => {
			let errstr = error.data.message.replace('execution reverted:','Error : ')
			console.log(errstr)
			SnackAlert(errstr)	
		})
	}
	var carbonListButton = document.getElementById("my_token");
	carbonListButton.onclick = MyTokenList


//- Get Redeem Code
	async function RedeemCode() {
		const _tokenId = document.getElementById('redeem_token_id').value;
		await f8Contract.getRedeemCode(_tokenId).then((result) => {
			console.log("Return Value: ", result); 
			if (result !== "") {
				document.querySelector("#show_redeem_code").textContent = result
			} else {
				document.querySelector("#show_redeem_code").textContent = "Error"
			}
		},(error) => {
			let errstr = error.data.message.replace('execution reverted:','Error : ')
			document.querySelector("#show_redeem_code").textContent = errstr
			console.log("ERR:",errstr)
			SnackAlert(errstr)		
		})		
	}
	var RedeemCodeButton = document.getElementById("redeem_code")
	RedeemCodeButton.onclick = RedeemCode

//- Add Signature
	async function AddSignature() {
		try {
			const _starTime = 1701378000 
			const _endTime = 1833000400000 
			let _to = document.getElementById('to_address').value
			console.log("To: ", _to)
            let _tokenId = document.getElementById('to_token_id').value
			console.log("Token: ",_tokenId)

            const ABI = ["function transferFrom(address,address,uint256)"]
            let intFace = new ethers.utils.Interface(ABI);
            let data = intFace.encodeFunctionData("transferFrom",[launchaddress, _to, _tokenId])			
			let decodedata = intFace.decodeFunctionData("transferFrom", data);
			console.log("Decode:", decodedata)

			TX = await launchContract.addSignature(f8address, _starTime, _endTime, 2, 0, 0, data)
			document.getElementById('loader').style.display='block'
			receipt = await TX.wait(TXWait)
			if (receipt.status) {
				console.log("Receipt: ",receipt)
				console.log("Gas Use: ",ethers.BigNumber.from(receipt.gasUsed))
				var link = `Transaction Receipt Link : https://testnet.snowtrace.io/tx/${receipt.transactionHash}\n`			
				console.log(link)
				document.getElementById('loader').style.display='none'
				SnackAlert("Add Signature")
			}
		} catch (error) {
			//R let errstr = error.data.message.replace('execution reverted:','Error : ')
			let errstr = error.error.message.replace('execution reverted:','Error : ')
			console.log("Error: ", errstr)
			SnackAlert(errstr)		
		}
	}
	var AddSignatureButton = document.getElementById("add_signature")
	AddSignatureButton.onclick = AddSignature


//- View Signature
	async function ViewSignature() {
		/*let blockTimestamp = (await provider.getBlock('latest')).timestamp;
		console.log("Time:", blockTimestamp)
		let _starTime = parseInt((Date.now() / 1000)).toFixed(0)
		console.log("Start:", _starTime)*/

		let countSignature
		await launchContract.countSignature().then((result) => {
			countSignature = result
		})		
		let text = ""
		for (let i=0; i < countSignature; i++) {
			await launchContract.viewSignature(i).then((result) => {
				console.log("Return Value: ", result); 
				if (result !== "") {
					const obj = JSON.stringify(result)
					const objParse = JSON.parse(obj)
					text += "# Signature No: "+i+"\n"
					var _startTime = new Date(parseInt(objParse[2].hex.toString()))
					var _expirationTime = new Date(parseInt(objParse[3].hex.toString()))
					text += "StartTime: "+_startTime+"\n"
					text += "ExpirationTime: "+_expirationTime+"\n" //.toLocaleDateString("en-GB")
					text += "ValidatorCount :"+parseInt(objParse[4].hex.toString())+"\n"
					text += "ConfirmedCount: "+parseInt(objParse[5].hex.toString())+"\n"
					text += "Executed: "+objParse[10]+"\n"
					
					if (Date.now() < parseInt(objParse[2].hex.toString())) {
						text += "Signature has not started yet!\n\n" 
					} else
					if (Date.now() > parseInt(objParse[3].hex.toString())) {
						text += "Signature Timeout!\n\n"					
					} else text += "\n"
					document.getElementById('providence_info').textContent = text
				} else {
					document.querySelector("#show_redeem_code").textContent = "Error"
				}
			},(error) => {
				let errstr = error.data.message.replace('execution reverted:','Error : ')
				document.querySelector("#show_redeem_code").textContent = errstr
				console.log("ERR:",errstr)
				SnackAlert(errstr)		
			})				
		}
	}
	var ViewSignatureButton = document.getElementById("view_signature")
	ViewSignatureButton.onclick = ViewSignature

//- Execute Signature
	async function ExecuteSignature() {
		try {
			let _signId = document.getElementById('exec_sign_id').value
			console.log("TXId: ", _signId)
			TX = await launchContract.executeSignature(_signId)
			document.getElementById('loader').style.display='block'
			receipt = await TX.wait(TXWait)
			if (receipt.status) {
				console.log("Receipt: ",receipt)
				console.log("Gas Use: ",ethers.BigNumber.from(receipt.gasUsed))
				var link = `Transaction Receipt Link : https://testnet.snowtrace.io/tx/${receipt.transactionHash}\n`			
				console.log(link)
				document.getElementById('loader').style.display='none'
				SnackAlert("Exec Signature No:",_signId)
			}
		} catch (error) {
			let errstr = error.data.message.replace('execution reverted:','Error : ')
			console.log("Error: ", errstr)
			SnackAlert(errstr)		
		}
	}
	var ExecuteSignatureButton = document.getElementById("exec_signature")
	ExecuteSignatureButton.onclick = ExecuteSignature

	//- Snack Alert's	
	function SnackAlert(alertstr) {
		var toastalert = document.getElementById("snackbar");
		toastalert.className = "show";
		toastalert.textContent = alertstr; 
		setTimeout( function() { toastalert.className = toastalert.className.replace("show", ""); }, 5000);
	  }  	
};