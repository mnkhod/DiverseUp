// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./TokenExchange.sol";
import "./presets/SnapshotToken.sol";

contract SnapshotProxy {

  event UpdatedToken(address indexed oldToken,address indexed newToken, address indexed exchange);

  function updateToken(
    address _oldTokenAddress,
    string memory _name,
    string memory _symbol,
    address _adminAddress
  ) external returns(address,address) {

    SnapshotToken token = new SnapshotToken(_name,_symbol,_adminAddress);
    TokenExchange exchange = new TokenExchange(_oldTokenAddress,address(token),_adminAddress);

    token.grantRole(keccak256("MINTER_ROLE"),address(exchange));

    emit UpdatedToken(_oldTokenAddress,address(token),address(exchange));

    return ( 
      address(token),
      address(exchange)
    );
  }

}
