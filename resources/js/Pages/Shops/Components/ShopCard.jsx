import { Ban, EllipsisVertical, Pen, Store } from "lucide-react"
import { useEffect, useState } from "react";

export default function ShopCard({shop, onClickAction}){

    console.log("Shop Card: ", shop);

    const [openShopOptions, setOpenShopOptions] = useState(false);

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
            className="border border-gray-400 rounded-xl p-3 flex justify-between items-center shadow-md bg-white"
        >
            <div className="flex gap-x-2 items-center">
                
                <div>
                    {
                        shop.image ? (
                            <img src={`/storage/${shop.image}`} alt="Shop Cover Photo" className="object-contain w-10 h-10"/>
                        ) : (
                            <Store size={30}/>
                        )
                    }
                </div>
                
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold">{shop.name}</h1>
                    <p className="text-sm text-gray-400">
                        {shop.location}
                    </p>
                </div>
            </div>

            
            <div className="relative">
                <button 
                    className="cursor-pointer"
                    onClick={() => setOpenShopOptions(!openShopOptions)}
                >
                    <EllipsisVertical size={20}/>
                </button>
                {
                    openShopOptions && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-40 z-20">
                            <button 
                                className="w-full flex gap-x-2 items-center text-left px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                onClick={() => onClickAction("edit", shop)}
                            >
                                <Pen size={15}/>
                                Edit
                            </button>

                            <button 
                                className="w-full flex gap-x-2 items-center text-left px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                onClick={() => onClickAction("deactivate", shop)}
                            >
                                <Ban size={15}/>
                                Deactivate
                            </button>
                        </div>
                    )
                }
                

            </div>



        </div>
        
    )


}