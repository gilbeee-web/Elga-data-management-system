import { router } from "@inertiajs/react";
import { Ban, ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { route } from "ziggy-js";

export default function OrderStatusDropdown({order}){

    const orderStatusDisplay = {
        awaiting_payment: "Unpaid",
        payment_confirmed: "Partial Payment",
        awaiting_shipping_fee: "Awaiting Shipping Fee"
    };

    const statusClasses = {
        draft: "bg-gray-500",
        awaiting_shipping_fee: "bg-blue-500",
        awaiting_payment: "bg-red-500",
        payment_confirmed: "bg-blue-500",
        processing: "bg-yellow-500",
        shipped: "bg-green-500",
        cancelled: "bg-gray-800"
    };

    const [openStatusSettings, setOpenStatusSettings] = useState(false);

    const handleOrderStatus = async () => {

        let title = "";
        let message = "";
        const isDraft = order.order_status === 'draft';

        if (isDraft) {
            title = "Delete Order";
            message = "This draft has no payments or confirmed details. Delete it permanently?";
        }else if (order.order_status === 'cancelled') {
            title = "Delete Cancelled Order";
            message = "This will permanently delete this cancelled order and its data. This cannot be undone.";
        } else if (order.order_status === 'shipped') {
            title = "Cannot Cancel";
            message = "Shipped orders can't be cancelled directly. Please process a return/refund instead.";
        } else {
            title = "Cancel Order";
            message = "This will mark the order as cancelled, but the data will remain stored in the system.";
        }

        // block the action entirely for shipped/cancelled — just show info, no confirm needed
        if (order.order_status === 'shipped') {
            await Swal.fire({ title, text: message, icon: "info" });
            return;
        }

        const result = await Swal.fire({
            title,
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        // actually perform the action
        if (isDraft || order.order_status === 'cancelled') {
            router.delete(route('order.destroy', order.id), {
                onSuccess: () => Swal.fire('Deleted!', 'The draft has been removed.', 'success'),
            });
        } else {
            router.patch(route('order.cancel', order.id), {}, {
                onSuccess: () => Swal.fire('Cancelled!', 'The order has been cancelled.', 'success'),
            });
        }
    };


    return(
        <div className="flex gap-x-3 items-center">
            <h1 className="text-sm font-semibold">Status:</h1>

            <div className="relative">
                <button 
                    className={`flex gap-x-3 items-center px-5 py-2 rounded-md text-white capitalize font-semibold cursor-pointer
                        ${statusClasses[order.order_status] || "bg-gray-500"}`
                    }
                    onClick={() => setOpenStatusSettings(!openStatusSettings)}
                >
                    {orderStatusDisplay[order.order_status] ?? order.order_status}
                    <span>
                        <ChevronDown strokeWidth={2} size={20} />
                    </span>
                </button>

                {openStatusSettings && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-40 z-20">
                        <button 
                            onClick={handleOrderStatus}
                            className="w-full flex gap-x-2 items-center text-left px-3 py-2 text-sm text-red-500 font-semibold hover:bg-gray-100 cursor-pointer"
                        >
                            {
                                order.order_status === 'draft' || order.order_status === 'cancelled'
                                ? <Trash2 size={20} color="red"/>
                                : <Ban size={20} />
                            }

                            {order.order_status === 'draft' || order.order_status === 'cancelled'
                                ? "Delete Order" 
                                : order.order_status === 'shipped' 
                                    ? "No Actions Available"
                                    : "Cancel Order"
                            }
                        </button>
                    </div>
                )}

            </div>
            
        </div>
    )
}