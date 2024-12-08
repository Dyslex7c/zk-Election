import { ethers } from "ethers";
import ProveContract from "../Prove_metadata.json";
import { groth16 } from "snarkjs";
import ElectionService from "./electionService";

interface VoteSubmission {
  electionId: string;
  candidateId: string | undefined;
  voterSecret: number[];
  nullifierSecret: string;
}

class VotingService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;
  private electionService: ElectionService;

  constructor(
    provider: ethers.providers.Web3Provider,
    contractAddress: string
  ) {
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(
      contractAddress,
      ProveContract.abi,
      this.signer
    );
    this.electionService = new ElectionService(
      provider,
      "0x96DF61c39067B32044e733169250cFdeC0778eC3"
    );
  }

  async submitVote(vote: VoteSubmission) {
    try {
      const input = {
        electionId: vote.electionId,
        candidateId: vote.candidateId,
        voterSecret: vote.voterSecret,
        nullifierSecret: vote.nullifierSecret,
      };

      const { proof, publicSignals } = await groth16.fullProve(
        input,
        "/circuits/voting_circuit.wasm",
        "/circuits/voter_circuit_final.zkey"
      );

      const convertToHex = (value: string) => {
        return "0x" + BigInt(value).toString(16).padStart(64, "0");
      };

      const formattedProof = [
        [convertToHex(proof.pi_a[0]), convertToHex(proof.pi_a[1])],
        [
          [convertToHex(proof.pi_b[0][0]), convertToHex(proof.pi_b[0][1])],
          [convertToHex(proof.pi_b[1][0]), convertToHex(proof.pi_b[1][1])],
        ],
        [convertToHex(proof.pi_c[0]), convertToHex(proof.pi_c[1])],
        [convertToHex(publicSignals[0]), convertToHex(publicSignals[1])],
      ];
      
      //const tx = await this.contract.submitProof(formattedProof);
      // // simulation using static proof generated by snarkjs generatecall
      const tx = await this.contract.submitProof(
        [
          "0x0696e287f3572af86f3010b9df97c2e897a3708a89b7608146408d211f337124",
          "0x0065c17086497179f04360cfecb31643ab3e9dd434c73db45e93bc4c7d93e0e4",
        ],
        [
          [
            "0x292d398190cdb620e9e9ccaf9175357ea920087914dc159b34def9f93e8077ec",
            "0x2e1c3d08140810d6a8007f118047141b72ed014449a6c14a9d53c47f3eba11c3",
          ],
          [
            "0x2c496a32a00810e5a0113b6abfe854336d5a38a91c9db620aff2b60bdf190ea2",
            "0x271c316373ccb8f78df9643fe111cb287b618b0835dd70df46f03f46ab2b0e0f",
          ],
        ],
        [
          "0x170340e7ee52ca0db592901ca9f17a80b5e1a7bb22f37b63db30fd3a34de9079",
          "0x0ae2d3ddc45c1d9b81a1020c43101ab331ebdf788d8fd45aa577427cc5957266",
        ],
        [
          "0x0a45148d12c65615c3514bf1c03246dcceda598c706f838fa733ed49eedecc89",
          "0x0bf188a0ed4ab7f123d125d2de3d44b5ce733ae4b8c499d1e4550ba04822d86f",
        ]
      );

      const receipt = await tx.wait();
      console.log(receipt);

      if (receipt.transactionHash) {
        const result = await this.electionService.castVote(vote.candidateId);
        console.log(result);
      }
      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Vote submission failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export default VotingService;
