// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "./verifier.sol";

contract Prove is Groth16Verifier {
    event ProofVerified(
        address indexed prover,
        uint[2] publicSignals,
        bool verified
    );

    function submitProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[2] calldata publicSignals
    ) public {
        emit ProofVerified(
            msg.sender,
            publicSignals,
            verifyProof(a, b, c, publicSignals)
        );
    }
}
