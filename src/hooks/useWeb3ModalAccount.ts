import { useWeb3ModalAccount as useW3MAccount } from "@web3modal/ethers5/react";

export const useWeb3ModalAccount = () => {
  const account = useW3MAccount();
  return account;
}; 