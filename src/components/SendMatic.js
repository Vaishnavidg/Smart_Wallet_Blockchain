import React, { useState } from "react";
import "./ConnectedWallet.css";

export default function SendMatic() {
  const [errormessage, setErrormessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState(null);
  const accountChange = (AccountName) => {
    setDefaultAccount(AccountName);
    // getBalance(AccountName);
  };
  const ConnectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChange(result[0]);
        });
    } else {
      setErrormessage("Install Metamask! ");
    }
  };
  async function sendTransaction(event) {
    event.preventDefault();

    console.log("amount", amount);

    if (!amount || isNaN(amount)) {
      console.log("Invalid amount.");
      return;
    }

    let params = [
      {
        from: defaultAccount,
        to: toAddress,
        value: Number(Math.pow(10, 18) * amount).toString(16),
      },
    ];

    try {
      let result = await window.ethereum.request({
        method: "eth_sendTransaction",
        params,
      });
      alert(
        `Transaction send successfully! amount of ${amount} to Address:${toAddress}`
      );
      console.log("Transaction result:", result);
    } catch (err) {
      console.log("Error sending transaction:", err);
    }
    setToAddress("");
    setAmount("");
    setDefaultAccount(null);
  }

  return (
    <div className="card">
      <button className="token" onClick={ConnectWallet}>
        Connect Wallet
      </button>
      <div className="cont3">
        <p id="t1">Address</p>
      </div>
      <div className="cont3">
        <p id="t2">{defaultAccount}</p>
      </div>
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
      <button className="connect2" onClick={sendTransaction}>
        Send Matic
      </button>

      {errormessage}
    </div>
  );
}
