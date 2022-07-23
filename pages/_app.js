import "../styles/globals.css"
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import {RPC_ADDRESS} from "../constants/rpcAddress";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
  /*  provider: getDefaultProvider({
    rpcUrl: RPC_ADDRESS,
    chainId: 3
  }),*/
})

function MyApp({ Component, pageProps }) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }

    return <div>
      <WagmiConfig client={client}>
        <ToastContainer/>
        <NavBar/>
        <Component {...pageProps} />
      </WagmiConfig>
    </div>
}

export default MyApp
