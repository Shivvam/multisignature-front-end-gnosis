import Head from 'next/head'
import Image from 'next/image'

import WelcomeBar from '../components/welcome'  //To have a global welcome message based on the connection to the Wallet
 

export default function Home() {

  
  return (
    <div  >
      <Head>
        <title>Alpha Safe</title>
        <meta name="description" content="MultiSig Wallet for DAOs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>    
        
        <WelcomeBar />             
      
      </main>

      
    </div>
  )
}
