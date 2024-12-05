'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Flag, ShieldCheck, Check, X, Sun, Moon } from 'lucide-react'

interface Candidate {
  name: string;
  party: string;
  color: string;
}

const candidates = [
  { name: "Vitalik Buterin", party: "Smart Contract Coalition", color: "red" },
  { name: "Silvio Micali", party: "Zero-Knowledge League", color: "blue" },
  { name: "Nick Szabo", party: "Consensus Alliance", color: "yellow" },
  { name: "Whitfield Diffie", party: "Cryptography Crusaders", color: "green" },
  { name: "Kevin McCoy", party: "NFT Vanguard", color: "purple" },
]

export default function BlockchainElection() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Apply the theme to the body
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleVote = (candidate: Candidate) => {
    if (hasVoted) {
      toast({
        title: "You've already voted",
        description: "In this blockchain-based system, each user can only vote once.",
        variant: "destructive",
      })
      return
    }
    setSelectedCandidate(candidate)
    setIsDialogOpen(true)
  }

  const confirmVote = () => {
    setIsDialogOpen(false)
    setHasVoted(true)
    toast({
      title: "Vote Confirmed",
      description: `Your vote for ${selectedCandidate?.name} has been recorded on the blockchain.`,
    })
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 relative">
          <Button
            onClick={toggleTheme}
            className="absolute right-0 top-0 bg-transparent hover:bg-transparent"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-8 w-8 text-white" /> : <Moon className="h-8 w-8 text-gray-600" />}
          </Button>
          <div className="flex justify-center items-center mb-6">
            <div className="flex justify-center mb-4">
              <Flag className={`h-20 w-20 ${isDarkMode ? 'text-blue-500' : 'text-red-500'}`} />
              <ShieldCheck className={`h-12 w-12 ${isDarkMode ? 'text-red-500' : 'text-blue-500'} absolute bottom-0 right-0`} />
            </div>
          </div>
          <h1 className={`text-5xl font-bold mb-2 ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-cyan-200' : 'text-gray-900'}`}>
            Blockchain-Based US Election
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Secure, Transparent, and Immutable Voting</p>
        </header>

        <div className="grid gap-6 mb-12">
          {candidates.map((candidate) => (
            <Card key={candidate.name} className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-all duration-300 transform hover:scale-105`}>
              <CardHeader>
                <CardTitle className={`text-${candidate.color}-${isDarkMode ? '400' : '600'} text-2xl`}>{candidate.name}</CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{candidate.party}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  onClick={() => handleVote(candidate)} 
                  disabled={hasVoted} 
                  className={`w-full bg-${candidate.color}-600 hover:bg-${candidate.color}-700 text-white`}
                >
                  {hasVoted ? 'Voted' : 'Vote'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <footer className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          <p className="mb-4">Powered by Blockchain Technology</p>
          <div className="flex justify-center space-x-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg flex items-center justify-center relative`}>
                <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
                  <div className={`w-6 h-6 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-100'} rounded-lg`}></div>
                </div>
                {i < 6 && (
                  <div className={`absolute top-1/2 -right-2 w-4 h-0.5 ${isDarkMode ? 'bg-blue-500' : 'bg-red-500'} transform -translate-y-1/2`}></div>
                )}
              </div>
            ))}
          </div>
        </footer>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Confirm Your Vote</DialogTitle>
              <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Are you sure you want to vote for {selectedCandidate?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className={isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={confirmVote} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="mr-2 h-4 w-4" /> Confirm Vote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </div>
  )
}

