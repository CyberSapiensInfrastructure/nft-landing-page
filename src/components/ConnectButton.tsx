import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import CornerDots from "./CornerDots";
import Button from "./Button";

const ConnectButton: React.FC = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useWeb3ModalAccount();

  return (
    <>
      {isConnected ? (
        <w3m-account-button />
      ) : (
        <Button size="md" onClick={() => open()}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default ConnectButton;
