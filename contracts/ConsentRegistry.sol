// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConsentRegistry {
  event ConsentGranted(uint256 indexed tokenId, bytes32 indexed policyHash, string cidRoot, uint64 expiry);
  event ConsentRevoked(uint256 indexed tokenId, bytes32 indexed policyHash);

  struct Consent { string cidRoot; uint64 expiry; bool active; }
  mapping(uint256 => mapping(bytes32 => Consent)) public consents;

  function grantConsent(uint256 tokenId, bytes32 policyHash, string calldata cidRoot, uint64 expiry) external {
    consents[tokenId][policyHash] = Consent(cidRoot, expiry, true);
    emit ConsentGranted(tokenId, policyHash, cidRoot, expiry);
  }

  function revokeConsent(uint256 tokenId, bytes32 policyHash) external {
    Consent storage c = consents[tokenId][policyHash];
    require(c.active, 'none');
    c.active = false;
    emit ConsentRevoked(tokenId, policyHash);
  }

  function hasConsent(uint256 tokenId, bytes32 policyHash) external view returns (bool) {
    Consent memory c = consents[tokenId][policyHash];
    if (!c.active) return false;
    if (c.expiry != 0 && c.expiry < block.timestamp) return false;
    return true;
  }
}
