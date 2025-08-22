// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DataPointerRegistry {
  event DataCommitted(uint256 indexed tokenId, bytes32 indexed messageHash, string cid);

  mapping(bytes32 => string) public pointerByMessage; // messageHash -> cid

  function commit(uint256 tokenId, bytes32 messageHash, string calldata cid) external {
    pointerByMessage[messageHash] = cid;
    emit DataCommitted(tokenId, messageHash, cid);
  }
}
