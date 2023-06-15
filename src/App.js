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
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null) //creats new data in the state

  const [tokenMaster, setTokenMaster] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum) // makes this a web three block chain connection
    setProvider(provider)

    const network = await provider.getNetwork() // gets chain id for current network so yuou can pass it to the address
    const address = config[network.chainId].TokenMaster.address
    const tokenMaster = new ethers.Contract(address, TokenMaster, provider)
    setTokenMaster(tokenMaster)

    const totalOccasions = await tokenMaster.totalOccasions()
    const occasions = [] // now for a for loop

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await tokenMaster.getOccasion(i) // run this code in this loop untin totalOccasions is equal to i
      occasions.push(occasion)
    }

    setOccasions(occasions)

    console.log(occasions)

    // refresh account on change
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) // returns current account connected to metamask after changing it
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)      
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount}/>
        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {occasions.map((occasion, index) => (
        <Card
          occasion={occasion}
          id={index + 1}
          tokenMaster={tokenMaster}
          provider={provider}
          account={account}
          toggle={toggle}
          setToggle={setToggle}
          setOccasion={setOccasion}
          key={index}
          />
        ))}
      </div>
      
      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
        />
        
      )}

    </div>
  );
}

export default App;
