import {useCallback, useEffect, useState} from "react"
import { useRouter } from "next/router"
import nftHelper from "../utils/nftHelper";
import {ethers} from "ethers";
import transactionsService from "../services/transactionsService";
import {useAccount} from "wagmi";
import {useContractsStore} from "../store";
import {showError, showSuccess} from "../utils/toastHelper";
import BidsList from "../components/BidsList";

export default function ItemDetail() {
    const [item, setItem] = useState({})
    const [bids, setBids] = useState([])
    const [itemOwner, setItemOwner] = useState("")
    const [bidAmount, setBidAmount] = useState(0)
    const { id } = useRouter().query
    const { isConnected, address } = useAccount()
    const nftMarketContract = useContractsStore((state) => state.nftMarketContract)

    const handleBid = useCallback(async () => {
        try{
            if (bidAmount === 0) {
                showError("Please enter a valid bid amount")
                return
            }
            // TODO: change to correct provider in testnet
            const provider = new ethers.providers.JsonRpcProvider()
            await transactionsService.createBid(nftMarketContract, id, bidAmount)
            showSuccess("Bid created successfully")
            const itemBids = await nftHelper.getNftBids(id, provider)
            setBids(itemBids)
            setBidAmount(0)
        } catch (e) {
            showError("Failed to create bid")
        }
    }, [id, bidAmount, setBidAmount])

    useEffect(() => {
        (async () => {
            try {
                // TODO: change to correct provider in testnet
                const provider = new ethers.providers.JsonRpcProvider()
                if (!id) return
                const itemObject = await nftHelper.getMarketItemById(id, provider)
                const itemDetails = await nftHelper.getNftDetails(itemObject.tokenId, provider)
                const itemBids = await nftHelper.getNftBids(itemObject.tokenId, provider)
                setItem(itemDetails)
                setItemOwner(itemObject.owner)
                setBids(itemBids)
            } catch (error) {
                showError("Failed to get item data")
            }
        })()
    }, [id, setItem, setItemOwner, setBids])

    return (
        <div className="flex justify-center">
           <div className="w-1/2 flex flex-col pb-12">
               {item?.image && <img src={item?.image} className="rounded mt-4" width="350" />}
               <div>{item?.description}</div>
               <h2>Bid</h2>
               <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)}/>
               <button disabled={!isConnected || itemOwner === address} onClick={handleBid} className={`w-full bg-pink-500 text-white font-bold py-2 px-12 rounded ${!isConnected || itemOwner === address && "disabled:opacity-50"}`}>Bid</button>
               <BidsList
                   bids={bids}
                   itemName={item?.name}
                   handleAcceptBid={() => ({})}
                   showAcceptButton={false}
                   userAddress={address}
               />
           </div>
        </div>
    )
}
