// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TraitAttestor {
  bytes32 public constant SCHEMA_ID = keccak256("motusdao.trait:v1");
  bytes32 public constant ADMIN = keccak256("ADMIN");
  bytes32 public constant ATTESTER = keccak256("ATTESTER");

  bytes32 public constant HUMAN_VERIFIED = keccak256("human_verified:v1");
  bytes32 public constant VERIFIED_PSYCHOLOGIST = keccak256("verified_psychologist:v1");

  mapping(address => mapping(bytes32 => bool)) public hasRole;

  struct Attestation { address attester; uint256 tokenId; bytes32 traitId; bytes32 proofHash; uint64 issuedAt; uint64 expiry; }
  mapping(uint256 => mapping(bytes32 => Attestation)) public attestations;

  event Attested(bytes32 indexed schemaId, address indexed attester, uint256 indexed tokenId, bytes32 traitId, bytes32 proofHash, uint64 expiry);
  event Revoked(bytes32 indexed schemaId, address indexed attester, uint256 indexed tokenId, bytes32 traitId);

  constructor() { hasRole[msg.sender][ADMIN] = true; }

  modifier onlyRole(bytes32 r) { require(hasRole[msg.sender][r], "not role"); _; }

  function setRole(address a, bytes32 r, bool v) external onlyRole(ADMIN) { hasRole[a][r] = v; }

  function attest(uint256 tokenId, bytes32 traitId, bytes32 proofHash, uint64 expiry) external onlyRole(ATTESTER) {
    attestations[tokenId][traitId] = Attestation(msg.sender, tokenId, traitId, proofHash, uint64(block.timestamp), expiry);
    emit Attested(SCHEMA_ID, msg.sender, tokenId, traitId, proofHash, expiry);
  }

  function revoke(uint256 tokenId, bytes32 traitId) external {
    Attestation storage a = attestations[tokenId][traitId];
    require(a.attester != address(0), "none");
    require(hasRole[msg.sender][ADMIN] || hasRole[msg.sender][ATTESTER], "not auth");
    delete attestations[tokenId][traitId];
    emit Revoked(SCHEMA_ID, msg.sender, tokenId, traitId);
  }

  function hasTrait(uint256 tokenId, bytes32 traitId) external view returns (bool) {
    Attestation memory a = attestations[tokenId][traitId];
    if (a.attester == address(0)) return false;
    if (a.expiry != 0 && a.expiry < block.timestamp) return false;
    return true;
  }
}
