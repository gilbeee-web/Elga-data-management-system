import { useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Copy } from "lucide-react";

export default function ShippingForm({shippingInfo, order, changeTab, customer, readOnly, isSaving}){

    const {data, setData, post, processing, errors} = useForm({
        container_type: "",
        container_size: "",
        raw_shipping_fee: null,
        container_fee: null,
        tracking_number: ""
    });

    const [totalShippingFee, setTotalShippingFee] = useState(null);
    
    const isFormEmpty = Object.values(data).every(
        value => value === "" || value === null
    );
    
    
    const saveShippingInfo = (e) => {
        
        e.preventDefault();
        isSaving(true);

        if(isFormEmpty){
            Swal.fire({
                icon: "warning",
                title: "Save failed",
                text: "Please fill up the shipping form.",
            });
            isSaving(false);
            return;
        }


        post(route("order.saveShippingInfo", order), {

            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Shipping info saved!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                changeTab("payment");
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "Save shipping info failed",
                    text: "Unable to save the shipping info.",
                });

                console.log("Errors: ", errors)
            },
            onFinish: () => isSaving(false)
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

    const [isEditingFee, setIsEditingFee] = useState(false);
    const [isEditingContainerFee, setIsEditingContainerFee] = useState(false);

    


    const copyCustomerInfo = async () => {

        const message = `NAME: ${customer.receiver_name}
CONTACT NUMBER: ${customer.contact_number}
COMPLETE ADDRESS: ${customer.address}`;

        await navigator.clipboard.writeText(message);

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Copied to clipboard!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
    };




    return <>

        <form 
            onSubmit={saveShippingInfo}
            className="flex flex-col gap-y-3"
        >  
            <div className="rounded-md bg-white h-110 p-5">

                <h1 className="text-xl font-bold">Shipping Information</h1>

                <div className="mt-8 grid grid-cols-2 gap-5">

                    <div className="flex flex-col gap-y-5">

                        <div className="flex gap-x-3 items-start">

                            <label htmlFor="container_type" className="font-semibold">
                                <span className="text-sm text-red-500">*</span> Package type:
                            </label>


                            <div className="flex flex-col">
                                <select 
                                    id="container_type"
                                    className={`border px-5 py-2 rounded-md
                                        ${readOnly 
                                            ? "bg-gray-100 border-gray-300 text-gray-500" 
                                            : "bg-white border-gray-400 cursor-pointer"}`}
                                    value={data.container_type}
                                    disabled={readOnly}
                                    onChange={(e) => setData("container_type", e.target.value)}
                                >
                                    <option value="" hidden>Select type</option>
                                    <option value="pouch">Pouch</option>
                                    <option value="box">Box</option>
                                </select>

                                {errors.container_type && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.container_type}
                                    </p>
                                )}
                            </div>
                        </div>

                            
                        
                        
                        <div className="flex gap-x-3 items-start">
                            <label htmlFor="" className="font-semibold"><span className="text-sm text-red-500">*</span> Package size:</label>
                            <div className="flex flex-col">
                                <select 
                                    value={data.container_size}
                                    onChange={(e) => setData("container_size", e.target.value)}
                                    className={`border px-5 py-2 rounded-md
                                        ${readOnly 
                                            ? "bg-gray-100 border-gray-300 text-gray-500" 
                                            : "bg-white border-gray-400 cursor-pointer"}`}
                                    disabled={readOnly}
                                >
                                    <option value="" hidden selected>Select size</option>
                                    <option value="extra-small">Extra Small</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>

                                {errors.container_size && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.container_size}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-x-3 items-start">
                            <label htmlFor="" className="font-semibold"><span className="text-sm text-red-500">*</span> Shipping fee:</label>
                            <div className="flex flex-col"> 

                                <input 
                                    type="text" 
                                    className={`border rounded-md text-sm min-w-40 px-2 py-1 ${
                                        readOnly 
                                            ? "bg-gray-100 border-gray-300 text-gray-500" 
                                            : "bg-white border-gray-400"
                                    }`}
                                    placeholder="0.00"
                                    disabled={readOnly}
                                    value={
                                        isEditingFee
                                            ? data.raw_shipping_fee
                                            : data.raw_shipping_fee
                                                ? formatCurrency(Number(data.raw_shipping_fee))
                                                : ""
                                    }
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        setData(
                                            "raw_shipping_fee",
                                            Number.isNaN(value) ? 0 : value
                                        );
                                    }}
                                    onFocus={() => setIsEditingFee(true)}
                                    onBlur={() => setIsEditingFee(false)}
                                />



                                {errors.raw_shipping_fee && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.raw_shipping_fee}
                                    </p>
                                )}

                            </div>
                            
                        </div>
                                                                      
                        <div className="flex gap-x-3 items-start">
                            <label htmlFor="" className="font-semibold"><span className="text-sm text-red-500">*</span> Package fee:</label>
                            <div className="flex flex-col">
                                <input 
                                    type="text" 
                                    className={`border rounded-md text-sm min-w-40 px-2 py-1 ${
                                        readOnly 
                                            ? "bg-gray-100 border-gray-300 text-gray-500" 
                                            : "bg-white border-gray-400"
                                    }`}
                                    disabled={readOnly}
                                    value= {
                                        isEditingContainerFee
                                            ? data.container_fee
                                            : data.container_fee
                                                ? formatCurrency(Number(data.container_fee))
                                                : ""
                                    }
                                    placeholder="0.00"
                                    
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        setData(
                                            "container_fee",
                                            Number.isNaN(value) ? 0 : value
                                        );
                                    }}
                                    onFocus={() => setIsEditingContainerFee(true)}
                                    onBlur={() => setIsEditingContainerFee(false)}
                                />  

                                {errors.container_fee && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.container_fee}
                                    </p>
                                )}
                            </div>
                                
                        </div>

                        <div className="flex items-start">
                            <label htmlFor="" className="min-w-40 font-semibold"><span className="text-sm text-red-500">*</span> Tracking number:</label>
                            <div className="flex flex-col">
                                <input 
                                    type="text" 
                                    className={`border rounded-md text-sm min-w-50 px-2 py-1 ${
                                        readOnly 
                                            ? "bg-gray-100 border-gray-300 text-gray-500" 
                                            : "bg-white border-gray-400"
                                    }`}
                                    disabled={readOnly}
                                    value={data.tracking_number}
                                    onChange={(e) => setData("tracking_number", e.target.value)}
                                />

                                {errors.tracking_number && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.tracking_number}
                                    </p>
                                )}
                            </div>
                            
                        </div>
                    </div>


                    <div className="w-[80%] rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

                            <div>
                                <h1 className="text-lg font-bold text-gray-800">
                                    Delivery Details
                                </h1>

                                <p className="text-xs text-gray-400 mt-0.5">
                                    Customer shipping information
                                </p>
                            </div>

                            <button
                                type="button"
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                                onClick={copyCustomerInfo}
                                title="Copy delivery details"
                            >
                                <Copy size={18} />
                            </button>

                        </div>


                        {/* Details */}
                        <div className="p-5">

                            <div className="grid grid-cols-2 gap-5">

                                {/* Receiver */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                                        Receiver Name
                                    </p>

                                    <div className="bg-gray-100 border border-gray-100 rounded-lg px-4 py-3">
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {customer.receiver_name ?? "--"}
                                        </p>
                                    </div>
                                </div>


                                {/* Contact Number */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                                        Contact Number
                                    </p>

                                    <div className="bg-gray-100 border border-gray-100 rounded-lg px-4 py-3">
                                        <p className="font-semibold text-gray-800">
                                            {customer.contact_number ?? "--"}
                                        </p>
                                    </div>
                                </div>


                                {/* Address */}
                                <div className="col-span-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                                        Delivery Address
                                    </p>

                                    <div className="bg-gray-100 border border-gray-100 rounded-lg px-4 py-3">
                                        <p className="font-semibold text-gray-800">
                                            {customer.address ?? "--"}
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>



                </div>

            </div>

            <div className="min-h-20 sticky bottom-0 px-6 py-4border-t border-gray-200 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] bg-white">
                
                <div className="h-full flex justify-between items-center">
                    

                    <div className="flex gap-x-3 items-center">
                        <h1 className="font-semibold text-lg">Total Shipping fee:</h1>
                        <span className="font-bold text-3xl text-red-500">
                            { totalShippingFee ? formatCurrency(totalShippingFee) : "--"}
                        </span>
                    </div>
                    
                    {
                        !readOnly ? (
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                                type="submit"
                            >
                                Save
                            </button>
                        ):
                        (
                            <div className="absolute bottom-5 right-3 flex justify-end">
                                <button 
                                    type="button" 
                                    className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 cursor-pointer"
                                    onClick={() => changeTab("payment")}
                                >
                                    Next
                                </button>
                            </div>
                        )
                    }
                    
                </div>

            </div>
        </form>
    
    </>


}