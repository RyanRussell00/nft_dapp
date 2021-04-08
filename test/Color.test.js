// Require the contract (artifacts comes from truffle)
const Color = artifacts.require("./Color.sol")

// Import testing library
require('chai')
    .use(require('chai-as-promised'))
    .should();


// A Test that has a callback function that takes a single argument:
// accounts. The accounts are from Ganache
contract('Color', (accounts) => {
    let contract;
    before(async () => {
        contract = await Color.deployed();
    })

    // describe is a container for tests
    describe('deployment', async () => {
        // Tests
        it('deploys successfully', async () => {
            const address = contract.address;
            assert.notEqual(address, "");
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has a name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color');
        })

        it('has a symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'COLOR');
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () => {
            const result = await contract.mint('#EC058E');
            const totalSupply = await contract.totalSupply();
            assert.equal(1, totalSupply);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, 'id is not correct');
            // Since being minted it goes to a blank address
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is not correct')
            assert.equal(event.to, accounts[0], 'to is not correct')
        })

        it('failes to create duplicate', async () => {
            await contract.mint('#FFFFFF');
            await contract.mint('#FFFFFF').should.be.rejected;
        })

        describe('indexing', async () => {
            it('lists colors', async () => {
                await contract.mint('#538F6');
                await contract.mint('#00000');
                await contract.mint('#3JFH3');
                const totalSupply = await contract.totalSupply();
                let result = [];
                let color;
                for (let i = 1; i <= totalSupply; i++) {
                    // Access the index of the array from the smart contract
                    color = await contract.colors(i - 1);
                    result.push(color);
                }
                let expected = ['#EC058E', '#FFFFFF', '#538F6', '#00000', '#3JFH3'];
                assert.equal(result.join(','), expected.join(','));
            })
        })
    })

})