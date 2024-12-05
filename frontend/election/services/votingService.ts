import { ethers } from 'ethers';
import { generateProof } from "../utils/zk-proof-generator";
import VerifierContract from './VerifierContract.json';

interface VoteSubmission {
  electionId: string;
  candidateId: number;
  voterSecret: string;
  nullifierSecret: string;
}

class VotingService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(provider: ethers.providers.Web3Provider, contractAddress: string) {
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(
      contractAddress, 
      VerifierContract.abi, 
      this.signer
    );
  }

  async submitVote(vote: VoteSubmission) {
    try {
      const proof = await generateProof(vote);

      const tx = await this.contract.verifyAndRecordVote(
        proof.a,
        proof.b,
        proof.c,
        [
          vote.electionId,
          vote.candidateId,
          proof.commitment,
          proof.nullifier
        ]
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Vote submission failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

}

export default VotingService;