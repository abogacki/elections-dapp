// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract Elections {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;

    mapping(address => bool) public voters;

    uint256 public candidatesCount = 0;

    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
    }

    function vote(uint256 _candidateId) public {
        require(!voters[msg.sender]);

        require(_candidateId >= 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }

    event votedEvent(uint256 indexed _candidateId);
}
