import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import TokenAbi from "../Contractabi.json";
import "./ConnectedWallet.css";

export default function SendToken() {
  const [provider, setProvider] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [errormessage, setErrormessage] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const contractAddress = "0x3F636eA1474409916a2cCa10c381bB5ff9802547";

  const ConnectWallet = () => {
    if (window.ethereum) {
      // const providers = new ethers.providers.JsonRpcProvider(
      //   "https://rpc.ankr.com/polygon_mumbai"
      // );
      const providers = new ethers.providers.Web3Provider(window.ethereum);
      console.log("we"+window.ethereum);
      console.log("providers"+provider);
      setProvider(providers);
      if (provider) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            setUserAddress(result[0]);
            setTokenContract(
              new ethers.Contract(contractAddress, TokenAbi, provider)
            );
          });
      }
    } else {
      setErrormessage("Install Metamask! ");
    }
  };
  const fetchTokenDetails = async () => {
    if (tokenContract) {
      try {
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        // const balance = await tokenContract.balanceOf(userAddress);
        const totalSupply = await tokenContract.totalSupply();

        setTokenName(name);
        setTokenSymbol(symbol);
        setBalance(balance.toString());
        setTotalSupply(totalSupply.toString());
      } catch (error) {
        console.error("Error fetching token details:", error);
      }
    }
  };
  useEffect(() => {
    fetchTokenDetails();
  }, [tokenContract]);

  const transferERC20Tokens = async () => {
    if (provider) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(contractAddress, TokenAbi, signer);
        const amountInWei = ethers.utils.parseUnits(amount, "ether");
        console.log("amountWei:" + amountInWei);
        const tx = await contract.transfer(toAddress, amountInWei);
        const receipt = await tx.wait();
        alert(
          `Transaction send successfully! amount of ${amount} to Address:${toAddress}`
        );

        console.log("Transaction receipt:", receipt);
        return receipt;
      } catch (error) {
        console.error("Error transferring tokens:", error);
        throw new Error("Failed to transfer tokens: " + error.message);
      }
    }
    setAmount("");
    setToAddress("");
  };
  return (
    <div className="card1">
      {/* <h1>{tokenName} ERC-20 Wallet</h1> */}
      <button className="token" onClick={ConnectWallet}>
        Connect Wallet
      </button>
      <div className="cont3">
        <p id="t1">Address: </p>
        <p id="t2">{userAddress}</p>
      </div>
      <div className="cont3">
        <p id="t1">Token Name: </p>
        <p id="t2">{tokenName}</p>
      </div>
      <div className="cont3">
        <p id="t1">Token Symbol:</p>
        <p id="t2"> {tokenSymbol}</p>
      </div>
      {/* <div className="cont3">
        <p id="t1">Balance:</p>
        <p id="t2">{balance}</p>
      </div> */}
      <div className="cont3">
        <p id="t1">Total Supply:</p>
        <p id="t2">{totalSupply}</p>
      </div>
      <button className="connect2" onClick={fetchTokenDetails}>
        Refresh Token Details
      </button>

      <div className="cont3">
        <p id="t1">Amount: </p>
      </div>
      <input
        id="st_search"
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="cont3">
        <p id="t1">ToAddress: </p>
      </div>
      <input
        id="st_search"
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />
      <div></div>
      <button className="connect2" onClick={transferERC20Tokens}>
        Transfer
      </button>
      {errormessage}
    </div>
  );
}
