// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IERC5192 {
  event Locked(uint256 tokenId);
  function locked(uint256 tokenId) external view returns (bool);
}

contract HNFT is ERC721, IERC5192 {
  address public owner;
  bool public onePerUser = true;
  mapping(address => bool) public hasMinted;
  mapping(uint256 => bool) private _locked;

  event MetadataPointerUpdated(uint256 indexed tokenId, bytes32 metadataHash, string uri);

  constructor() ERC721("HNFT", "HNFT") { owner = msg.sender; }
  modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }

  function mint() external returns (uint256 tokenId) {
    if (onePerUser) { require(!hasMinted[msg.sender], "already"); hasMinted[msg.sender] = true; }
    tokenId = uint256(uint160(msg.sender));
    _mint(msg.sender, tokenId);
    _locked[tokenId] = true; emit Locked(tokenId);
  }

  function locked(uint256 tokenId) external view returns (bool) { return _locked[tokenId]; }

  function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
    address from = super._update(to, tokenId, auth);
    if (from != address(0) && to != address(0)) revert("soulbound");
    return from;
  }

  function setMetadataPointer(uint256 tokenId, bytes32 metadataHash, string memory uri) external {
    require(ownerOf(tokenId) == msg.sender, "not owner");
    emit MetadataPointerUpdated(tokenId, metadataHash, uri);
  }
}
