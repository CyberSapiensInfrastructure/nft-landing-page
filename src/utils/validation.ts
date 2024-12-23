import { ethers } from 'ethers';

export const validateEthereumAddress = (address: string): string | null => {
  if (!address) return "Address is required";
  if (address === "0x0000000000000000000000000000000000000000") return "Cannot use zero address";
  try {
    ethers.utils.getAddress(address);
    return null;
  } catch {
    return "Invalid Ethereum address format";
  }
};

export const handleError = (error: any): string => {
  // Check if it's a MetaMask error
  if (error?.code) {
    switch (error.code) {
      case 4001:
        return "Transaction rejected by user";
      case -32603:
        if (error.message.includes("insufficient funds")) {
          return "Insufficient funds to complete transaction";
        }
        break;
      case "ACTION_REJECTED":
        return "Transaction rejected by user";
    }
  }

  // Check for specific error messages
  const errorMessage = error?.message || error?.error?.message || error?.data?.message || "";
  if (errorMessage.toLowerCase().includes("user denied")) {
    return "Transaction rejected by user";
  }
  if (errorMessage.toLowerCase().includes("insufficient funds")) {
    return "Insufficient funds to complete transaction";
  }
  if (errorMessage.toLowerCase().includes("nonce too high")) {
    return "Please reset your MetaMask account";
  }
  if (errorMessage.toLowerCase().includes("already minted")) {
    return "This NFT has already been minted";
  }
  if (errorMessage.toLowerCase().includes("not owner")) {
    return "You don't have permission to perform this action";
  }
  if (errorMessage.toLowerCase().includes("gas")) {
    return "Gas estimation failed. The transaction might fail";
  }

  // Return cleaned error message or default
  return errorMessage.replace("execution reverted:", "").trim() || "An unexpected error occurred";
}; 