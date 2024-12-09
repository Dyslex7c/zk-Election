"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Flag, ShieldCheck, Check, X, Sun, Moon } from "lucide-react";
import VotingService from "@/services/votingService";
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";
import ElectionService from "@/services/electionService";
import { useWallet } from "@/context/WalletContext";
import Cookies from "js-cookie";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  voteCount: number;
}

export default function BlockchainElection() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  //const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const { walletAddress, setWalletAddress } = useWallet();
  console.log(walletAddress);

  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            Cookies.set("walletAddress", accounts[0]);
          }
        } else {
          toast({
            title: "MetaMask not found",
            description: "Please install MetaMask to use this application.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
        toast({
          title: "Error",
          description: "Failed to fetch wallet address.",
          variant: "destructive",
        });
      }
    };

    getWalletAddress();
  }, []);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const votingService = new VotingService(
    provider,
    "0x3D5eA17D30e3A8A5F87f230036cf63d160ffa62d"
  );
  const electionService = new ElectionService(
    provider,
    "0x96DF61c39067B32044e733169250cFdeC0778eC3"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchCandidates();
    checkVotingStatus();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const fetchedCandidates = await electionService.getCandidates();
      setCandidates(fetchedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const checkVotingStatus = async () => {
    try {
      //const hasUserVoted = await votingService.hasVoted();
      setHasVoted(false);
    } catch (error) {
      console.error("Error checking voting status:", error);
    }
  };

  const handleVote = (candidate: Candidate) => {
    if (hasVoted) {
      toast({
        title: "You've already voted",
        description:
          "In this blockchain-based system, each user can only vote once.",
        variant: "destructive",
      });
      return;
    }
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate) return;

    setHasVoted(true);
    try {
      const voteSubmission = {
        electionId: "123456",
        candidateId: candidates.find((c) => c.name === selectedCandidate.name)
          ?.id,
        voterSecret: [
          0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0,
          1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1,
          1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0,
          1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1,
          1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0,
          1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1,
          0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
          1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1,
          1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0,
          1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1,
          1, 1, 1,
        ],
        nullifierSecret: "7721580882",
      };
      console.log(voteSubmission);
      const result = await votingService.submitVote(voteSubmission);
      setIsDialogOpen(false);
      if (result?.success) {
        toast({
          title: "Vote Confirmed",
          description: `Your vote for ${selectedCandidate.name} has been recorded and verified.`,
        });
      } else {
        toast({
          title: "Vote Submission Failed",
          description: result?.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Vote Submission Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getColorForCandidate = (index: number) => {
    const colors = ["red", "blue", "yellow", "green", "purple"];
    return colors[index % colors.length];
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      } transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 relative">
          <Button
            onClick={toggleTheme}
            className="absolute right-0 top-0 bg-transparent hover:bg-transparent"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-8 w-8 text-white" />
            ) : (
              <Moon className="h-8 w-8 text-gray-600" />
            )}
          </Button>
          <div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Connected Wallet:{" "}
              {walletAddress ? walletAddress : "Not Connected"}
            </p>
          </div>
          <div className="flex justify-center items-center mb-6">
            <div className="flex justify-center mb-4">
              <Flag
                className={`h-20 w-20 ${
                  isDarkMode ? "text-blue-500" : "text-red-500"
                }`}
              />
              <ShieldCheck
                className={`h-12 w-12 ${
                  isDarkMode ? "text-red-500" : "text-blue-500"
                } absolute bottom-0 right-0`}
              />
            </div>
          </div>
          <h1
            className={`text-5xl font-bold mb-2 ${
              isDarkMode
                ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-cyan-200"
                : "text-gray-900"
            }`}
          >
            Blockchain-Based US Election
          </h1>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Secure, Transparent, and Immutable Voting
          </p>
        </header>

        {isLoading ? (
          <div className="text-center">
            <p className="text-xl">Loading candidates...</p>
          </div>
        ) : (
          <div className="grid gap-6 mb-12">
            {candidates.map((candidate, index) => (
              <Card
                key={candidate.id}
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                } transition-all duration-300 transform hover:scale-105`}
              >
                <CardHeader>
                  <CardTitle
                    className={`text-${getColorForCandidate(index)}-${
                      isDarkMode ? "400" : "600"
                    } text-2xl`}
                  >
                    {candidate.name}
                  </CardTitle>
                  <CardDescription
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {candidate.party}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => handleVote(candidate)}
                    disabled={hasVoted}
                    className={`w-full bg-${getColorForCandidate(
                      index
                    )}-600 hover:bg-${getColorForCandidate(
                      index
                    )}-700 text-white`}
                  >
                    {hasVoted ? "Voted" : "Vote"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <footer
          className={`text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } text-sm`}
        >
          <p className="mb-4">Powered by zk-SNARKs & Blockchain Technology</p>
        </footer>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className={
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Confirm Your Vote
              </DialogTitle>
              <DialogDescription
                className={isDarkMode ? "text-gray-400" : "text-gray-600"}
              >
                Are you sure you want to vote for {selectedCandidate?.name}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className={
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button
                onClick={confirmVote}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="mr-2 h-4 w-4" /> Confirm Vote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </div>
  );
}
