import { router } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react"
import Swal from "sweetalert2";
import { route } from "ziggy-js";

export default function OrderTypeDropdown({order, hasShipmentInfo}){


    const [openDropdown, setOpenDropdown] = useState(false);

    const switchOrderType = () => {

        let currentOrderType = order.order_type;

        let orderType = "walkin";
        
        if(currentOrderType === 'walkin'){
            orderType = "shipment"
        }else if(currentOrderType === 'shipment'){
            
            if (hasShipmentInfo) {
                Swal.fire({
                    icon: "warning",
                    title: "Cannot Switch to Walk-in",
                    text: "This order already has shipping information. Please remove the shipping information first before switching the order type to Walk-in.",
                    confirmButtonText: "Got it",
                });

                return;
            }
        }

        

        router.patch(route('order.switchOrderType', order.id), {
            order_type: orderType,
        }, {
            onSuccess: () => {

                setOpenDropdown(false);

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: `Switched to ${orderType}`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            },
        });
    }

    return (

        <div className="flex gap-x-2 items-center">
            <h1 className="text-sm font-semibold">Order Type: </h1>
            <div className="relative">
                <button 
                    className="flex gap-x-3 items-center px-5 py-2 border border-gray-400 rounded-md font-semibold bg-white cursor-pointer"
                    onClick={() => setOpenDropdown(!openDropdown)}
                >
                    {order.order_type === 'walkin' ? "Walk-in" : "Shipment"}
                    <span>
                        <ChevronDown strokeWidth={2} size={20} />
                    </span>
                </button>

                {openDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-40 z-20">
                        <button 
                            onClick={switchOrderType}
                            className="w-full flex gap-x-2 items-center text-left px-3 py-2 text-sm text-green-500 font-semibold hover:bg-gray-100 cursor-pointer"
                        >
                            {
                                `Switch to ${order.order_type === "walkin" ? "Shipment" : "Walk-in"}` 
                            }
                        </button>
                    </div>
                )}

            </div>
        </div>
        
        
            


    )


}