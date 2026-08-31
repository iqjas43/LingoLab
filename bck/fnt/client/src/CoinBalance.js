import React from 'react';
import './CoinBalance.css';

export default function CoinBalance({ lingoCoins }) {
  return (
    <div className="coin-balance">
      <span className="coin-icon">🪙</span>
      <span className="balance-amount">{lingoCoins ?? 0}</span>
    </div>
  );
}
