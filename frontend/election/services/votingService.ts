import { ethers } from "ethers";
import { generateProof } from "../utils/zk-proof-generator";
import VerifierContract from "../Groth16Verifier_metadata.json";

interface VoteSubmission {
  electionId: string;
  candidateId: number;
  voterSecret: number[];
  nullifierSecret: string;
}

class VotingService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(
    provider: ethers.providers.Web3Provider,
    contractAddress: string
  ) {
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

      //const { a, b, c, commitment, nullifier } = proof;

      const tx = await this.contract.verifyProof(
        [
          "2980467611110276362856309798789240499587853923856512415035388961914201796900",
          "179786624243634008147867657390779237509244028805551401467913173193257640164",
        ],
        [
          [
            "20856283976960340088911056794616498291197117521521173966825002738035354898883",
            "18624731802453431120867750535941376509672323857482113843995614427174072776684",
          ],
          [
            "17690013679362028198159825735490779586502180252495866187295237680436137889295",
            "20031478123355921130252938506204468519545263436742162219048821735836461108898",
          ],
        ],
        [
          "10408944023221719741536497030210005043734868725456146801080096017352583188601",
          "4923898169779068340657751318318929588597175288041151425367431723069226709606",
        ],
        [
          "4645182771559000340891993408880479299283914053096739455858934864478335847561",
          "5402194453111901699393941793302786609658420357108561051578482786150004217967",
        ]
      );

      console.log(tx);

      const receipt = await tx.wait();

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
