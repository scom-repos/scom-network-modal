import { INetwork, Wallet } from "@ijstech/eth-wallet";
import { INetworkConfig } from "./interfaces";
import getNetworkList from '@scom/scom-network-list';

export class Model {
    private networkMap: { [key: number]: INetwork } = {};
    private _rpcWalletId: string;

    get rpcWalletId() {
        return this._rpcWalletId;
    }

    set rpcWalletId(rpcWalletId: string) {
        this._rpcWalletId = rpcWalletId;
    }

    get networkList() {
        return Object.values(this.networkMap);
    }

    set networkList(networkList: INetwork[]) {
        this.networkMap = networkList.reduce((acc, cur) => {
            acc[cur.chainId] = cur;
            return acc;
        }, {});
    }

    getRpcWallet() {
        return Wallet.getRpcWalletInstance(this._rpcWalletId);
    }

    getNetwork(chainId: number) {
        return this.networkMap[chainId];
    }

    setNetworkList(networkList: INetworkConfig[], infuraId?: string) {
        this.networkMap = {};
        const defaultNetworkList = getNetworkList();
        const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
            acc[cur.chainId] = cur;
            return acc;
        }, {});
        for (let network of networkList) {
            const networkInfo = defaultNetworkMap[network.chainId];
            if (!networkInfo) continue;
            if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                    networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
                }
            }
            this.networkMap[network.chainId] = {
                ...networkInfo,
                ...network
            };
        }
    }

    async switchNetwork(chainId: number) {
        const rpcWallet = this.getRpcWallet();
        await rpcWallet.switchNetwork(chainId);
    }
}