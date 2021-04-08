require('babel-register');
require('babel-polyfill');

const {API_URL, PRIVATE_KEY} = process.env;
module.exports = {
    solidity: "0.7.3",
    defaultNetwork: "ropsten",
    networks: {
        hardhat: {},
        ropsten: {
            url: API_URL,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
    contracts_directory: './src/contracts/',
    contracts_build_directory: './src/abis/',
    compilers: {
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
}
