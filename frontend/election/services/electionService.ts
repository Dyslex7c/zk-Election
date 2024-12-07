import { ethers } from 'ethers';
import ElectionContract from "../Election_metadata.json";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  voteCount: number;
}

export interface ElectionStats {
  totalVoters: number;
  votesCast: number;
  turnoutPercentage: number;
}

export interface ElectionConfig {
  electionName: string;
  startDate: number;
  endDate: number;
}

class ElectionService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(
    provider: ethers.providers.Web3Provider, 
    contractAddress: string
  ) {
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(
      contractAddress, 
      ElectionContract.abi, 
      this.signer
    );
  }

  async addCandidate(name: string, party: string): Promise<void> {
    try {
      const tx = await this.contract.addCandidate(name, party);
      await tx.wait();
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  }

  async getCandidates(): Promise<Candidate[]> {
    try {
      const candidates = await this.contract.getAllCandidates();
      return candidates.map((candidate: any) => ({
        id: candidate.id.toString(),
        name: candidate.name,
        party: candidate.party,
        voteCount: candidate.voteCount.toNumber()
      }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  async castVote(candidateId: number | string | undefined) {
    try {
      const tx = await this.contract.castVote(candidateId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  async updateElectionConfig(
    electionName: string, 
    startDate: number, 
    endDate: number
  ): Promise<void> {
    try {
      const tx = await this.contract.updateElectionConfig(
        electionName, 
        startDate, 
        endDate
      );
      await tx.wait();
    } catch (error) {
      console.error('Error updating election config:', error);
      throw error;
    }
  }

  async getElectionStats(): Promise<ElectionStats> {
    try {
      const stats = await this.contract.getElectionStats();
      return {
        totalVoters: stats.totalVoters.toNumber(),
        votesCast: stats.votesCast.toNumber(),
        turnoutPercentage: stats.turnoutPercentage.toNumber()
      };
    } catch (error) {
      console.error('Error fetching election stats:', error);
      throw error;
    }
  }

  async registerVoter(voterAddress: string): Promise<void> {
    try {
      const tx = await this.contract.registerVoter(voterAddress);
      await tx.wait();
    } catch (error) {
      console.error('Error registering voter:', error);
      throw error;
    }
  }
}

export default ElectionService;