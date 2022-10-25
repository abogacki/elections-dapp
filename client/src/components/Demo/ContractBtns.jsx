import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function replaceAt(array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

const useEvent = (name, callback) => {
  const {
    state: { contract },
  } = useEth();

  useEffect(() => {
    let subscription;
    if (contract) {
      console.log({ contract });
      subscription = contract.events[name]()
        .on("connected", () => {
          console.log("connected");
        })
        .on("data", (data) => {
          console.log("event trigered", callback(data));
        });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [contract, callback, name]);
};

function ContractBtns() {
  const {
    state: { contract, accounts },
  } = useEth();
  const [votes, setVotes] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const incrementVote = useCallback((candidateId) => {
    setVotes((votes) => replaceAt(votes, candidateId, votes[candidateId] + 1));
  }, []);

  const getCandidates = useCallback(async () => {
    const count = await contract.methods.candidatesCount().call();
    const candidates = [];
    for (let i = 0; i < count; i++) {
      const { id, name, voteCount } = await contract.methods
        .candidates(i)
        .call();

      setVotes((votes) => replaceAt(votes, id, Number(voteCount)));
      candidates.push({ id, name, voteCount });
    }
    setCandidates(candidates);
  }, [contract.methods]);

  const handleVote = async (event) => {
    try {
      const candidateId = event.currentTarget.value;
      await contract.methods.vote(candidateId).send({ from: accounts[0] });
    } catch (error) {
      console.error(error);
    }
  };

  useEvent("votedEvent", (data) => {
    incrementVote(data.returnValues[0]);
  });

  useEffect(() => {
    getCandidates();
  }, [getCandidates]);

  return (
    <table>
      <tr>
        <th>Candidate name</th>
        <th>Total votes</th>
        <th></th>
      </tr>
      {candidates.map((candidate, index) => (
        <tr key={index}>
          <td> {candidate.name}</td>
          <td> {votes[candidate.id]}</td>
          <td>
            <button onClick={handleVote} value={candidate.id}>
              Vote
            </button>
          </td>
        </tr>
      ))}
    </table>
  );
}

export default ContractBtns;
