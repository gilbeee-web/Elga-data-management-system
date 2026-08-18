import { useForm } from "@inertiajs/react";
import TextInput from "../../../Components/TextInput";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import { formatCurrency } from "../../../Utils/formatCurrency";
import Swal from "sweetalert2";
import { CircleX, Eye, ImagePlus, Trash2 } from "lucide-react";

export default function PaymentFormModal({order, onClose, payment, onSubmitPayment}){

    console.log("Order data(payment form): ", order);
    console.log("Payment data (payment form): ", payment);

    const {data, setData, post, processing, errors} = useForm({
        payment_id: null,
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

            onSuccess: (page) => {

                const isFullyPaid = Number(page.props.order.remaining_balance) === 0;

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Payment saved!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                onSubmitPayment(isFullyPaid);
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "Save payment failed",
                    text: Object.values(errors)[0],
                });

                console.log("Errors: ", errors)
            },
        });
    }


    useEffect(() => {

        if(payment){

            setData({
                payment_id: payment.id,
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


    }, [payment]);

    const [showImagePreview, setShowImagePreview] = useState(null);

    useEffect(() => {
        if (!previewImage) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowImagePreview(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showImagePreview]);


    const handleRemoveProofImage = async (e) => {
        e.stopPropagation();

        const result = await Swal.fire({
            title: "Remove this slip?",
            text: "This slip will removed permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if(!result.isConfirmed){
            return;
        }
        
        
        if(result.isConfirmed){
            setPreviewImage(null);
            setData("proof_image", null);
        }        
    }


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
                            <label htmlFor="" className="font-semibold">Payment Amount: <span className="text-red-500">*</span></label>

                            <input
                                type="text"
                                placeholder="0.00"
                                className="w-50 border border-gray-400 bg-white rounded-md px-3 py-1"
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

                            {errors.payment_amount && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.payment_amount}
                                </p>
                            )}

                        </div>

                        

                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="payment_method" className="font-semibold">Payment Method:<span className="text-red-500">*</span></label>
                            <select 
                                name="payment_method"
                                className="border border-gray-400 bg-white px-2 py-1 rounded-md max-w-55"
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

                    <TextInput 
                        label={"MOP Name:"}
                        type="text"
                        className="min-w-80"
                        placeholder="eg. Railey C"
                        value={data.mop_name}
                        onChange={(e) => setData("mop_name",e.target.value)}
                        required={true}
                        error={errors.mop_name}
                    />
                    
                    <TextInput 
                        label={"Reference Number:"}
                        type="text"
                        placeholder="eg. gcash or gotyme"
                        className="min-w-80"
                        value={data.reference_number}
                        onChange={(e) => setData("reference_number", e.target.value)}
                        required={true}
                        error={errors.reference_number}
                    />

                    <div className="flex flex-col gap-y-1">
                        <label className="font-semibold">Proof of Payment:</label>

                        {previewImage ? (
                            <div className="mt-5 relative px-2 py-1 border border-gray-400 rounded-md w-fit group">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-auto h-30 rounded-md border cursor-pointer"
                                    onClick={() => setShowImagePreview(true)}
                                />

                                <div 
                                    className="absolute h-full inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-md"
                                    onClick={() => setShowImagePreview(true)}
                                >
                                    <Eye size={28} color={"#FFF"}/>
                                </div>

                                <div className="absolute -right-2 -top-3">
                                    <button 
                                        type="button"
                                        className="text-xl cursor-pointer"
                                        onClick={handleRemoveProofImage}
                                    >
                                        <CircleX strokeWidth={3} color="red" size={20}/>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="product_image" className="cursor-pointer inline-block w-fit">
                                <div className="border-2 border-dashed w-60 h-25 rounded-md flex items-center justify-center hover:bg-gray-200">
                                    <div className="flex flex-col items-center">
                                        <ImagePlus size={30}/>
                                        <span>Upload Image</span>
                                        <span className="text-xs text-gray-500">
                                            Allowed format: JPG, JPEG, PNG
                                        </span>
                                    </div>
                                </div>
                            </label>
                        )}

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

                    {showImagePreview && (
                        <div 
                            className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center"
                            onClick={() => setShowImagePreview(null)}
                        >

                            <button className="absolute top-4 right-4 text-white text-3xl cursor-pointer hover:text-gray-300" onClick={() => setShowImagePreview(null)}>
                                &times;
                            </button>
                            
                            <img 
                                src={previewImage}
                                alt="Full preview"
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="remarks" className="font-semibold">Remarks:</label>
                        <textarea 
                            value={data.remarks}
                            onChange={(e) => setData("remarks",e.target.value)} 
                            className="border border-gray-400 p-3 rounded-md"
                        >

                        </textarea>

                        {errors.remarks && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.remarks}
                            </p>
                        )}
                    </div>

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