import React, { useEffect, useState } from 'react';
import './Accounts.css';

function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/accounts')
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  const shortenKey = (key) => {
    return `${key.slice(0, 20)}...${key.slice(-20)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="accounts-container">
      <h2>Accounts</h2>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Public Key</th>
            <th>Private Key</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td>{account.name}</td>
              <td>
                {shortenKey(account.public_key)}
                <button onClick={() => copyToClipboard(account.public_key)}>Copy</button>
              </td>
              <td>
                {shortenKey(account.private_key)}
                <button onClick={() => copyToClipboard(account.private_key)}>Copy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Accounts;
