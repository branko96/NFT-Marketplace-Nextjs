import {useCallback, useEffect, useState} from "react"
import { ethers } from "ethers"
import web3modal from "web3modal"
import nftHelper from "../utils/nftHelper"
import {useContractsStore} from "../store";
import shallow from "zustand/shallow";
import ipfsService from "../services/ipfsService";
import transactionsService from "../services/transactionsService";
import {showError, showSuccess} from "../utils/toastHelper";

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [nftMarketContract, nftContract] = useContractsStore((state) => [state.nftMarketContract, state.nftContract], shallow)

    useEffect(() => {
        (async () => {
            nftHelper.myItems(nftMarketContract, nftContract).then(items => {
                setNfts(items)
                setLoadingState('loaded')
            })
        })()
    }, [nftMarketContract, nftContract])

    const publishItem = useCallback(async (nftSelected) => {
        const tokenUrl = await nftContract.tokenURI(nftSelected.tokenId)
        console.log(tokenUrl);
        transactionsService.createItem(nftContract,nftMarketContract, tokenUrl, "15").then(() => {
            showSuccess("Item published successfully")
        }).catch((err) => {
            showError("Failed to publish item")
            console.log(err)
        })
    }, [nftContract,nftMarketContract])

    if (loadingState === 'loaded' && !nfts.length) {
        return <h1 className="px-20 py-10 text-3xl">No items</h1>
    }

    return (
        <div className="flex justify-center">
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4">
                    {nfts.map((nft, index) => (
                        <div key={index} className="border shadow rounded-xl overflow-hidden">
                            <img src={nft.image} alt={nft.name} className="rounded" />
                            <div className="p-4 bg-black">
                                <p className="text-2xl font-bold text-white">Price - {nft.price} MATIC</p>
                            </div>
                            {nft.sold && <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => publishItem(nft)}
                            >
                                Publish to sell
                            </button>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
