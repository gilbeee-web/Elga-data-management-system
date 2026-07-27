import { useForm } from "@inertiajs/react";
import TextInput from "../../../Components/TextInput";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import { formatCurrency } from "../../../Utils/formatCurrency";

export default function PaymentFormModal({order, onClose, payment}){

    console.log("Order data(payment form): ", order);
    console.log("Payment data (payment form): ", payment);

    const {data, setData, post, processing, errors} = useForm({
        payment_type: "",
        payment_method: "",
        payment_amount: null,
        mop_name: "",
        reference_number: "",
        remarks: "",
        proof_image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setData("proof_image", file);

        setPreviewImage(URL.createObjectURL(file));
    };

    const savePayment = (e) => {

        e.preventDefault();

        post(route('order.savePayment', order.id), {
            onSuccess: () => {
                
                onClose();

                console.log("Successful payment");
            },

            onError: (errors) => {
                console.log("Errors: ", errors)
            }
        });
    }


    useEffect(() => {

        if(payment){

            setData({
                payment_type: payment.payment_type,
                payment_method: payment.payment_method,
                payment_amount: payment.payment_amount,
                mop_name: payment.mop_name,
                reference_number: payment.reference_number,
                remarks: payment.remarks
            }); 

            if(!previewImage && payment.proof_image){
                setPreviewImage(`/storage/${payment.proof_image}`);
            }

        }


    }, [payment])


    return <>

        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
            
            <div className="w-full bg-white sm:max-w-md md:max-w-xl lg:max-w-md rounded-md shadow p-3 pt-3 overflow-y-auto min-h-[50vh]">

                {/* Header */}

                <div className="w-full flex justify-between items-center border-b border-gray-300">
                    
                    <h1 className="text-lg font-bold capitalize">
                        {payment ? "Edit Payment Details" : "Add Payment Details"}
                    </h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>


                <form 
                    onSubmit={savePayment} 
                    className="mt-3 flex flex-col gap-y-5"
                >

                    <div className="flex gap-x-5 items-center">

                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="payment_type" className="font-semibold">Payment Type:<span className="text-red-500">*</span></label>
                            <select 
                                name="payment_type"
                                className="border bg-white p-2 rounded-md max-w-50" 
                                value={data.payment_type}
                                onChange={(e) => setData("payment_type",e.target.value)}
                            >
                                <option value="" disabled hidden>Select Payment Type</option>
                                <option value="full">Full Payment</option>
                                <option value="down_payment">Down Payment</option>
                                <option value="balance">Balance Payment</option>
                            </select>

                            {errors.payment_type && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.payment_type}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="payment_method" className="font-semibold">Payment Method:<span className="text-red-500">*</span></label>
                            <select 
                                name="payment_method"
                                className="border bg-white p-2 rounded-md max-w-50"
                                value={data.payment_method}
                                onChange={(e) => setData("payment_method",e.target.value)}
                            >
                                <option value="" disabled hidden>Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="gcash">GCash</option>
                                <option value="bank_transfer">Bank transfer</option>
                                <option value="card_payment">Card Payment</option>
                            </select>

                            {errors.payment_method && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.payment_method}
                                </p>
                            )}
                        </div>


                    </div>

                    <div className="flex gap-x-5 items-center">

                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="" className="font-semibold">Payment Amount: <span className="text-red-500">*</span></label>

                            <input
                                type="text"
                                className="w-50 border bg-[#F5F5F5] rounded-md px-3 py-1"
                                value={
                                    isEditing
                                        ? data.payment_amount
                                        : data.payment_amount
                                            ? formatCurrency(Number(data.payment_amount))
                                            : ""
                                }
                                onFocus={() => setIsEditing(true)}
                                onBlur={() => setIsEditing(false)}
                                onChange={(e) => setData("payment_amount", e.target.value)}
                            />

                        </div>

                        
                        
                        {/* <TextInput
                            label="Payment Amount:"
                            type={isEditing ? "number" : "text"}
                            placeholder="Enter amount"
                            value={
                                isEditing
                                    ? data.payment_amount
                                    : data.payment_amount
                                        ? formatCurrency(Number(data.payment_amount))
                                        : ""
                            }
                            onFocus={() => setIsEditing(true)}
                            onBlur={() => setIsEditing(false)}
                            onChange={(e) => setData("payment_amount", e.target.value)}
                        /> */}


                        

                        <TextInput 
                            label={"MOP Name:"}
                            type="text"
                            placeholder="eg. Railey C"
                            value={data.mop_name}
                            onChange={(e) => setData("mop_name",e.target.value)}
                        />
                    </div>
                    

                    

                    <TextInput 
                        label={"Reference Number:"}
                        type="text"
                        className="min-w-80"
                        value={data.reference_number}
                        onChange={(e) => setData("reference_number", e.target.value)}
                        required={true}
                    />

                    <div className="flex flex-col gap-y-1">
                        <label className="font-semibold">Proof of Payment:</label>

                        <label htmlFor="product_image" className="cursor-pointer inline-block w-fit">

                            {previewImage ? (

                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-auto h-30 rounded-md border"
                                />

                            ) : (

                                <div className="border-2 border-dashed w-60 h-25 rounded-md flex items-center justify-center hover:bg-gray-200">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src="/images/icons/add-photo-icon.png"
                                            className="w-10 h-10"
                                        />

                                        <span>Upload Image</span>

                                        <span className="text-xs text-gray-500">
                                            Allowed format: JPG, JPEG, PNG
                                        </span>
                                    </div>
                                </div>

                            )}

                        </label>

                        <input
                            id="product_image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        {errors.image && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.image}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="remarks" className="font-semibold">Remarks:</label>
                        <textarea 
                            value={data.remarks}
                            onChange={(e) => setData("remarks",e.target.value)} 
                            className="border p-3 rounded-md"
                        >

                        </textarea>

                        {errors.remarks && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.remarks}
                            </p>
                        )}
                    </div>


                    {/* <TextInput 
                        label={"Remarks:"}
                        type="text"
                        className="min-w-80 h-20"
                        value={data.referencec_number}
                        onChange={(e) => setData("referencec_number",e.target.value)}
                    /> */}

                    


                    
                    <div className="mt-3 flex gap-x-5 items-center justify-end">
                        <button 
                            className="bg-gray-400 text-white rounded-md px-3 py-2 cursor-pointer"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button 
                            className="bg-green-500 text-white rounded-md px-3 py-2 cursor-pointer"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>


                </form>



            </div>
        </div>

    
    </>




}