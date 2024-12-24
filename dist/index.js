var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-network-modal/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.modalStyles = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.default = components_1.Styles.style({
        $nest: {
            '::-webkit-scrollbar-track': {
                borderRadius: '12px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: 'unset'
            },
            '::-webkit-scrollbar-thumb': {
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.5) 0% 0% no-repeat padding-box'
            }
        }
    });
    exports.modalStyles = components_1.Styles.style({
        boxSizing: 'border-box',
        $nest: {
            '.i-modal_header': {
                borderRadius: '10px 10px 0 0',
                background: 'unset',
                borderBottom: `2px solid ${Theme.divider}`,
                padding: '1rem',
                fontWeight: 700,
                fontSize: '1rem'
            },
            '.list-view': {
                $nest: {
                    '.list-item': {
                        cursor: 'pointer',
                        $nest: {
                            '&.disabled-network-selection': {
                                cursor: 'default',
                                $nest: {
                                    '&:hover > *': {
                                        opacity: '0.5 !important',
                                    }
                                }
                            },
                            '> *': {
                                opacity: .5
                            }
                        }
                    },
                    '.list-item.is-active': {
                        $nest: {
                            '> *': {
                                opacity: 1
                            },
                            '&:after': {
                                content: "''",
                                top: '50%',
                                left: 12,
                                position: 'absolute',
                                background: '#20bf55',
                                borderRadius: '50%',
                                width: 10,
                                height: 10,
                                transform: 'translate3d(-50%,-50%,0)'
                            }
                        }
                    }
                }
            },
            '&> div': {
                transform: 'scale(1)'
            }
        }
    });
});
define("@scom/scom-network-modal/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-network-modal/translations.json.ts'/> 
    exports.default = {
        "en": {
            "select_network": "Select Network",
            "supported_networks": "Supported Networks",
            "we_support_the_following_networks_please_click_to_connect": "We support the following networks, please click to connect."
        },
        "zh-hant": {
            "select_network": "選擇網絡",
            "supported_networks": "支持的網絡",
            "we_support_the_following_networks_please_click_to_connect": "我們支持以下網絡，請點擊連接。"
        },
        "vi": {
            "select_network": "Chọn Mạng",
            "supported_networks": "Các mạng được hỗ trợ",
            "we_support_the_following_networks_please_click_to_connect": "Chúng tôi hỗ trợ các mạng sau, vui lòng nhấp vào để kết nối."
        }
    };
});
define("@scom/scom-network-modal/interfaces.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-network-modal/model.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-network-list"], function (require, exports, eth_wallet_1, scom_network_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor() {
            this.networkMap = {};
        }
        get rpcWalletId() {
            return this._rpcWalletId;
        }
        set rpcWalletId(rpcWalletId) {
            this._rpcWalletId = rpcWalletId;
        }
        get networkList() {
            return Object.values(this.networkMap);
        }
        set networkList(networkList) {
            this.networkMap = networkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
        }
        getRpcWallet() {
            return eth_wallet_1.Wallet.getRpcWalletInstance(this._rpcWalletId);
        }
        getNetwork(chainId) {
            return this.networkMap[chainId];
        }
        setNetworkList(networkList, infuraId) {
            this.networkMap = {};
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                if (!networkInfo)
                    continue;
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
        async switchNetwork(chainId) {
            const rpcWallet = this.getRpcWallet();
            await rpcWallet.switchNetwork(chainId);
        }
    }
    exports.Model = Model;
});
define("@scom/scom-network-modal", ["require", "exports", "@ijstech/components", "@scom/scom-network-modal/index.css.ts", "@scom/scom-network-modal/translations.json.ts", "@scom/scom-network-modal/model.ts"], function (require, exports, components_2, index_css_1, translations_json_1, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomNetworkModal = class ScomNetworkModal extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.model = new model_1.Model();
        }
        get selectedNetwork() {
            return this._selectedNetwork;
        }
        get networkList() {
            return this.model.networkList;
        }
        set networkList(value) {
            this.model.networkList = value;
        }
        set networks(value) {
            this.model.setNetworkList(value);
            this.renderNetworks();
        }
        get rpcWalletId() {
            return this.model.rpcWalletId;
        }
        set rpcWalletId(value) {
            this.model.rpcWalletId = value;
        }
        showModal() {
            this.mdNetwork.visible = true;
        }
        hideModal() {
            this.mdNetwork.visible = false;
        }
        setNetworkByChainId(chainId) {
            const network = this.getNetwork(chainId);
            if (network)
                this.setNetwork(network);
        }
        clearNetwork() {
            this._selectedNetwork = undefined;
            this.networkMapper.forEach((value, key) => {
                value.classList.remove('is-active');
            });
        }
        getNetwork(chainId) {
            return this.model.getNetwork(chainId) || null;
        }
        setNetwork(network) {
            this._selectedNetwork = network;
            const chainId = this._selectedNetwork?.chainId;
            this.networkMapper?.forEach((value, key) => {
                if (key === chainId) {
                    value.classList.add('is-active');
                }
                else {
                    value.classList.remove('is-active');
                }
            });
        }
        async onNetworkSelected(network) {
            this.setNetwork(network);
            this.mdNetwork.visible = false;
            if (this._switchNetworkOnSelect)
                await this.model.switchNetwork(network.chainId);
            this._onCustomNetworkSelected && this._onCustomNetworkSelected(network);
            if (this.onChanged) {
                this.onChanged(network);
            }
        }
        isNetworkActive(chainId) {
            const walletChainId = this.model.getRpcWallet()?.chainId;
            return walletChainId === chainId;
        }
        renderNetworks() {
            this.gridNetworkGroup.clearInnerHTML();
            this.networkMapper = new Map();
            const networkList = this.model.networkList;
            this.gridNetworkGroup.append(...networkList.map((network) => {
                const img = network.image ? (this.$render("i-image", { url: network.image, width: 34, height: 34 })) : ([]);
                const isActive = this.isNetworkActive(network.chainId);
                const hsNetwork = (this.$render("i-hstack", { onClick: () => this.onNetworkSelected(network), background: { color: Theme.colors.secondary.light }, border: { radius: 10 }, position: "relative", class: isActive ? 'is-active list-item' : 'list-item', padding: { top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' } },
                    this.$render("i-hstack", { margin: { left: '1rem' }, verticalAlignment: "center", gap: 12 },
                        img,
                        this.$render("i-label", { caption: network.chainName, wordBreak: "break-word", font: { size: '.875rem', bold: true, color: Theme.colors.secondary.contrastText } }))));
                this.networkMapper.set(network.chainId, hsNetwork);
                return hsNetwork;
            }));
        }
        renderUI() {
            this.renderNetworks();
        }
        async setData(data) {
            if (data.rpcWalletId)
                this.model.rpcWalletId = data.rpcWalletId;
            if (data.networks)
                this.networks = data.networks;
            if (data.selectedChainId)
                this.setNetworkByChainId(data.selectedChainId);
            if (data.switchNetworkOnSelect)
                this._switchNetworkOnSelect = data.switchNetworkOnSelect;
            if (data.onCustomNetworkSelected)
                this._onCustomNetworkSelected = data.onCustomNetworkSelected;
        }
        async init() {
            this.i18n.init({ ...translations_json_1.default });
            await super.init();
            const networksAttr = this.getAttribute('networks', true);
            if (networksAttr)
                this.model.setNetworkList(networksAttr);
            const selectedChainId = this.getAttribute('selectedChainId', true);
            if (selectedChainId)
                this.setNetworkByChainId(selectedChainId);
            this._switchNetworkOnSelect = this.getAttribute('switchNetworkOnSelect', true, false);
            this._onCustomNetworkSelected = this.getAttribute('onCustomNetworkSelected', true);
            const rpcWalletId = this.getAttribute('rpcWalletId', true);
            if (rpcWalletId)
                this.model.rpcWalletId = rpcWalletId;
            this.renderUI();
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlNetwork', width: '100%', class: index_css_1.default },
                this.$render("i-modal", { id: 'mdNetwork', title: '$supported_networks', class: index_css_1.modalStyles, width: 440, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { height: '100%', lineHeight: 1.5, padding: { left: '1rem', right: '1rem', bottom: '2rem' } },
                        this.$render("i-label", { id: 'lblNetworkDesc', margin: { top: '1rem' }, font: { size: '.875rem' }, wordBreak: "break-word", caption: '$we_support_the_following_networks_please_click_to_connect' }),
                        this.$render("i-hstack", { margin: { left: '-1.25rem', right: '-1.25rem' }, height: '100%' },
                            this.$render("i-grid-layout", { id: 'gridNetworkGroup', font: { color: '#f05e61' }, height: "calc(100% - 160px)", width: "100%", overflow: { y: 'auto' }, margin: { top: '1.5rem' }, padding: { left: '1.25rem', right: '1.25rem' }, columnsPerRow: 1, templateRows: ['max-content'], class: 'list-view', gap: { row: '0.5rem' } }))))));
        }
    };
    ScomNetworkModal = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-network-modal')
    ], ScomNetworkModal);
    exports.default = ScomNetworkModal;
});
