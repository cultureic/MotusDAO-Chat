// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
  function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract ChatPay {
  address public immutable cUSD;
  address public treasury;
  address public owner;

  event MessagePaid(address indexed payer, string indexed messageId, uint256 amount, uint256 ts);

  constructor(address _treasury, address _cUSD) {
    owner = msg.sender;
    treasury = 0xf229F3Dcea3D7cd3cA5ca41C4C50135D7b37F2b9;
    cUSD = _cUSD;
    if (_treasury != treasury) {
      // ignore, treasury is fixed per spec
    }
  }

  modifier onlyOwner() { require(msg.sender == owner, 'not owner'); _; }

  function setTreasury(address _t) external onlyOwner { treasury = _t; }

  function payPerMessage(string calldata messageId, uint256 amount) external {
    require(bytes(messageId).length > 0, 'id');
    require(amount > 0, 'amt');
    require(IERC20(cUSD).transferFrom(msg.sender, treasury, amount), 'transfer');
    emit MessagePaid(msg.sender, messageId, amount, block.timestamp);
  }
}
