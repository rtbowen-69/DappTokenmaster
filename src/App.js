import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TokenMaster from './abis/TokenMaster.json'

// Config
import config from './config.json'

function App() {
  const [account, setAccount] = useState(null) //creats new data in the state

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) // returns current account connected to metamask
    setAccount(accounts[0])
    console.log(accounts[0])
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <h1>Hello, Dickheads!</h1> 
      <p>{account}

      </p>     
    </div>
  );
}

export default App;
