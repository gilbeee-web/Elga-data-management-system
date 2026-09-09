import { EllipsisVertical, LockOpen, Lock, Pen, Store } from "lucide-react"
import { useEffect, useState } from "react";

export default function ShopCard({shop, onClickAction}){

    console.log("Shop Card: ", shop);

    const [openShopOptions, setOpenShopOptions] = useState(null);

    useEffect(() => {

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOpenShopOptions(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };


    }, [openShopOptions]);

    return(
        <div 
            className="border border-gray-400 rounded-xl p-3 flex justify-between items-center shadow-sm bg-white"
        >
            <div className="flex gap-x-2 items-center">
                
                <div>
                    {
                        shop.cover_photo ? (
                            <img src={`/storage/${shop.cover_photo}`} alt="Shop Cover Photo" className="object-contain w-10 h-10 rounded-full"/>
                        ) : (
                            <Store size={30}/>
                        )
                    }
                </div>
                
                <div className="flex flex-col">
                    
                    <div className="flex items-center gap-x-2">
                        <h1 className="text-lg font-semibold">
                            {shop.name}
                        </h1>

                        {shop.is_active ? (
                            <span className="flex items-center gap-x-1.5 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-x-1.5 text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                Inactive
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">
                        {shop.location}
                    </p>
                </div>
            </div>

            
            <div className="relative">
                <button 
                    className="cursor-pointer"
                    onClick={() => setOpenShopOptions(
                        openShopOptions === shop.id ? null : shop.id
                    )}
                >
                    <EllipsisVertical size={20}/>
                </button>
                {
                    openShopOptions === shop.id && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-sm border border-gray-200 py-1 w-40 z-20">
                            <button 
                                className="w-full flex gap-x-2 items-center text-left px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                onClick={() => onClickAction("edit", shop)}
                            >
                                <Pen size={15}/>
                                Edit
                            </button>

                            <button 
                                className="w-full flex gap-x-2 items-center text-left px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setOpenShopOptions(false);
                                    onClickAction("changeStatus", shop);
                                }}
                            >
                                {shop.is_active ? (
                                    <>
                                        <Lock size={15}/>
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <LockOpen size={15}/>
                                        Activate
                                    </>
                                )}
                            </button>
                        </div>
                    )
                }
                

            </div>



        </div>
        
    )


}