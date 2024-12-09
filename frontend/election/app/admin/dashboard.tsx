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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Flag,
  ShieldCheck,
  Sun,
  Moon,
  Users,
  BarChart,
  Settings,
  PlusCircle,
  Power,
} from "lucide-react";
import { ethers } from "ethers";
import ElectionService from "@/services/electionService";

interface Candidate {
  id: string;
  name: string;
  party: string;
  voteCount: number;
}

interface ElectionStats {
  totalVoters: number;
  votesCast: number;
  turnoutPercentage: number;
}

interface ElectionConfig {
  electionName: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionStats, setElectionStats] = useState<ElectionStats>({
    totalVoters: 0,
    votesCast: 0,
    turnoutPercentage: 0,
  });
  const [electionConfig, setElectionConfig] = useState<ElectionConfig>({
    electionName: "",
    startDate: 0,
    endDate: 0,
    isActive: false,
  });
  console.log(electionConfig);

  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [newVoter, setNewVoter] = useState("");
  const { toast } = useToast();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const electionService = new ElectionService(
    provider,
    "0x96DF61c39067B32044e733169250cFdeC0778eC3"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    fetchCandidates();
    fetchElectionStats();
    //fetchElectionConfig();
  }, [isDarkMode]);

  const fetchCandidates = async () => {
    try {
      const candidatesData = await electionService.getCandidates();
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchElectionStats = async () => {
    try {
      const stats = await electionService.getElectionStats();
      setElectionStats({
        totalVoters: stats.totalVoters,
        votesCast: stats.votesCast,
        turnoutPercentage: stats.turnoutPercentage,
      });
    } catch (error) {
      console.error("Error fetching election stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch election statistics. Please try again.",
        variant: "destructive",
      });
    }
  };

  //   const fetchElectionConfig = async () => {
  //     try {
  //       const config = await electionService.getElectionConfig();
  //       setElectionConfig({
  //         electionName: config.electionName,
  //         startDate: config.startDate.toNumber(),
  //         endDate: config.endDate.toNumber(),
  //         isActive: config.isActive,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching election config:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to fetch election configuration. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   };

  const addCandidate = async () => {
    try {
      await electionService.addCandidate(newCandidate.name, newCandidate.party);
      setNewCandidate({ name: "", party: "" });
      toast({
        title: "Candidate Added",
        description: `${newCandidate.name} has been added to the ballot.`,
      });
      fetchCandidates();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const registerVoter = async () => {
    try {
      await electionService.registerVoter(newVoter);
      setNewVoter("");
      toast({
        title: "Voter Registered",
        description: `Address ${newVoter} has been registered as a voter.`,
      });
    } catch (error) {
      console.error("Error registering voter:", error);
      toast({
        title: "Error",
        description: "Failed to register voter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateElectionConfig = async () => {
    try {
      await electionService.updateElectionConfig(
        electionConfig.electionName,
        electionConfig.startDate,
        electionConfig.endDate
      );
      toast({
        title: "Election Config Updated",
        description:
          "The election configuration has been updated successfully.",
      });
      //fetchElectionConfig();
    } catch (error) {
      console.error("Error updating election config:", error);
      toast({
        title: "Error",
        description:
          "Failed to update election configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleElectionStatus = async () => {
    try {
      //await electionService.toggleElectionStatus();
      toast({
        title: "Election Status Toggled",
        description: `The election is now ${
          electionConfig.isActive ? "inactive" : "active"
        }.`,
      });
      //fetchElectionConfig();
    } catch (error) {
      console.error("Error toggling election status:", error);
      toast({
        title: "Error",
        description: "Failed to toggle election status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      } transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <Flag
              className={`h-12 w-12 ${
                isDarkMode ? "text-blue-500" : "text-red-500"
              } mr-4`}
            />
            <div>
              <h1
                className={`text-4xl font-bold ${
                  isDarkMode
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-cyan-200"
                    : "text-gray-900"
                }`}
              >
                Election Admin Dashboard
              </h1>
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Manage Your Blockchain-Based Election
              </p>
            </div>
          </div>
          <Button
            onClick={toggleTheme}
            className="bg-transparent hover:bg-transparent"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-8 w-8 text-white" />
            ) : (
              <Moon className="h-8 w-8 text-gray-600" />
            )}
          </Button>
        </header>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Registered Voters
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {electionStats.totalVoters}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Votes Cast
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {electionStats.votesCast}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Voter Turnout
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {electionStats.turnoutPercentage}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Leading Candidate
                  </CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {candidates[0]?.name}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {candidates[0]?.voteCount} votes
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <CardTitle>Manage Candidates</CardTitle>
                <CardDescription>
                  Add, remove, or update candidate information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {candidate.party}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {candidate.voteCount} votes
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(
                            (candidate.voteCount / electionStats.votesCast) *
                            100
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Candidate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Candidate</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new candidate to add them to
                        the ballot.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={newCandidate.name}
                          onChange={(e) =>
                            setNewCandidate({
                              ...newCandidate,
                              name: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="party" className="text-right">
                          Party
                        </Label>
                        <Input
                          id="party"
                          value={newCandidate.party}
                          onChange={(e) =>
                            setNewCandidate({
                              ...newCandidate,
                              party: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addCandidate}>Add Candidate</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Election Settings</CardTitle>
                <CardDescription>
                  Manage global settings for the election.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="electionName">Election Name</Label>
                  <Input
                    id="electionName"
                    value={electionConfig.electionName}
                    onChange={(e) =>
                      setElectionConfig({
                        ...electionConfig,
                        electionName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={new Date(electionConfig.startDate * 1000)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setElectionConfig({
                        ...electionConfig,
                        startDate: Math.floor(
                          new Date(e.target.value).getTime() / 1000
                        ),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={new Date(electionConfig.endDate * 1000)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setElectionConfig({
                        ...electionConfig,
                        endDate: Math.floor(
                          new Date(e.target.value).getTime() / 1000
                        ),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newVoter">Register New Voter</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newVoter"
                      placeholder="Voter's Ethereum Address"
                      value={newVoter}
                      onChange={(e) => setNewVoter(e.target.value)}
                    />
                    <Button onClick={registerVoter}>Register</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={updateElectionConfig}>Save Settings</Button>
                <Button
                  onClick={toggleElectionStatus}
                  variant={electionConfig.isActive ? "destructive" : "default"}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {electionConfig.isActive ? "End Election" : "Start Election"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Toaster />
      </div>
    </div>
  );
}
