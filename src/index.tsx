import {
    customElements,
    ControlElement,
    customModule,
    Module,
    Styles,
    Modal,
    GridLayout,
    HStack,
    Panel,
    Container,
} from '@ijstech/components'
import customStyles, { modalStyles } from './index.css'
import { INetwork } from '@ijstech/eth-wallet'
import translations from './translations.json';
import { INetworkConfig, INetworkModalData } from './interfaces';
import { Model } from './model';
export { INetworkConfig, INetworkModalData };

interface ScomNetworkModalElement extends ControlElement {
    rpcWalletId: string;
    networks?: INetworkConfig[] | '*';
    selectedChainId?: number;
    switchNetworkOnSelect?: boolean;
    onCustomNetworkSelected?: (network: INetwork) => void;
}
const Theme = Styles.Theme.ThemeVars

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-network-modal']: ScomNetworkModalElement
        }
    }
}

@customModule
@customElements('i-scom-network-modal')
export default class ScomNetworkModal extends Module {
    private model: Model;
    private mdNetwork: Modal
    private gridNetworkGroup: GridLayout
    private pnlNetwork: Panel
    private networkMapper: Map<number, HStack>
    private _selectedNetwork: INetwork | undefined
    private _switchNetworkOnSelect: boolean
    private _onCustomNetworkSelected: (network: INetwork) => void;
    public onChanged: (network: INetwork) => void;

    constructor(parent?: Container, options?: any) {
        super(parent, options)
        this.model = new Model();
    }

    get selectedNetwork() {
        return this._selectedNetwork
    }

    get networkList() {
        return this.model.networkList;
    }

    set networkList(value: INetwork[]) {
        this.model.networkList = value;
    }

    set networks(value: INetworkConfig[]) {
        this.model.setNetworkList(value);
        this.renderNetworks();
    }

    get rpcWalletId() {
        return this.model.rpcWalletId;
    }

    set rpcWalletId(value: string) {
        this.model.rpcWalletId = value;
    }

    showModal() {
        this.mdNetwork.visible = true;
    }

    hideModal() {
        this.mdNetwork.visible = false;
    }

    setNetworkByChainId(chainId: number) {
        const network = this.getNetwork(chainId)
        if (network) this.setNetwork(network)
    }

    clearNetwork() {
        this._selectedNetwork = undefined
        this.networkMapper.forEach((value, key) => {
            value.classList.remove('is-active')
        });
    }

    private getNetwork(chainId: number) {
        return this.model.getNetwork(chainId) || null
    }


    private setNetwork(network: INetwork) {
        this._selectedNetwork = network;
        const chainId = this._selectedNetwork?.chainId
        this.networkMapper?.forEach((value, key) => {
            if (key === chainId) {
                value.classList.add('is-active')
            }
            else {
                value.classList.remove('is-active')
            }
        });
    }

    private async onNetworkSelected(network: INetwork) {
        this.setNetwork(network);
        this.mdNetwork.visible = false
        if (this._switchNetworkOnSelect)
            await this.model.switchNetwork(network.chainId)
        this._onCustomNetworkSelected && this._onCustomNetworkSelected(network);
        if (this.onChanged) {
            this.onChanged(network);
        }
    }

    private isNetworkActive(chainId: number) {
        const walletChainId = this.model.getRpcWallet()?.chainId;
        return walletChainId === chainId;
    }

    private renderNetworks() {
        this.gridNetworkGroup.clearInnerHTML()
        this.networkMapper = new Map();
        const networkList = this.model.networkList;
        this.gridNetworkGroup.append(
            ...networkList.map((network) => {
                const img = network.image ? (
                    <i-image
                        url={network.image}
                        width={34}
                        height={34}
                    />
                ) : (
                    []
                )
                const isActive = this.isNetworkActive(network.chainId)
                const hsNetwork = (
                    <i-hstack
                        onClick={() => this.onNetworkSelected(network)}
                        background={{ color: Theme.colors.secondary.light }}
                        border={{ radius: 10 }}
                        position="relative"
                        class={isActive ? 'is-active list-item' : 'list-item'}
                        padding={{ top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' }}
                    >
                        <i-hstack margin={{ left: '1rem' }} verticalAlignment="center" gap={12}>
                            {img}
                            <i-label caption={network.chainName} wordBreak="break-word" font={{ size: '.875rem', bold: true, color: Theme.colors.secondary.contrastText }} />
                        </i-hstack>
                    </i-hstack>
                )
                this.networkMapper.set(network.chainId, hsNetwork)
                return hsNetwork
            })
        )
    }

    private renderUI() {
        this.renderNetworks()
    }

    async setData(data: INetworkModalData) {
        if (data.rpcWalletId) this.model.rpcWalletId = data.rpcWalletId;
        if (data.networks) this.networks = data.networks;
        if (data.selectedChainId) this.setNetworkByChainId(data.selectedChainId);
        if (data.switchNetworkOnSelect) this._switchNetworkOnSelect = data.switchNetworkOnSelect;
        if (data.onCustomNetworkSelected) this._onCustomNetworkSelected = data.onCustomNetworkSelected;
    }

    async init() {
        this.i18n.init({ ...translations })
        await super.init();
        const networksAttr = this.getAttribute('networks', true);
        if (networksAttr) this.model.setNetworkList(networksAttr);
        const selectedChainId = this.getAttribute('selectedChainId', true);
        if (selectedChainId) this.setNetworkByChainId(selectedChainId);
        this._switchNetworkOnSelect = this.getAttribute('switchNetworkOnSelect', true, false);
        this._onCustomNetworkSelected = this.getAttribute('onCustomNetworkSelected', true);
        const rpcWalletId = this.getAttribute('rpcWalletId', true);
        if (rpcWalletId) this.model.rpcWalletId = rpcWalletId;
        this.renderUI();
    }
    render() {
        return (
            <i-panel id='pnlNetwork' width='100%' class={customStyles}>
                <i-modal
                    id='mdNetwork'
                    title='$supported_networks'
                    class={modalStyles}
                    width={440}
                    closeIcon={{ name: 'times' }}
                    border={{ radius: 10 }}
                >
                    <i-vstack
                        height='100%' lineHeight={1.5}
                        padding={{ left: '1rem', right: '1rem', bottom: '2rem' }}
                    >
                        <i-label
                            id='lblNetworkDesc'
                            margin={{ top: '1rem' }}
                            font={{ size: '.875rem' }}
                            wordBreak="break-word"
                            caption='$we_support_the_following_networks_please_click_to_connect'
                        ></i-label>
                        <i-hstack
                            margin={{ left: '-1.25rem', right: '-1.25rem' }}
                            height='100%'
                        >
                            <i-grid-layout
                                id='gridNetworkGroup'
                                font={{ color: '#f05e61' }}
                                height="calc(100% - 160px)"
                                width="100%"
                                overflow={{ y: 'auto' }}
                                margin={{ top: '1.5rem' }}
                                padding={{ left: '1.25rem', right: '1.25rem' }}
                                columnsPerRow={1}
                                templateRows={['max-content']}
                                class='list-view'
                                gap={{ row: '0.5rem' }}
                            ></i-grid-layout>
                        </i-hstack>
                    </i-vstack>
                </i-modal>
            </i-panel>
        )
    }
}
