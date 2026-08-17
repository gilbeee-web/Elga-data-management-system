import { router, useForm } from "@inertiajs/react";
import TextInput from "../../../Components/TextInput";
import { formatCurrency } from "../../../Utils/formatCurrency";
import Swal from "sweetalert2";
import { HandCoins, Package, SquarePen, Truck, User } from "lucide-react";

export default function ShipmentForm({order, customer, orderReferences, shippingInfo, orderSummary, payments, changeTab, readOnly}){

    
   

    const {data, setData, processing, errors, post} = useForm({
        sf_payment_reference: ""
    });


    const hasCustomerData = Object.values(customer).some(
        value => value !== null && value !== ""
    );


    const showShipmentValidationError = (message) => {
        Swal.fire({
            icon: "warning",
            title: "Cannot Ship Order",
            text: message,
        });
    };

    
    const saveShipment = async (e) => {

        e.preventDefault();
        
        const result = await Swal.fire({
            title: "Shipped Order?",
            text: "This can't be undone from here.",
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

        let isCompleted = false;
        let message = "";

        if (result.isConfirmed) {

            if (!hasCustomerData) {
                return showShipmentValidationError("Please check the customer data if completed.");
            }

            if (orderReferences.length <= 0) {
                return showShipmentValidationError("Please input some order items.");
            }

            if (!shippingInfo) {
                return showShipmentValidationError("Please fill up the shipping form first.");
            }

            if (order.remaining_balance > 0) {
                return showShipmentValidationError("Please settle the remaining balance first.");
            }

            console.log("Save Shipment");

            post(
                route("order.shippedOrder", order.id),
                {
                    onSuccess: () => {
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: "Successfully shipped order!",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: "error",
                            title: "Ship failed",
                            text: "Unable to ship the order.",
                        });
                    },
                }
            );
        }
    }

    //item total with discount 
    const getItemTotal = (item) => {

        const variant = item.variants.find((v) => v.id === item.selected_variant_id); // find the variant

        const price = variant ? variant.price : 0;

        //formula for subtotal
        const finalPrice = price - item.discount; 

        const subtotal = finalPrice * item.qty;

        // if subtotal is less than 0 return 0 to avoid negative number or subtotal
        return subtotal < 0 ? 0 : subtotal; 
    };


    const getOrderTotals = (order) => {
        let totalQty = 0;
        let totalDiscount = 0;
        let totalSubtotal = 0;
        let finalTotal = 0;

        order.items.forEach((item) => {
            totalQty += item.qty;
            totalSubtotal += item.variant_price * item.qty;
            totalDiscount += item.discount * item.qty;
            finalTotal += getItemTotal(item);
        });

        return { totalQty, totalSubtotal, totalDiscount, finalTotal };
    };



   

    return <>

        <form 
            onSubmit={saveShipment}
            className="flex flex-col gap-y-3"
        >  
            <div className="rounded-md bg-white h-135 p-5 overflow-y-auto">

                <h1 className="text-xl font-bold">Review Transaction</h1>


                <div className="mt-5 w-full border-2 border-gray-300 shadow-sm rounded-lg p-3">

                    <div className="flex justify-between">

                        <div className="flex items-center gap-2">
                            <User size={20} />
                            <h1 className="font-semibold text-base">Customer</h1>
                        </div>

                        {
                            !readOnly && (
                                <div>
                                    <button 
                                        className="cursor-pointer"
                                        onClick={() => changeTab("customer")}
                                    >
                                        <SquarePen  size={20}/>
                                    </button>
                                </div>
                            )
                        }
                        
                    </div>
                    


                    <div className="mt-2">
                        <ul className="flex gap-x-3 items-center">
                            <li className="font-semibold text-gray-500">{customer.receiver_name ?? "--"}</li>
                            <li className="font-semibold text-gray-500"><span className="text-black">|</span> {customer.contact_number ?? "--"}</li>
                            <li className="font-semibold text-gray-500"><span className="text-black">|</span> {customer.address ?? "--"}</li>
                        </ul>
                    </div>
                    
                </div>


                <div className="mt-5 w-full border border-gray-200 shadow-sm rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Package size={20}/>
                            <h1 className="font-semibold text-base">Order</h1>
                        </div>

                        {
                            !readOnly && (
                                <button 
                                    className="cursor-pointer"
                                    onClick={() => changeTab("order")}
                                >
                                    <SquarePen size={20}/>
                                </button>
                            )
                        }
                        
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-xs font-semibold text-gray-400 text-left py-2">Order no.</th>
                                <th className="text-xs font-semibold text-gray-400 text-right py-2">Items</th>
                                <th className="text-xs font-semibold text-gray-400 text-right py-2">Discount</th>
                                <th className="text-xs font-semibold text-gray-400 text-right py-2">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderReferences.map((order, orderIndex) => {
                                const { totalQty, totalDiscount, finalTotal } = getOrderTotals(order);

                                return (
                                    <tr key={orderIndex} className="border-b border-gray-100">
                                        <td className="py-2 text-gray-900">#{order.order_number}</td>
                                        <td className="py-2 text-right text-gray-600">{totalQty}</td>
                                        <td className="py-2 text-right text-gray-600">{formatCurrency(totalDiscount)}</td>
                                        <td className="py-2 text-right text-gray-900">{formatCurrency(finalTotal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="mt-3 pt-3 border-t border-gray-300 space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(orderSummary.subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Total discount</span>
                            <span>-{formatCurrency(orderSummary.discount)}</span>
                        </div>

                        <div className="flex justify-between text-sm font-semibold pt-1">
                            <span>Order total</span>
                            <span>{formatCurrency(orderSummary.total_amount)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 w-full border-2 border-gray-300 shadow-sm rounded-lg p-3">

                    <div className="flex justify-between">

                        <div className="flex items-center gap-2">
                            <Truck size={20}/>
                            <h1 className="font-semibold text-base">Shipping</h1>
                        </div>
                        
                        {
                            !readOnly && (
                                <div>
                                    <button 
                                        className="cursor-pointer"
                                        onClick={() => changeTab("shipping")}
                                    >
                                        <SquarePen size={20} />
                                    </button>
                                </div>
                            )
                        }
                        
                    </div>
                    


                    <div className="mt-2">
                        <ul className="flex gap-x-3 items-center">
                            <li className="font-semibold text-gray-500 capitalize">{shippingInfo?.container_size ?? "--"} {shippingInfo?.container_type ?? "--"}</li>
                            <li className="font-semibold text-gray-500"><span className="text-black">|</span> Fee {formatCurrency(shippingInfo?.total_shipping_fee ?? 0)}</li>
                            <li className="font-semibold text-gray-500"><span className="text-black">|</span> {shippingInfo?.tracking_number ?? "--"}</li>
                        </ul>
                    </div>

                    <div className="mt-3">
                        <TextInput 
                            label={"SF Payment Reference:"}
                            placeholder="eg. GoTyme reference"
                            value={data.sf_payment_reference}
                            onChange={(e) => setData("sf_payment_reference", e.target.value)}
                            error={errors.sf_payment_reference}
                        />
                    </div>
                    
                </div>


                <div className="mt-5 w-full border-2 border-gray-200 shadow-sm rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <HandCoins size={20}/>
                            <h1 className="font-semibold text-base">Payment</h1>
                        </div>
                        
                        {
                            !readOnly && (
                                <button 
                                    className="cursor-pointer"
                                    onClick={() => changeTab("payment")}
                                >
                                    <SquarePen size={20}/>
                                </button>
                            )
                        }
                        
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-xs font-semibold text-gray-400 text-left py-2">Method</th>
                                <th className="text-xs font-semibold text-gray-400 text-left py-2">Reference</th>
                                <th className="text-xs font-semibold text-gray-400 text-right py-2">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.length > 0 && payments.map((payment, paymentIndex) => (
                                <tr key={paymentIndex} className="border-b border-gray-100">
                                    <td className="py-2 text-gray-900 capitalize">{payment.payment_method} {payment.mop_name}</td>
                                    <td className="py-2 text-gray-600">{payment.reference_number || '—'}</td>
                                    <td className="py-2 text-right text-gray-900">{formatCurrency(payment.payment_amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-3 pt-3 border-t border-gray-300 space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Order total</span>
                            <span>{formatCurrency(orderSummary.total_amount)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Total paid</span>
                            <span>{formatCurrency(orderSummary.total_paid)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-semibold pt-1">
                            <span>Balance</span>
                            {orderSummary.remaining_balance <= 0 && (
                                <span className="text-xs font-normal text-green-700 bg-green-100 px-2.5 py-0.5 rounded">
                                    Fully paid
                                </span>
                                
                            )}
                            {orderSummary.remaining_balance > 0 && (
                                <span className="text-amber-700">{formatCurrency(orderSummary.remaining_balance)} due</span>
                            )}
                            {orderSummary.remaining_balance < 0 && (
                                <span className="text-blue-700">{formatCurrency(Math.abs(orderSummary.remaining_balance))} overpaid</span>
                            )}
                        </div>
                    </div>
                </div>
                
                {
                    !readOnly && (
                        <div className="mt-5 flex justify-end">
                            <button 
                                className="flex gap-x-2 bg-green-500 hover:bg-green-400 p-2 rounded-md items-center cursor-pointer text-white font-bold"
                                type="submit"
                            >
                                <Truck size={20}/>
                                Shipped
                            </button>
                        </div>
                    )
                }
                

                
            </div>
        </form>

    
    </>



}