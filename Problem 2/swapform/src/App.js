import { ReactComponent as WBTC } from './WBTC.svg';
import { ReactComponent as ETH } from './ETH.svg';
import { ReactComponent as USDC } from './USDC.svg';
import React, { useState, useEffect } from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";

import './App.css';

function App() {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedIcon1, setSelectedIcon1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [selectedIcon2, setSelectedIcon2] = useState('');
  const [oneto1exchangeRates, set1to1ExchangeRates] = useState('');
  const [showExchangeRate, setShowExchangeRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payActive, setPayActive] = useState(false);
  const [receiveActive, setReceiveActive] = useState(false);
  

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const loader = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false);
      setSelectedOption1('')
      setSelectedOption2('')
      setSelectedIcon1('')
      setSelectedIcon2('')
      set1to1ExchangeRates('')
      setShowExchangeRate(false)
      setPayInput('')
      setReceive('')
    }, 5000);
  };

  const fetchExchangeRates = async () => {
    try {
      const data = require('./prices.json');
      setExchangeRates(data);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const toggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
  };

  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

  const handleOptionClick1= (option, icon) => {
    setSelectedOption1(option);
    setSelectedIcon1(icon);
    setIsOpen1(false);
  };

  const handleOptionClick2 = (option, icon) => {
    setSelectedOption2(option);
    setSelectedIcon2(icon);
    setIsOpen2(false);
  };

  const [payInput, setPayInput] = useState('');

  const handlePayInputChange = (e) => {
    const { value } = e.target;
    setPayInput(value);
    setPayActive(true);
    setReceiveActive(false);
    if (selectedIcon2 != '') {
      const selectedCurrency = selectedIcon1 ;
      const selectedCurrency2 = selectedIcon2 ;
      const exchangeRateEntry = exchangeRates.find(entry => entry.currency === selectedCurrency);
      const exchangeRateEntry2 = exchangeRates.find(entry => entry.currency === selectedCurrency2);

      if (exchangeRateEntry) {
        const receiveAmount = String((value * exchangeRateEntry.price) / exchangeRateEntry2.price);
        const exchangefor1 = String((1 * exchangeRateEntry.price) / exchangeRateEntry2.price);
        set1to1ExchangeRates(exchangefor1)
        setReceive(receiveAmount);
        setTimeout(() => {
          setShowExchangeRate(parseFloat(value) > 0);
        }, 1000);
      } else {
        console.log(`Exchange rate not found for ${selectedCurrency}`);
      }
    }
  };
  
  const [receiveInput, setReceive] = useState('');

  const handleReceiveInputChange = (e) => {
    const { value } = e.target;
    setReceive(value);
    setReceiveActive(true);
    setPayActive(false);

    const selectedCurrency = selectedIcon1 ;
    const selectedCurrency2 = selectedIcon2 ;
    const exchangeRateEntry = exchangeRates.find(entry => entry.currency === selectedCurrency);
    const exchangeRateEntry2 = exchangeRates.find(entry => entry.currency === selectedCurrency2);

    if (selectedIcon1 != '') {
      if (exchangeRateEntry) {
        const receiveAmount = String((value * exchangeRateEntry2.price) / exchangeRateEntry.price);
        const exchangefor1 = String((1 * exchangeRateEntry2.price) / exchangeRateEntry.price);
        set1to1ExchangeRates(exchangefor1)
        setPayInput(receiveAmount);
        setTimeout(() => {
          setShowExchangeRate(parseFloat(value) > 0);
        }, 1000);
      } else {
        console.log(`Exchange rate not found for ${selectedCurrency}`);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      <div className= "input-container">
        <h4>Just Swap</h4>
        <div className='box-container'>
          <div className="App-box">
            <div className='Box-h8'>
              <h8>Pay</h8>
            </div>
            <input
              type="text"
              id="pay"
              name="pay"
              inputMode='decimal'
              pattern= "^[0-9]*[.,]?[0-9]*$"
              value={payInput}
              onChange={handlePayInputChange}
              autoCorrect='off'
              autoComplete='off'
              placeholder='0'
              minLength={1}
              maxLength={50}
              onKeyPress={(e) => {
                const charCode = e.which ? e.which : e.keyCode;
                if ((charCode !== 46 && charCode !== 8 && (charCode < 48 || charCode > 57)) || (charCode === 46 && e.target.value.includes('.'))) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="dropdown-container">
            <button onClick={toggleDropdown1} className="dropdown-button"  onChange={handlePayInputChange}>
              {selectedIcon1 === 'WBTC' && <WBTC />}
              {selectedIcon1 === 'ETH' && <ETH />}
              {selectedIcon1 === 'USDC' && <USDC />}
              <h3>
                {selectedOption1}
              </h3>
            </button>
            {isOpen1 && (
              <div className="dropdown-menu" onChange={handlePayInputChange}>
                <ul>
                  <li onClick={() => handleOptionClick1('WBTC', 'WBTC')}>
                    <WBTC /> WBTC
                  </li>
                  <li onClick={() => handleOptionClick1('ETH', 'ETH')}>
                    <ETH /> ETH
                  </li>
                  <li onClick={() => handleOptionClick1('USDC', 'USDC')}>
                    <USDC /> USDC
                  </li>
                </ul>
              </div>
           )}
          </div>
        </div>

        <div className='box-container'>
           <div className="App-box">
              <div className='Box-h8'>
                <h8>Receive</h8>
              </div>
              <input
                type="text"
                id="receive"
                name="receive"
                inputMode='decimal'
                pattern= "^[0-9]*[.,]?[0-9]*$"
                value={receiveInput}
                onChange={handleReceiveInputChange}
                autoCorrect='off'
                autoComplete='off'
                placeholder='0'
                minLength={1}
                maxLength={50}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if ((charCode !== 46 && charCode !== 8 && (charCode < 48 || charCode > 57)) || (charCode === 46 && e.target.value.includes('.'))) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="dropdown-container">
            <button onClick={toggleDropdown2} className="dropdown-button" onChange={handleReceiveInputChange} >
              {selectedIcon2 === 'WBTC' && <WBTC />}
              {selectedIcon2 === 'ETH' && <ETH />}
              {selectedIcon2 === 'USDC' && <USDC />}
              <h3>
                {selectedOption2}
              </h3>
            </button>
            {isOpen2 && (
              <div className="dropdown-menu"  onChange={handleReceiveInputChange}>
                <ul>
                  <li onClick={() => handleOptionClick2('WBTC', 'WBTC')}>
                    <WBTC /> WBTC
                  </li>
                  <li onClick={() => handleOptionClick2('ETH', 'ETH')}>
                    <ETH /> ETH
                  </li>
                  <li onClick={() => handleOptionClick2('USDC', 'USDC')}>
                    <USDC /> USDC
                  </li>
                </ul>
              </div>
            )}
          </div>   
        </div>  

        <div className='con-rate'>
            {showExchangeRate && (
              <text>Conversion rate</text>
            )}
            {showExchangeRate && payActive && (
              <h5>1 {selectedIcon1} = {oneto1exchangeRates} {selectedIcon2}</h5>
            )}
            {showExchangeRate && receiveActive &&  (
              <h5>1 {selectedIcon2} = {oneto1exchangeRates} {selectedIcon1}</h5>
            )}
        </div>  
        <button className='connect-button' onClick={loader} >
          {loading ? (
            <PacmanLoader  color="rgb(74, 74, 119)" size="15"/>
          ) : (
            "Swap"
          )}
        </button>
      </div> 

      
      </header>
    </div>
  );
}

export default App;
