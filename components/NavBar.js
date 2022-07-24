import Link from "next/link";
import {useAccount, useConnect, useContract, useDisconnect, useSigner} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {useContractsStore} from "../store";
import {useCallback, useEffect} from "react";
import {nftAddress, nftMarketAddress} from "../config";
import NFT from "../artifacts/NFT.json";
import NFTMarket from "../artifacts/NFTMarket.json";


export const useIsMounted = () => {
    const [mounted, setMounted] = React.useState(false)
    useEffect(() => setMounted(true), [])
    return mounted
}

function NavBar() {
    const { address } = useAccount()
    const isMounted = useIsMounted()
    const [{ data, error }, connect] = useConnect()
    /*const { data, status, connect, error } = useConnect({
        chainId: 3,
        connector: new InjectedConnector({ chains: [3], options: {} }),
    })*/
    console.log(error, data, status);
    const { disconnect } = useDisconnect()
    const {data: provider} = useSigner()
    const setContracts = useContractsStore((state) => state.setContracts)
    const nftContract = useContract({
        addressOrName: nftAddress,
        contractInterface: NFT.abi,
        signerOrProvider: provider
    })
    const nftMarketContract = useContract({
        addressOrName: nftMarketAddress,
        contractInterface: NFTMarket.abi,
        signerOrProvider: provider
    })

    useEffect(() => {
        if (nftContract.signer && nftMarketContract.signer) {
            setContracts(nftMarketContract, nftContract)
        }
    }, [setContracts, nftMarketContract, nftContract, provider])

    const handleConnect = useCallback(async () => {
        try {
            connect()
            setContracts(nftMarketContract, nftContract)
        }catch (e) {
            console.log(e);
        }
    }, [connect])

    return (    <nav className="border-b p-6">
        <p className="text-4xl font-bold">Marketplace NFT</p>
        <div className="flex mt-4">
            <Link href="/">
                <a className="mr-6 text-indigo-500">Home</a>
            </Link>
            {address && (
                <>
                    <Link href="/create-item">
                        <a className="mr-6 text-indigo-500">Sell Digital Asset</a>
                    </Link>
                    <Link href="/my-assets">
                        <a className="mr-6 text-indigo-500">My Digital Assets</a>
                    </Link>
                    <Link href="/creator-dashboard">
                        <a className="mr-6 text-indigo-500">Creator Dashboard</a>
                    </Link>
                </>
            )}

            <button onClick={() => disconnect()}>Disconnect</button>
            {address ? (<div>
                Connected to {address}
                <button onClick={() => disconnect()}>Disconnect</button>
            </div>) : (
                <div>
                    <button onClick={handleConnect}>Connect</button>
                </div>
            )}
            {data.connectors.map((x) => (
                <button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
                    {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
                    {!x.ready && ' (unsupported)'}
                </button>
            ))}

            {error && <div>{error?.message ?? 'Failed to connect'}</div>}
        </div>
    </nav>)
}

export default NavBar;
