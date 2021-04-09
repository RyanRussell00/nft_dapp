import React, {Component} from 'react';
import './App.css';
import Web3 from "web3";
import Color from "../abis/Color.json";

class App extends Component {

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchain();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("Non-Ethereum Browser. Please install Metamask");
        }
    }

    async loadBlockchain() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})

        const networkId = await web3.eth.net.getId()
        console.log("NetworkId: ", networkId);
        const networkData = Color.networks[networkId]
        if (networkData) {
            const abi = Color.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            this.setState({contract})
            const totalSupply = await contract.methods.totalSupply().call()
            this.setState({totalSupply})
            // Load Colors
            for (var i = 1; i <= totalSupply; i++) {
                const color = await contract.methods.colors(i - 1).call()
                this.setState({
                    colors: [...this.state.colors, color]
                })
            }
        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            colors: []
        }
    }

    mint = (color) => {
        // Use send() to send transaction to blockchain
        this.state.contract.methods.mint(color).send(
            {from: this.state.account}
        )
            .once('receipt', (receipt) => {
                this.setState({
                    colors: [this.state.colors, color]
                });
            });
    }

    async addExistingToken(tokenId) {
        console.log("Started ownerOf: ", tokenId)
        const owner = await this.state.contract.methods.ownerOf(tokenId).call()
        console.log("owner: ", owner);
        // this.state.contract.methods.ownerOf(tokenId).send(
        //     {from: this.state.account}
        // ).then((receipt) => {
        //     console.log("Receipt. Owner is: " + receipt);
        // })
    }

    transfer = (to, tokenId) => {

    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="http://www.dappuniversity.com/bootcamp"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Color Tokens
                    </a>
                    <p className="text-white px-3 py-1">
                        {this.state.account}
                    </p>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1>New Token</h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    const color = this.color.value;
                                    this.mint(color);
                                }}>
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="e.g. #FFFFF"
                                        ref={(input) => {
                                            this.color = input
                                        }}/>
                                    <input
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        value="MINT"/>
                                </form>
                                <hr/>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    const token = this.inputTokenId.value;
                                    this.addExistingToken(token);
                                }}>
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Enter Existing Token ID"
                                        ref={(input) => {
                                            this.inputTokenId = input
                                        }}/>
                                    <input
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        value="Add Existing Token"/>
                                </form>
                            </div>
                        </main>
                    </div>
                    <hr/>
                    <div className="row text-center">
                        {this.state.colors.map((color, key) => {
                            return (<>
                                    <div className="color m-2" key={key}
                                         style={{backgroundColor: color}}>
                                    </div>
                                    <div>
                                        {color}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
