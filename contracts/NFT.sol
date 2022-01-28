// SPDX-License-Identifier: MIT

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity >=0.7.0 <0.9.0;

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public cost = 1 ether;
    uint256 public maxSupply = 20;

    string baseURI;
    string public baseExtension = ".json";

    address public artist;
    uint256 public royaltyFeeArtist = 25;
    uint256 public royaltyFeeMinter = 25;
    address[20] public minters;
    uint256 public tokenId_ = 1;

    event Sale(address from, address to, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        // uint256 _royaltyFeeArtist = 25;
        address _artist
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        // royaltyFeeArtist = _royaltyFeeArtist;
        artist = _artist;
    }

    // Public functions
    function mint() public payable {
        uint256 supply = totalSupply();
        require(supply <= maxSupply);

        if (msg.sender != owner()) {
            require(msg.value >= cost);

            // Pay royalty to artist, and remaining to deployer of contract

            uint256 royaltyArtist = (msg.value * royaltyFeeArtist) / 100;
            _payRoyaltyArtist(royaltyArtist);

            (bool success3, ) = payable(owner()).call{
                value: (msg.value - royaltyArtist)
            }("");
            require(success3);
        }

        _safeMint(msg.sender, supply + 1);
        minters[tokenId_] = msg.sender; 
        tokenId_ ++;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        if (msg.value > 0) {
            uint256 royaltyArtist = (msg.value * royaltyFeeArtist) / 100;
            _payRoyaltyArtist(royaltyArtist);

            uint256 royaltyMinter = (msg.value * royaltyFeeMinter) / 100;
            _payRoyaltyMinter(royaltyMinter, tokenId);

            (bool success3, ) = payable(from).call{value: msg.value - royaltyArtist - royaltyMinter}(
                ""
            );
            require(success3);

            emit Sale(from, to, msg.value);
        }

        _transfer(from, to, tokenId);
    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public payable override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        if (msg.value > 0) {
            uint256 royaltyArtist = (msg.value * royaltyFeeArtist) / 100;
            _payRoyaltyArtist(royaltyArtist);

             uint256 royaltyMinter = (msg.value * royaltyFeeMinter) / 100;
            _payRoyaltyMinter(royaltyMinter, tokenId);

            (bool success3, ) = payable(from).call{value: msg.value - royaltyArtist - royaltyMinter}(
                ""
            );
            require(success3);

            emit Sale(from, to, msg.value);
        }

        _safeTransfer(from, to, tokenId, _data);
    }

    // Internal functions
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _payRoyaltyArtist(uint256 _royaltyFeeArtist) internal {
        (bool success1, ) = payable(artist).call{value: _royaltyFeeArtist}("");
        require(success1);
    }

    function _payRoyaltyMinter(uint256 _royaltyFeeMinter, uint256 _tokenId) internal {
        (bool success2, ) = payable(minters[_tokenId]).call{value: _royaltyFeeMinter}("");
        require(success2);
    }

    // Owner functions
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // function setRoyaltyFeeArtist(uint256 _royaltyFeeArtist) public onlyOwner {
    //     royaltyFeeArtist = _royaltyFeeArtist;
    // }    
}
