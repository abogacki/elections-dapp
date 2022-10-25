import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setValue }) {
  const {
    state: { contract, address, accounts },
  } = useEth();
  // const [inputValue, setInputValue] = useState("");
  const [candidates, setCandidates] = useState([]);

  const getCandidates = useCallback(async () => {
    const count = await contract.methods.candidatesCount().call();
    const candidates = [];
    for (let i = 0; i < count; i++) {
      const { id, name, voteCount } = await contract.methods
        .candidates(i)
        .call();

      candidates.push({ id, name, voteCount });
    }
    setCandidates(candidates);
  }, [contract.methods]);

  // const handleInputChange = (e) => {
  //   if (/^\d+$|^$/.test(e.target.value)) {
  //     setInputValue(e.target.value);
  //   }
  // };

  // const read = async () => {
  //   console.log({ contract });
  //   const value = await contract.methods.read().call({ from: accounts[0] });
  //   setValue(value);
  // };

  // const write = async (e) => {
  //   if (e.target.tagName === "INPUT") {
  //     return;
  //   }
  //   if (inputValue === "") {
  //     alert("Please enter a value to write.");
  //     return;
  //   }
  //   const newValue = parseInt(inputValue);
  //   await contract.methods.write(newValue).send({ from: accounts[0] });
  // };

  useEffect(() => {
    getCandidates();
  }, [getCandidates]);

  return (
    <div className="btns">
      {candidates.map((candidate, index) => (
        <li key={index}>
          <div>Candidate name: {candidate.name}</div>
          {/* <div>Candidate votes: {candidate.votes}</div> */}
        </li>
      ))}
    </div>
  );
}

export default ContractBtns;
