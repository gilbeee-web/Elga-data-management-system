import { ShoppingBag, SquarePen, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import { route } from "ziggy-js";
import { useState } from "react";
import OrderHistoryTable from "./OrderHistoryTable";

export default function ProductModal({product, onClose, editProduct, deleteProduct}){

    console.log("Product variants: ", product.variants);

    const [orderHistory, setOrderHistory] = useState(null);

    const fetchOrderHistory = async (variant_id) => {

        console.log("Variant ID: ", variant_id);

        try {
            
            const response = await fetch(route('order.getVariantOrderHistory', variant_id));

            if(!response){
                alert("No response");
                return;
            }

            const result = await response.json();

            if(result){
                setOrderHistory(result);
            }

            console.log("Result: ", result);

        } catch (error) {
            console.log("error: ", error);
        }

    }


    return <>

        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center">

            <div className="w-full bg-white sm:max-w-md md:max-w-2xl lg:max-w-3xl rounded-md shadow p-5 pt-3 overflow-y-auto max-h-[90vh]">
                 
                {/* Header */}
                <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                    
                    <h1 className="text-xl font-semibold capitalize">Product Details</h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="flex justify-between items-start mt-3">

                    <div className="flex gap-x-5 items-center mt-3 px-5">

                        <div className="border border-gray-200 rounded-md flex-shrink-0 h-25 w-25 overflow-hidden bg-[#F7F7F4]">
                            {
                                product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                ) : (
                                    <div className="h-25 w-full flex justify-center items-center bg-black/10">
                                        <ShoppingBag size={40} color="gray"/>
                                    </div>
                                )
                            }
                            
                        </div>

                        <div>
                            <h1 className="uppercase font-semibold text-2xl">{product.name}</h1>
                            <p className="text-md font-semibold capitalize text-gray-500">{product.category}</p>
                        </div>

                    </div>

                    <div className="flex gap-x-3 items-center">
                        <button 
                            className="p-2 flex gap-x-2 items-center text-sm border border-gray-400 bg-white hover:bg-gray-100 rounded-md cursor-pointer font-semibold"
                            onClick={() => editProduct(product.id)}
                        >
                            <SquarePen size={20}/>
                            Edit
                        </button>
                        <button 
                            className="p-2 flex gap-x-2 items-center text-sm bg-red-500 rounded-md text-white font-semibold cursor-pointer hover:bg-red-400"
                            onClick={() => deleteProduct(product.id)}
                        >
                            <Trash2 size={20}/>
                            Delete
                        </button>
                    </div>
                </div>
                


                <div className="w-full mt-8">
                    {
                        !orderHistory ? (
                            <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-300 shadow-sm">
                                <table className="w-full text-sm text-left border-collapse bg-white">
                                    
                                    <thead className="sticky top-0 z-10 bg-white text-gray-600 uppercase text-xs border-b border-gray-300">
                                        <tr>
                                            <th className="p-3">Variants</th>
                                            <th className="p-3">Variant code</th>
                                            <th className="p-3">Price</th>
                                            <th className="p-3">Sold</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {product.variants && product.variants.length > 0 ? (
                                            product.variants.map((variant) => (
                                                <tr
                                                    key={variant.id}
                                                    className="border-b border-gray-300 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => fetchOrderHistory(variant.id)}
                                                >
                                                    <td className="p-3 font-semibold">
                                                        {variant.variant_name}
                                                    </td>

                                                    <td className="p-3 font-semibold">
                                                        {variant.product_code}
                                                    </td>

                                                    <td className="p-3 font-semibold">
                                                        {formatCurrency(variant.price)}
                                                    </td>

                                                    <td className="p-3 font-semibold">
                                                        {variant.sold}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="p-5 text-center font-bold text-lg"
                                                >
                                                    No product variants yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        ) : (
                            <OrderHistoryTable 
                                orderHistory={orderHistory} 
                                onClose={() => setOrderHistory(null)}
                            />
                        )
                    }
                    
                </div>
            </div>


        </div>
    
    
    </>

}