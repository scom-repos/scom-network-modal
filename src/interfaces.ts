import { INetwork } from "@ijstech/eth-wallet";

export interface INetworkConfig {
    chainId: number;
    chainName?: string;
}

export interface INetworkModalData {
    rpcWalletId?: string;
    networks?: INetworkConfig[];
    selectedChainId?: number;
    switchNetworkOnSelect?: boolean;
    onCustomNetworkSelected?: (network: INetwork) => void;
}