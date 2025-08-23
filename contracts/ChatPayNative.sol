// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChatPayNative {
    address public immutable treasury;

    event MessagePaid(address indexed payer, string messageId, uint256 amountWei, uint256 timestamp);

    constructor(address _treasury) {
        require(_treasury != address(0), "treasury=0");
        treasury = _treasury;
    }

    /// @notice Pay per message using native CELO
    function payPerMessageNative(string calldata messageId) external payable {
        require(msg.value > 0, "no value");
        (bool ok, ) = payable(treasury).call{ value: msg.value }("");
        require(ok, "treasury transfer failed");
        emit MessagePaid(msg.sender, messageId, msg.value, block.timestamp);
    }
}
