// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataPointerRegistry {
    event DataCommitted(uint256 indexed tokenId, bytes32 indexed messageHash, string cid, uint256 timestamp);

    function commit(uint256 tokenId, bytes32 messageHash, string calldata cid) external {
        emit DataCommitted(tokenId, messageHash, cid, block.timestamp);
    }
}
