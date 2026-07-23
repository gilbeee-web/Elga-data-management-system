import { useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import { useEffect, useState } from "react";

export default function ShippingForm({shippingInfo, order, changeTab}){

    const {data, setData, post, processing, error} = useForm({
        container_type: "",
        container_size: "",
        raw_shipping_fee: null,
        container_fee: null,
        tracking_number: ""
    });

    const [totalShippingFee, setTotalShippingFee] = useState(null);
    
    
    const saveShippingInfo = (e) => {
        
        e.preventDefault();

        post(route("order.saveShippingInfo", order), {

            onSuccess: () => {
                changeTab("payment");
            },

            onError: (errors) => {
                console.log("Errors: ", errors)
            }
        });

    }

    useEffect(() => {

        const total_sf = data.raw_shipping_fee + data.container_fee;

        console.log("Total SF: ", data.raw_shipping_fee);

        setTotalShippingFee(total_sf);

    }, [data.raw_shipping_fee, data.container_fee]);

    useEffect(() => {

        if(shippingInfo){

            setData({
                container_type: shippingInfo.container_type,
                container_size: shippingInfo.container_size,
                raw_shipping_fee: Number(shippingInfo.raw_shipping_fee),
                container_fee: Number(shippingInfo.container_fee),
                tracking_number: shippingInfo.tracking_number
            });

            const total_sf = Number(shippingInfo.raw_shipping_fee) + Number(shippingInfo.container_fee);
            setTotalShippingFee(total_sf);
        }

    }, [shippingInfo]);

    useEffect(() => {
        console.log("Shipping info Data:", data);
    }, [data]);




    return <>

        <form 
            onSubmit={saveShippingInfo}
            className="flex flex-col gap-y-3"
        >  
            <div className="rounded-md bg-white h-110 p-5">

                <h1 className="text-xl font-bold">Shipping Information</h1>

                <div className="mt-8 grid grid-cols-2 gap-5">

                    <div className="flex flex-col gap-y-5">

                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold">Package type:</label>
                            <select 
                                className="bg-white border px-5 py-2 rounded-md"
                                value={data.container_type}
                                onChange={(e) => setData("container_type", e.target.value)}
                            >
                                <option value="pouch">Pouch</option>
                                <option value="box">Box</option>
                            </select>
                        </div>
                        
                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold">Package size:</label>
                            <select 
                                className="bg-white border px-5 py-2 rounded-md"
                                value={data.container_size}
                                onChange={(e) => setData("container_size", e.target.value)}
                            >
                                <option value="extra-small">Extra Small</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        

                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold">Shipping fee:</label>
                            <input 
                                type="number" 
                                className="min-w-40 border rounded-md px-2 py-1 bg-[#F5F5F5]"
                                value={data.raw_shipping_fee}
                                onChange={(e) => setData("raw_shipping_fee", Number(e.target.value))}
                            />
                        </div>

                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold">Package fee:</label>
                            <input 
                                type="number" 
                                className="min-w-40 border rounded-md px-2 py-1 bg-[#F5F5F5]"
                                value={data.container_fee}
                                onChange={(e) => setData("container_fee", Number(e.target.value))}
                            />
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="" className="min-w-40 text-lg font-semibold">Tracking number:</label>
                            <input 
                                type="text" 
                                className="min-w-100 border rounded-md px-2 py-1 bg-[#F5F5F5]"
                                value={data.tracking_number}
                                onChange={(e) => setData("tracking_number", e.target.value)}
                            />
                        </div>
                        

                    </div>


                </div>

            </div>

            <div className="rounded-md bg-white min-h-20 p-5">
                
                <div className="h-full flex justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                        <h1 className="font-semibold text-lg">Total Shipping fee:</h1>
                        <span className="font-bold text-3xl text-red-500">
                            { totalShippingFee ? formatCurrency(totalShippingFee) : "--"}
                        </span>
                    </div>
                    
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>

            </div>
        </form>
    
    </>


}