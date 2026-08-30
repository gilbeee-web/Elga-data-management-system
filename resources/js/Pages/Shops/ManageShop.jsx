import { ChevronLeft, Plus, Store } from "lucide-react";
import { useEffect, useState } from "react";
import ShopForm from "./Components/ShopForm";
import ShopCard from "./Components/ShopCard";

export default function ManageShop({onClose, shops, onShopsChange, isFetchingShopData, isAddShop}){

    console.log("Is Add Shop: ", isAddShop);
    console.log("Shops: ", shops);

    const [openShopForm, setOpenShopForm] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [mode, setMode] = useState("create");

    const handleCardAction = (action, shop) => {

        if(action === 'edit' && shop){
            setSelectedShop(shop);
            setMode("edit");
            setOpenShopForm(true);
        }else if(action === 'deactivate'){
            console.log("Deactivate Shop");
        }
        
    }

    useEffect(() => {

        setOpenShopForm(isAddShop);

    }, [isAddShop])



    return (
        
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
        
            <div className="w-full bg-white sm:max-w-md md:max-w-xl lg:max-w-lg rounded-md shadow p-3 pt-3 overflow-y-auto min-h-[50vh]">

                {/* Header */}
                <div className="w-full flex justify-between items-center border-b border-gray-300">
                    
                    <div className="flex gap-x-2 items-center">
                        
                        <Store size={20} />

                        <h1 className="text-lg font-bold capitalize">
                            Manage Stores
                        </h1>
                    </div>
                    

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {
                    !openShopForm ? (
                        <div className="mt-3">

                            <div className="flex justify-between items-center">
                                <h1 className="text-lg font-semibold">
                                    Store List
                                </h1>

                                <button 
                                    className="flex gap-x-2 items-center px-2 py-1 rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold cursor-pointer"
                                    onClick={() => setOpenShopForm(true)}
                                >
                                    <Plus size={15} strokeWidth={3}/>
                                    Add store
                                </button>
                            </div>


                            <div className="mt-5 flex flex-col gap-y-2">
                                {
                                    isFetchingShopData ? (
                                        <div className="w-full flex items-center justify-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                                                <span className="text-sm text-gray-500 font-medium">Fetching stores...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        shops.length > 0 ? (
                                            shops.map((shop) => (
                                                <ShopCard key={shop.id} shop={shop} onClickAction={handleCardAction}/>
                                            ))
                                        ) : (
                                            <div className="w-full h-full flex justify-center items-center">
                                                <h1 className="font-semibold text-xl">No store added yet.</h1>
                                            </div>
                                        )
                                        
                                    )
                                    
                                }
                            </div>
                            
                        </div>
                    ) : (
                        <ShopForm 
                            onClose={() => {
                                setOpenShopForm(false);
                                setMode("create");
                                setSelectedShop(null);
                            }}
                            shop={selectedShop}
                            mode={mode}
                            onSuccess={onShopsChange}
                        />
                    )
                }
                


                




            </div>
        </div>



    )

}