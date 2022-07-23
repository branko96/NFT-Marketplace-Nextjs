import "../styles/globals.css"
import {WagmiConfig, createClient, configureChains, defaultChains, allChains} from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import {InjectedConnector} from "wagmi/connectors/injected";

const alchemyId = "fwqsfpfhYaNJuhfwcqiRZoXj1eFSAdBg"

const { chains, provider } = configureChains(allChains, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
])

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [new InjectedConnector({ chains })]
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
