import { ethers } from 'ethers';
import { globalProvider, getSigner } from '../main';

export const testConnection = async () => {
    try {
        // Test 1: Get Network
        const network = await globalProvider.getNetwork();
        console.log('Network Connection:', {
            chainId: network.chainId,
            name: network.name
        });

        // Test 2: Get Block Number
        const blockNumber = await globalProvider.getBlockNumber();
        console.log('Current Block Number:', blockNumber);

        // Test 3: Get Gas Price
        const gasPrice = await globalProvider.getGasPrice();
        console.log('Current Gas Price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

        return true;
    } catch (error) {
        console.error('Connection Test Failed:', error);
        return false;
    }
};

// Test wallet connection
export const testWalletConnection = async () => {
    try {
        const signer = await getSigner();
        if (signer) {
            const address = await signer.getAddress();
            const balance = await signer.getBalance();
            console.log('Wallet Connected:', {
                address,
                balance: ethers.utils.formatEther(balance)
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Wallet Connection Test Failed:', error);
        return false;
    }
}; 