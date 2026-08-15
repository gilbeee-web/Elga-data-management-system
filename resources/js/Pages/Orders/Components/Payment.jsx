import { useState } from "react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import PaymentFormModal from "./PaymentFormModal";
import { formatDateTime } from "../../../Utils/formatDateTime";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Payment({order, orderSummary, payments, changeTab, readOnly}){

    console.log("Payments: ", payments);

    const paymentMethodImages = {
        gcash: "/images/logo/gcash-logo.svg",
        bank_transfer: "/images/logo/bank-transfer-logo.svg",
        cash: "/images/logo/cash-logo.svg",
        card_payment: "/images/logo/card-logo.svg",
    };

    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState([]);


    const removePayment = async (payment_id) => {

        const result = await Swal.fire({
            title: "Remove payment?",
            text: "This payment will removed permanently.",
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
            router.delete(
                route('order.destroyPayment', {
                    order: order.id,
                    payment_id: payment_id,
                }),
                {
                    onSuccess: () => {
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: "Successfully removed the payment!",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: "error",
                            title: "Delete failed",
                            text: "Unable to remove the payment.",
                        });
                    },
                }
            );
        }

    }

    const overpayment = orderSummary.total_paid - orderSummary.remaining_balance;

    return <>

        <div className="rounded-md bg-white p-5 h-125 flex flex-col">

            <h1 className="text-xl font-bold">Payment Information</h1>

            <div className="mt-5 flex-1 min-h-0 grid grid-cols-[60%_40%] gap-15">

                <div className="flex flex-col min-h-0">

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Payment History:</h2>

                        {
                            payments.length > 0 && !readOnly && (
                                <button
                                    className="bg-blue-500 hover:bg-blue-400 rounded-md px-3 py-1 text-white font-semibold cursor-pointer"
                                    onClick={() => setOpenPaymentForm(true)}
                                >
                                    + Add Payment
                                </button>
                            )
                        }
                    </div>

                    {
                        payments.length <= 0 ? (
                            <div className="mt-5 border-2 border-dashed min-h-60 rounded-lg flex items-center justify-center">
                                <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
                                    <h1 className="text-xl font-bold">No payment yet.</h1>
                                    <button
                                        className="bg-green-500 rounded-md px-3 py-1 text-white font-semibold cursor-pointer"
                                        onClick={() => setOpenPaymentForm(true)}
                                    >
                                        + Add Payment
                                    </button>
                                </div>
                            </div>
                        ) : (
                            
                            <div className="mt-5 flex-1 min-h-0 overflow-y-auto pt-3 pr-3">
                                {
                                    payments.map((payment) => (
                                        <div 
                                            key={payment.id} 
                                            className={`relative mb-5 border rounded-xl p-3 flex justify-between shadow-md
                                                ${readOnly 
                                                    ? "bg-gray-50 border-gray-300 cursor-default" 
                                                    : "bg-white border-gray-400 cursor-pointer hover:bg-gray-100"}`}
                                            onClick={() => {
                                                if (readOnly) return;
                                                setSelectedPayment(payment);
                                                setOpenPaymentForm(true);
                                            }}  
                                        >
                                            {
                                                !readOnly && (
                                                    <div className="absolute -top-2 -right-2 z-99">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removePayment(payment.id)
                                                            }}
                                                        >
                                                            <img 
                                                                src={'/images/icons/remove-btn.svg'} 
                                                                alt="Remove Btn" 
                                                                className="cursor-pointer object-contain h-5 w-5"
                                                            />
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            


                                            <div className="flex gap-x-5">
                                                <div className="border border-gray-200 rounded-md flex-shrink-0 h-20 w-20 overflow-hidden">
                                                    <img
                                                        src={
                                                            payment.proof_image
                                                                ? `/storage/${payment.proof_image}`
                                                                : paymentMethodImages[payment.payment_method]
                                                        }
                                                        alt="Proof Image"
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-y-3">
                                                    <div className="flex flex-col">
                                                        <h1 className="text-xl font-bold text-green-500">{formatCurrency(payment.payment_amount)}</h1>
                                                        <h1 className="text-md font-semibold">{payment.mop_name}</h1>
                                                    </div>
                                                    <h1 className="text-sm font-semibold">
                                                        <span className="text-gray-500">Ref No:</span> {payment.reference_number}
                                                    </h1>
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <h1 className="text-sm font-semibold capitalize">
                                                    {
                                                        payment.payment_type === "down_payment" 
                                                        ? "Down Payment" :  `${payment.payment_type} Payment`
                                                    }
                                                </h1>
                                                
                                                <div className="flex gap-x-1 items-center">
                                                    <h1 className="font-semibold text-xs text-gray-400">Date:</h1>
                                                    <span className="text-xs">{ formatDateTime(payment.paid_at) }</span>
                                                </div>

                                                <div className="w-full mt-5 max-w-40 h-full flex items-end">
                                                    <h1 className="text-xs">{payment.remarks}</h1>
                                                </div>

                                            </div>


                                            

                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>

              
                <div className="w-[80%] border max-h-95 rounded-lg p-3">
                    <h1 className="text-lg font-bold">Payment Summary:</h1>

                    <div className="mt-5 flex flex-col gap-y-5 items-center justify-center">
                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-sm font-semibold">Grand Total:</h1>
                            <div className="border px-3 py-1 min-w-50 max-w-70 rounded-md text-center bg-[#F5F5F5]">
                                <span className="text-xl text-gray-500 font-bold">{formatCurrency(orderSummary.total_amount)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-sm font-semibold">Total Paid:</h1>
                            <div className="border px-3 py-1 min-w-50 max-w-70 rounded-md text-center bg-[#F5F5F5]">
                                <span className="text-xl text-green-500 font-bold">{formatCurrency(orderSummary.total_paid)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-sm font-semibold">Remaining Balance:</h1>
                            <div className="border px-3 py-1 min-w-50 max-w-70 rounded-md text-center bg-[#F5F5F5]">
                                <span className="text-xl text-red-500 font-bold">{formatCurrency(orderSummary.remaining_balance)}</span>
                            </div>
                        </div>

                        {
                            orderSummary.total_paid > orderSummary.total_amount && (
                                <div className="flex flex-col gap-y-1">
                                    <h1 className="text-sm font-semibold">Overpayment:</h1>
                                    <div className="border px-3 py-1 min-w-50 max-w-70 rounded-md text-center bg-[#F5F5F5]">
                                        <span className="text-xl text-red-500 font-bold">
                                            {formatCurrency(orderSummary.total_paid - orderSummary.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }

                        
                    </div>
                </div>

            </div>
        </div>
        
        {
            openPaymentForm && (
                <PaymentFormModal 
                    onClose={() => {
                        setSelectedPayment(null);
                        setOpenPaymentForm(false);
                    }}
                    order={order}
                    payment={selectedPayment}
                    onSubmitPayment={(isFullyPaid) => {

                        console.log("Submitted payment successfully");

                        if (isFullyPaid) {
                            console.log("isFully paid");
                            changeTab("shipment");
                        }

                        setSelectedPayment(null);
                        setOpenPaymentForm(false);
                    }}
                />
            )
            
        }
        

        
       
    
    
    </>

}