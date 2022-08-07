// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20Token.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenExchange is Pausable,AccessControl {
  address public oldToken;
  address public newToken;

  constructor(address _oldTokenAddress,address _newTokenAddress,address _admin) {
    oldToken = _oldTokenAddress;
    newToken = _newTokenAddress;

    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function deposit(uint _amount) whenNotPaused() external {
    require(_amount > 0,"AMOUNT IS ZERO");
    bool tookOldToken = IERC20Token(oldToken).transferFrom(msg.sender,address(this),_amount);
    require(tookOldToken,"OLD TRANSFER FAILED");

    IERC20Token(newToken).mint(msg.sender,_amount);
  }

  function withdraw(uint _amount) whenNotPaused() external {
    require(_amount > 0,"AMOUNT IS ZERO");

    IERC20Token(newToken).burnFrom(msg.sender,_amount);

    bool sentOldToken = IERC20Token(oldToken).transfer(msg.sender,_amount);
    require(sentOldToken,"OLD TRANSFER FAILED");
  }

  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

}
