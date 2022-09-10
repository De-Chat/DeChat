// SPDX-License-Identifier: unlicensed

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

pragma solidity ^0.8.9;

contract Send {
    event SendEth(
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );

    event SendErc20(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        address erc20ContractAddress
    );

    event SendErc721(
        address indexed sender,
        address indexed recipient,
        uint256 tokenId,
        address erc721ContractAddress
    );

    event SendErc1155(
        address indexed sender,
        address indexed recipient,
        uint256 tokenId,
        uint256 amount,
        address erc1155ContractAddress
    );

    function sendEth(address recipient) external payable returns (bool) {
        (bool success, ) = payable(recipient).call{value: msg.value}("");
        require(success);

        emit SendEth(msg.sender, recipient, msg.value);
        return true;
    }

    /// @dev remember to approve this contract as spender
    function sendErc20(
        IERC20 erc20,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        bool success = erc20.transferFrom(msg.sender, recipient, amount);
        require(success);

        emit SendErc20(msg.sender, recipient, amount, address(erc20));
        return true;
    }

    function sendErc721(
        IERC721 erc721,
        address recipient,
        uint256 tokenId
    ) external returns (bool) {
        erc721.safeTransferFrom(msg.sender, recipient, tokenId);

        emit SendErc721(msg.sender, recipient, tokenId, address(erc721));
        return true;
    }

    function sendErc1155(
        IERC1155 erc1155,
        address recipient,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external returns (bool) {
        erc1155.safeTransferFrom(msg.sender, recipient, tokenId, amount, data);

        emit SendErc1155(
            msg.sender,
            recipient,
            tokenId,
            amount,
            address(erc1155)
        );

        return true;
    }
}
