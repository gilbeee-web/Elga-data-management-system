import { ChevronLeft } from "lucide-react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import { formatDateTime } from "../../../Utils/formatDateTime";

export default function OrderHistoryTable({orderHistory, onClose}){

    return (

        <div className="">

            <div className="flex items-center">
                <button 
                    className="cursor-pointer"
                    onClick={onClose}
                >
                    <ChevronLeft />
                </button>
                
                <h1 className="font-bold">Order History</h1>
            </div>
            

            <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-gray-300 shadow-sm">
                <table className="w-full text-sm text-left border-collapse bg-white">
                    
                    <thead className="text-gray-600 uppercase text-xs border-b border-gray-300 sticky top-0 bg-white">
                        <tr>
                            <th className="p-3">Sold by</th>
                            <th className="p-3">Qty</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orderHistory && orderHistory.length > 0 ? (
                            orderHistory.map((history) => (
                                <tr 
                                    key={history.id}
                                    className="border-b border-gray-300"
                                >
                                    <td className="p-3">
                                        <h1>{history.sender_name}</h1>
                                        <p className="text-xs">
                                            {history.transaction_number}
                                        </p>
                                    </td>

                                    <td className="p-3">
                                        {history.item_qty}
                                    </td>

                                    <td className="p-3">
                                        {formatCurrency(history.item_price)}
                                    </td>

                                    <td className="p-3">
                                        {formatDateTime(history.completed_at)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td 
                                    colSpan={4} 
                                    className="p-5 text-center font-bold text-lg"
                                >
                                    No sold yet in this variant.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>

        



    )


}