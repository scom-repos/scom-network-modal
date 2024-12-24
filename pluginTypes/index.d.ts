/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <amd-module name="@scom/scom-network-modal/index.css.ts" />
declare module "@scom/scom-network-modal/index.css.ts" {
    const _default: string;
    export default _default;
    export const modalStyles: string;
}
/// <amd-module name="@scom/scom-network-modal/translations.json.ts" />
declare module "@scom/scom-network-modal/translations.json.ts" {
    const _default_1: {
        en: {
            select_network: string;
            supported_networks: string;
            we_support_the_following_networks_please_click_to_connect: string;
        };
        "zh-hant": {
            select_network: string;
            supported_networks: string;
            we_support_the_following_networks_please_click_to_connect: string;
        };
        vi: {
            select_network: string;
            supported_networks: string;
            we_support_the_following_networks_please_click_to_connect: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-network-modal/interfaces.ts" />
declare module "@scom/scom-network-modal/interfaces.ts" {
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
}
/// <amd-module name="@scom/scom-network-modal/model.ts" />
declare module "@scom/scom-network-modal/model.ts" {
    import { INetwork } from "@ijstech/eth-wallet";
    import { INetworkConfig } from "@scom/scom-network-modal/interfaces.ts";
    export class Model {
        private networkMap;
        private _rpcWalletId;
        get rpcWalletId(): string;
        set rpcWalletId(rpcWalletId: string);
        get networkList(): INetwork[];
        set networkList(networkList: INetwork[]);
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        getNetwork(chainId: number): INetwork;
        setNetworkList(networkList: INetworkConfig[], infuraId?: string): void;
        switchNetwork(chainId: number): Promise<void>;
    }
}
/// <amd-module name="@scom/scom-network-modal" />
declare module "@scom/scom-network-modal" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { INetwork } from '@ijstech/eth-wallet';
    import { INetworkConfig, INetworkModalData } from "@scom/scom-network-modal/interfaces.ts";
    export { INetworkConfig, INetworkModalData };
    interface ScomNetworkModalElement extends ControlElement {
        rpcWalletId: string;
        networks?: INetworkConfig[] | '*';
        selectedChainId?: number;
        switchNetworkOnSelect?: boolean;
        onCustomNetworkSelected?: (network: INetwork) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-network-modal']: ScomNetworkModalElement;
            }
        }
    }
    export default class ScomNetworkModal extends Module {
        private model;
        private mdNetwork;
        private gridNetworkGroup;
        private pnlNetwork;
        private networkMapper;
        private _selectedNetwork;
        private _switchNetworkOnSelect;
        private _onCustomNetworkSelected;
        onChanged: (network: INetwork) => void;
        constructor(parent?: Container, options?: any);
        get selectedNetwork(): INetwork;
        get networkList(): INetwork[];
        set networkList(value: INetwork[]);
        set networks(value: INetworkConfig[]);
        get rpcWalletId(): string;
        set rpcWalletId(value: string);
        showModal(): void;
        hideModal(): void;
        setNetworkByChainId(chainId: number): void;
        clearNetwork(): void;
        private getNetwork;
        private setNetwork;
        private onNetworkSelected;
        private isNetworkActive;
        private renderNetworks;
        private renderUI;
        setData(data: INetworkModalData): Promise<void>;
        init(): Promise<void>;
        render(): any;
    }
}
