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
  const [userTokenBalance, setUserTokenBalance] = useState(0);

  const contractAddress = "0x3F636eA1474409916a2cCa10c381bB5ff9802547";

  const ConnectWallet = () => {
    if (window.ethereum) {
      const providers = new ethers.providers.Web3Provider(window.ethereum);
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
  // Function to fetch the user's token balance
  const fetchUserTokenBalance = async () => {
    if (tokenContract && userAddress) {
      try {
        // Call the balanceOf function of the contract to get the user's token balance
        const balance = await tokenContract.callStatic.balanceOf(userAddress);
        setUserTokenBalance(balance.toString());
      } catch (error) {
        console.error("Error fetching user's token balance:", error);
        setErrormessage("Failed to fetch user's token balance");
      }
    }
  };
  useEffect(() => {
    fetchUserTokenBalance();
  }, [tokenContract, userAddress]);

  const fetchTokenDetails = async () => {
    if (tokenContract) {
      try {
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();

        // const balance = await tokenContract.balanceOf(userAddress);
        const totalSupply = await tokenContract.totalSupply();

    //Convert the balance and totalSupply to numbers and remove extra zeroes
      const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, "ether"));
      const formattedTotalSupply = parseFloat(ethers.utils.formatUnits(totalSupply, "ether"));

        setTokenName(name);
        setTokenSymbol(symbol);
        setBalance(formattedBalance);
        setTotalSupply(formattedTotalSupply);
    
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
        const contract = new ethers.Contract(contractAddress, TokenAbi, signer);

        const balance = await tokenContract.callStatic.balanceOf(userAddress);
        
        const amountInWei = ethers.utils.parseUnits(amount, "ether");
//lt is to check balance is less than amountInWei
        if (balance.lt(amountInWei)) {
          setErrormessage("Insufficient balance for the transfer");
          return;
        }
        console.log("amountWei:" + amountInWei);
        const tx = await contract.transfer(toAddress, amountInWei);
        const receipt = await tx.wait();
        console.log(receipt);
        alert(
          `Transaction send successfully! amount of ${amount} to Address:${toAddress}`
        );

        console.log("Transaction receipt:", receipt);
        return receipt;
      } catch (error) {
        console.error("Error transferring tokens:", error);
        throw new Error("Failed to transfer tokens: " + error.message);
        // setErrormessage("Failed to transfer tokens: " + error.message);
     
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
      <div className="cont3">
        <p id="t1">TokenBalance:</p>
        <p id="t2">{userTokenBalance}</p>
      </div>
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
      <h6 id="t2">
      {errormessage}
      </h6>
      
    </div>
  );
}
