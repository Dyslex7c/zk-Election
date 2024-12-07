// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract BlockchainElection {
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    struct ElectionConfig {
        string electionName;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    address public admin;
    ElectionConfig public electionConfig;
    
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isRegisteredVoter;
    
    uint256[] public candidateIds;

    event CandidateAdded(uint256 id, string name, string party);
    event VoteCast(address voter, uint256 candidateId);
    event ElectionConfigUpdated(string electionName, uint256 startDate, uint256 endDate);
    event VoterRegistered(address voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionActive() {
        require(
            block.timestamp >= electionConfig.startDate && 
            block.timestamp <= electionConfig.endDate && 
            electionConfig.isActive,
            "Election is not currently active"
        );
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    modifier isRegistered() {
        require(isRegisteredVoter[msg.sender], "Voter is not registered");
        _;
    }

    constructor(string memory _electionName) {
        admin = msg.sender;
        electionConfig = ElectionConfig({
            electionName: _electionName,
            startDate: block.timestamp,
            endDate: block.timestamp + 30 days,
            isActive: true
        });
    }

    function addCandidate(string memory _name, string memory _party) public onlyAdmin {
        uint256 newCandidateId = candidateIds.length + 1;
        candidates[newCandidateId] = Candidate({
            id: newCandidateId,
            name: _name,
            party: _party,
            voteCount: 0
        });
        candidateIds.push(newCandidateId);
        
        emit CandidateAdded(newCandidateId, _name, _party);
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(!isRegisteredVoter[_voter], "Voter is already registered");
        isRegisteredVoter[_voter] = true;
        
        emit VoterRegistered(_voter);
    }

    function updateElectionConfig(
        string memory _electionName, 
        uint256 _startDate, 
        uint256 _endDate
    ) public onlyAdmin {
        electionConfig.electionName = _electionName;
        electionConfig.startDate = _startDate;
        electionConfig.endDate = _endDate;
        
        emit ElectionConfigUpdated(_electionName, _startDate, _endDate);
    }

    function toggleElectionStatus() public onlyAdmin {
        electionConfig.isActive = !electionConfig.isActive;
    }

    function castVote(uint256 _candidateId) 
        public 
        electionActive 
        isRegistered 
        hasNotVoted 
    {
        require(_candidateId > 0 && _candidateId <= candidateIds.length, "Invalid candidate");
        
        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        
        emit VoteCast(msg.sender, _candidateId);
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidateIds.length;
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateIds.length);
        
        for (uint256 i = 0; i < candidateIds.length; i++) {
            allCandidates[i] = candidates[candidateIds[i]];
        }
        
        return allCandidates;
    }

    function getElectionStats() public view returns (
        uint256 totalVoters, 
        uint256 votesCast, 
        uint256 turnoutPercentage
    ) {
        totalVoters = 0;
        votesCast = 0;

        for (uint256 i = 0; i < candidateIds.length; i++) {
            votesCast += candidates[candidateIds[i]].voteCount;
        }

        totalVoters = 10000; 
        
        turnoutPercentage = (votesCast * 100) / totalVoters;
        
        return (totalVoters, votesCast, turnoutPercentage);
    }
}