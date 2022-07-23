import {useCallback, useState} from "react"
import { useRouter } from "next/router"
import ipfsService from "../services/ipfsService"
import transactionsService from "../services/transactionsService"
import {useContractsStore} from "../store";
import shallow from "zustand/shallow";
import {showError, showSuccess} from "../utils/toastHelper";

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, setFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()
    const [nftMarketContract, nftContract] = useContractsStore((state) => [state.nftMarketContract, state.nftContract], shallow)

    const onChange = useCallback( (e) => {
        const file = e.target.files[0]
        ipfsService.createFile(file).then((filePath) => {
            setFileUrl(filePath)
        })
    }, [setFileUrl])

    const createItem = useCallback(async () => {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) {
            return
        }
        const data = JSON.stringify({ name, description, image: fileUrl })
        ipfsService.createFile(data).then((filePath) => {
            transactionsService.createItem(nftContract,nftMarketContract, filePath, formInput.price).then(() => {
                showSuccess("Item created successfully")
                router.push('/')
            }).catch((err) => {
                showError("Failed to create item")
                console.log(err)
            })
        })
    }, [formInput, nftContract,nftMarketContract, fileUrl, router])

    const createSale = async (url) => {

    }

    return (
        <div className="flex justify-center">
           <div className="w-1/2 flex flex-col pb-12">
               <input
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={(e) =>
                      setFormInput({...formInput, name: e.target.value})
                    }
               />
               <textarea
                   placeholder="Asset Description"
                   className="mt-8 border rounded p-4"
                   onChange={(e) =>
                       setFormInput({...formInput, description: e.target.value})
                   }
               />
               <input
                   placeholder="Asset Price"
                   className="mt-8 border rounded p-4"
                   onChange={(e) =>
                       setFormInput({...formInput, price: e.target.value})
                   }
               />
               <input
                   type="file"
                   name="asset"
                   placeholder="Asset Price"
                   className="my-4"
                   onChange={onChange}
               />
               {fileUrl && <img src={fileUrl} className="rounded mt-4" width="350" />}
               <button
                   onClick={createItem}
                   className="bg-pink-500 font-bold mt-4 p-4 shadow-lg text-white rounded"
               >
                   Create Item
               </button>
           </div>
        </div>
    )
}
