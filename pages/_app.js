import "../styles/globals.css"
import {WagmiConfig, createClient, configureChains, defaultChains, allChains, chain} from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector} from "wagmi/connectors/metaMask";
import {InjectedConnector} from "wagmi/connectors/injected";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

import "regenerator-runtime/runtime";

const supportedChainIds = [80001, 3];

const connectors = {
  injected: {},
};

const client = createClient({
  autoConnect: true,
  connectors: [ new MetaMaskConnector({chains: [chain.ropsten]})],
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
        <ThirdwebWeb3Provider
            supportedChainIds={supportedChainIds}
            connectors={connectors}
        >
        <ToastContainer/>
        <NavBar/>
        <Component {...pageProps} />
        </ThirdwebWeb3Provider>
      </WagmiConfig>
    </div>
}

export default MyApp
