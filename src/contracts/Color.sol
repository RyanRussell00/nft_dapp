pragma solidity 0.5.0;

import "./ERC721Full.sol";

// Use ERC721Full as the library
// ERC721Full doesn't exist anymore. Maybe look into new one?
contract Color is ERC721Full {
    // Might not be the best idea to store in an array
    string[] public colors;
    // Key value (string=>boolean)
    mapping(string => bool) _colorExists;

    // ERC721Full(NameOfToken, Symbol)
    constructor() ERC721Full("Color", "COLOR") public {
        // Constructor is run when the smart contract gets deployed
    }

    // E.G. color = "#FFFFFF"
    /** TODO: This function should be set so that only the owner can mint the NFT
     Look at OpenZeppelin for roles: Admin/Minter/Owner, etc. **/
    function mint(string memory _color) public {
        // Require unique color. If this is false it breaks out of the function
        require(!_colorExists[_color]);
        // The  _id is the id of the new color that's been minted
        uint _id = colors.push(_color);
        // Call the _mint function from ERC721
        _mint(msg.sender, _id);
        // Mark this color as used to prevent duplicates
        _colorExists[_color] = true;
    }

}