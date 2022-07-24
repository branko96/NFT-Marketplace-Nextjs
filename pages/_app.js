import "../styles/globals.css"
import { WagmiConfig, createClient, chain } from 'wagmi'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { MetaMaskConnector} from "wagmi/connectors/metaMask";

const client = createClient({
  autoConnect: true,
  connectors: [ new MetaMaskConnector({chains: [chain.ropsten]})],
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
