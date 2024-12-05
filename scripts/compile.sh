#!/bin/bash

circom circuits/voting_circuit.circom --r1cs --wasm --sym

snarkjs wtns calculate circuits/voting_circuit.wasm input.json witness.wtns

snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v

snarkjs powersoftau prepare phase2 pot12_0001.ptau powersOfTau28_hez_final_15.ptau -v

snarkjs groth16 setup voting_circuit.r1cs powersOfTau28_hez_final_15.ptau voter_circuit_0000.zkey
snarkjs zkey contribute voter_circuit_0000.zkey voter_circuit_final.zkey
snarkjs zkey export verificationkey voter_circuit_final.zkey verification_key.json

snarkjs groth16 prove voter_circuit_final.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json