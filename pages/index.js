import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import nftHelper from "../utils/nftHelper"
import {RPC_ADDRESS} from "../constants/rpcAddress";

export default function Home() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()
    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        // TODO: change address in testnet
        const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS)
        // const provider = new ethers.providers.JsonRpcProvider()
        const nfts = await nftHelper.marketItems(provider)
        setNfts(nfts)
        setLoadingState('loaded')
    }

    if (loadingState === 'loaded' && !nfts.length) {
        return <h1 className="px-20 py-10 text-3xl">No items in Marketplace</h1>
    }

    if (loadingState === 'not-loaded') {
        return <div>Loading...</div>
    }

    return (
        <div className="flex items-stretch justify-center">
            <div className="px-4" style={{ maxWidth: '1600px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {nfts.map((nft, index) => (
                        <div key={index} className="border shadow rounded-xl overflow-hidden">
                            <div className="flex-1">
                                <img src={nft.image} alt={nft.name} className="w-full h-72 object-cover" />
                            </div>
                            <div className="flex-1 p-4 justify-end">
                                <p style={{height: '70px'}} className="text-2xl font-semibold">{nft.name}</p>
                                <div style={{height: '70px', overflow: 'hidden'}}>
                                    <p className="text-gray-700">{nft.description}</p>
                                </div>
                                <div className="flex-1 justify-end">
                                    <div className="flex justify-center">
                                        <h1 className="text-2xl">{nft.price} ETH</h1>
                                    </div>
                                    <div className="p-4">
                                        <button
                                            onClick={() => router.push({
                                                pathname: '/item-detail',
                                                query: { id: nft.itemId }
                                            })}
                                            className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
