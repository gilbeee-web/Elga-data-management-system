import { useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ShippingForm({shippingInfo, order, changeTab, customer}){

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

        if(isFormEmpty){
            Swal.fire({
                icon: "warning",
                title: "Save failed",
                text: "Please fill up the shipping form.",
            });

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

                        

                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold"><span className="text-sm text-red-500">*</span> Package type:</label>
                            <div className="flex flex-col"> 
                                <select 
                                    className="bg-white border px-5 py-2 rounded-md"
                                    value={data.container_type}
                                    onChange={(e) => setData("container_type", e.target.value)}
                                >
                                    <option value="" hidden selected>Select type</option>
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

                            
                        
                        
                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold"><span className="text-sm text-red-500">*</span> Package size:</label>
                            <div className="flex flex-col">
                                <select 
                                    className="bg-white border px-5 py-2 rounded-md"
                                    value={data.container_size}
                                    onChange={(e) => setData("container_size", e.target.value)}
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

                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold"><span className="text-sm text-red-500">*</span> Shipping fee:</label>
                            <div className="flex flex-col"> 

                                <input 
                                    type="text" 
                                    className="min-w-40 border rounded-md px-2 py-1 bg-[#F5F5F5]"
                                    placeholder="0.00"
                                    
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
                                                                      
                        <div className="flex gap-x-3 items-center">
                            <label htmlFor="" className="text-lg font-semibold"><span className="text-sm text-red-500">*</span> Package fee:</label>
                            <div className="flex flex-col">
                                <input 
                                    type="text" 
                                    className="min-w-40 border rounded-md px-2 py-1 bg-[#F5F5F5]"
                                    value= {
                                        isEditingContainerFee
                                            ? data.container_fee
                                            : data.container_fee
                                                ? formatCurrency(Number(data.container_fee))
                                                : 0
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

                        <div className="flex items-center">
                            <label htmlFor="" className="min-w-40 text-lg font-semibold"><span className="text-sm text-red-500">*</span> Tracking number:</label>
                            <div className="flex flex-col">
                                <input 
                                    type="text" 
                                    className="min-w-50 border rounded-md px-2 py-1 bg-[#F5F5F5]"
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


                    <div className="border p-5 rounded-lg w-[80%]">
                        
                        <div className="flex gap-x-3 items-center">
                            <button 
                                type="button"
                                className="border px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer"
                                onClick={copyCustomerInfo}
                            >
                                <img src="/images/icons/copy-icon.svg" alt="Copy icon" className="object-contain w-4 h-4"/>
                            </button>

                            <h1 className="font-bold text-xl">Delivery Details</h1>
                        </div>

                        <div className="mt-5 w-full flex flex-col gap-y-5 justify-center items-center">

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Receiver Name:</h1>
                                <div className="border px-3 py-1 min-w-70 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold">{customer.receiver_name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Contact Number:</h1>
                                <div className="border px-3 py-1 min-w-70 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold">{customer.contact_number}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Address:</h1>
                                <div className="border px-3 py-1 min-w-70 max-w-80 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold">{customer.address}</span>
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
                    
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                        type="submit"
                    >
                        Save
                    </button>
                </div>

            </div>
        </form>
    
    </>


}