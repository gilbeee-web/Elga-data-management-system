import Layout from "@/Layouts/AppLayout"
import { useForm, Link, router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import TextInput from "../../Components/TextInput";
import CustomerForm from "./Components/CustomerForm";
import OrderForm from "./Components/OrderForm";
import { route } from "ziggy-js";
import CustomerBook from "./Components/CustomerBook";
import ShippingForm from "./Components/ShippingForm";
import { formatCurrency } from "../../Utils/formatCurrency";
import Swal from "sweetalert2";
import Payment from "./Components/Payment";
import ShipmentForm from "./Components/ShipmentForm";
import { Ban, ChevronDown, ChevronLeft, CircleAlert, CircleCheck, CircleCheckBig, Copy, Trash2 } from "lucide-react";


export default function Edit({order, status, customer, orderReferences, shipmentInfo, payments, orderSummary, user}){

    // console.log("Customers: ", customer);

    // console.log("Order References: ", orderReferences);

    // console.log("Shipping info: ", shipmentInfo);
    // console.log("Remaining balance: ", order.remaining_balance);

    const isLocked = ['shipped', 'cancelled'].includes(order.order_status);

    const [selectedCustomer, setSelectedCustomer] = useState(customer);

    const tabs = ['customer', 'order', 'shipping', 'payment', 'shipment'];

    const [activeTab, setActiveTab] = useState("customer");


    const handleTab = (selectedTab) => {
        const hasCustomer = selectedCustomer && selectedCustomer.sender_name;
        const hasOrderItems = orderReferences && orderReferences.length > 0;
        const hasShipping = shipmentInfo && shipmentInfo.raw_shipping_fee;
        const hasPayments = payments && payments.length > 0;

        let title = "Cannot proceed yet";
        let message = "";

        if (selectedTab === 'order' && !hasCustomer) {
            message = "Please complete the Customer Info tab first.";
        } else if (selectedTab === 'shipping') {
            if (!hasCustomer) {
                message = "Please complete the Customer Info tab first.";
            } else if (!hasOrderItems) {
                message = "Please add at least one order item first.";
            }
        } else if (selectedTab === 'payment') {
            if (!hasCustomer) {
                message = "Please complete the Customer Info tab first.";
            } else if (!hasOrderItems) {
                message = "Please add at least one order item first.";
            } else if (!hasShipping) {
                message = "Please set the shipping fee first.";
            }
        } else if (selectedTab === 'shipment') {
            if (!hasCustomer) {
                message = "Please complete the Customer Info tab first.";
            } else if (!hasOrderItems) {
                message = "Please add at least one order item first.";
            } else if (!hasShipping) {
                message = "Please set the shipping fee first.";
            } else if (!hasPayments && order.remaining_balance > 0) {
                message = "Please settle the payment first.";
            }
        }

        if (message !== "") {
            Swal.fire({ title, text: message, icon: "info" });
            return;
        }

        setActiveTab(selectedTab);
    };

    const [saveCustomers, setSaveCustomers] = useState(null);
    const [isOpenCustomerBook, setOpenCustomerBook] = useState(false);

    const handleGetSaveCustomers = async () => {

        console.log("Clicked customer book");

        try{

            const response = await fetch(route('order.getSaveCustomers'));

            if(!response){
                alert("Something went wrong");
            }

            const result = await response.json();

            console.log("Customer result: ", result);

            if(result){
                setSaveCustomers(result);
            }

            setOpenCustomerBook(true);

        }catch(error){
            console.log("Error: ", error);
        }

    }

    const handleSelectedCustomer = (selectedCustomer) => {

        console.log("Selected customer: ", selectedCustomer);

        setSelectedCustomer(selectedCustomer);
        setOpenCustomerBook(false);
    }


    useEffect(() => {

        if(customer){
            setSelectedCustomer(customer);
        }

    }, [customer]);

    useEffect(()=> {

        console.log("Order Summary: ", orderSummary);

    }, [orderSummary]);

    const generateOrderSummary = (order) => {
        
        const unpaid_message = 
        `To ship your order please settle:

Subtotal: ${formatCurrency(order.subtotal)}
Shipping Fee: ${formatCurrency(order.shipping_fee)}
Discount: ${formatCurrency(order.discount)}
Total: ${formatCurrency(order.total_amount)}
        
Please settle the payment as soon as possible, thank you!
        `;

        if (order.total_paid <= 0) {
            return unpaid_message;
        }

        if (order.remaining_balance > 0) {
            return `To ship your order please settle:

Subtotal: ${formatCurrency(order.subtotal)}
Shipping Fee: ${formatCurrency(order.shipping_fee)}
Discount: ${formatCurrency(order.discount)}
Total Payment: ${formatCurrency(order.total_amount)}

Total Paid: ${formatCurrency(order.total_paid)}
Remaining Balance: ${formatCurrency(order.remaining_balance)}

Thank you!`;
        }

        return `Payment has been received.

            Total Paid: ${formatCurrency(order.total_paid)}

            Thank you for your purchase!`;
    };


    const copyOrderSummary = async () => {

        const message = generateOrderSummary(orderSummary);

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

    const hasCustomerData = Object.values(customer).some(
        value => value !== null && value !== ""
    );

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
    

    return <>

        <Layout title={"Orders"} user={user}>
            
            <div className="flex justify-between items-center">

                <div className="flex items-center">
                    <button className="cursor-pointer" onClick={() => router.visit(route('order.index'))}>
                        <ChevronLeft size={30} />
                    </button>

                    <h1 className="text-xl font-bold">{order.transaction_number}</h1>    

                </div>

                <div className="flex gap-x-3 items-center">
                    <h1 className="text-lg font-bold">Status:</h1>

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
                
            </div>

            <div className="mt-3 w-[75%] grid grid-cols-5 gap-3 pl-5">

                <button 
                    className="text-start cursor-pointer relative"
                    onClick={() => handleTab(tabs[0])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[0] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Customer
                    </span>

                    
                    <span className="absolute top-0">
                        {
                            hasCustomerData ? (
                                <CircleCheckBig strokeWidth={2} size={20} color="green" />
                            ) : (
                                <CircleAlert strokeWidth={2} size={20} color="red"/>
                            )
                        }
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer relative"
                    onClick={() => handleTab(tabs[1])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[1] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Order Items
                    </span>

                    <span className="absolute top-0">
                        {
                            orderReferences.length > 0 ? (
                                <CircleCheckBig strokeWidth={2} size={20} color="green" />
                            ) : (
                                <CircleAlert strokeWidth={2} size={20} color="red"/>
                            )
                        }
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer relative"
                    onClick={() => handleTab(tabs[2])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[2] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Shipping
                    </span>

                    <span className="absolute top-0">
                        {
                            shipmentInfo ? (
                                <CircleCheckBig strokeWidth={2} size={20} color="green" />
                            ) : (
                                <CircleAlert strokeWidth={2} size={20} color="red"/>
                            )
                        }
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer relative"
                    onClick={() => handleTab(tabs[3])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[3] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Payment
                    </span>

                    <span className="absolute top-0">
                        {
                            order.total_amount > 0 && order.remaining_balance <= 0 ? (
                                <CircleCheckBig strokeWidth={2} size={20} color="green" />
                            ) : (
                                <CircleAlert strokeWidth={2} size={20} color="red"/>
                            )
                        }
                    </span>
                    
                </button>

                <button 
                    className="w-full text-start cursor-pointer"
                    onClick={() => handleTab(tabs[4])}
                >
                    <span
                        className={`w-full text-2xl font-bold ${
                            activeTab === tabs[4] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        {isLocked ? "Summary" : "Review & Ship"}
                    </span>
                </button>

            </div>

            <div className="mt-5 grid grid-cols-[75%_25%] gap-4">
                {
                    activeTab === "customer" && (
                        <CustomerForm 
                            changeTab={(tab) => setActiveTab(tab)} 
                            order={order} 
                            customer={selectedCustomer}
                            getSaveCustomers={handleGetSaveCustomers}
                            readOnly={isLocked}
                        />
                    )
                }

                {
                    activeTab === "customer" && isOpenCustomerBook && (
                        <CustomerBook 
                            customers={saveCustomers}
                            selectCustomer={handleSelectedCustomer}
                            onClose={() => setOpenCustomerBook(false)}
                        />
                    )
                }

                {
                    activeTab === "order" && (
                        <OrderForm 
                            changeTab={(tab) => setActiveTab(tab)}
                            order={order} 
                            orderReferences={orderReferences}
                            readOnly={isLocked}
                        />
                    )
                }

                {
                    activeTab === "shipping" && (
                        <ShippingForm 
                            changeTab={(tab) => setActiveTab(tab)}
                            shippingInfo={shipmentInfo}
                            order={order}
                            customer={selectedCustomer}
                            readOnly={isLocked}
                        /> 
                    )
                }

                {
                    activeTab === "payment" && (
                        <Payment 
                            changeTab={(tab) => setActiveTab(tab)}
                            order={order}
                            orderSummary={orderSummary}
                            payments={payments}
                            readOnly={isLocked}
                        />
                    )
                }

                {
                    activeTab === "shipment" && (
                        <ShipmentForm 
                            changeTab={(tab) => setActiveTab(tab)}
                            order={order}
                            shippingInfo={shipmentInfo}
                            customer={selectedCustomer}
                            orderReferences={orderReferences}
                            orderSummary={orderSummary}
                            payments={payments}
                            readOnly={isLocked}
                        /> 
                    )
                }
                

                <div className="rounded-md bg-white p-5 relative">
                    
                    <h1 className="mt-5 text-xl font-bold text-center border-b-2 border-gray-400 pb-1">Order Summary</h1>
                    
                    <div className="mt-5 border-b-2 border-gray-400 pb-5">

                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-sm font-semibold">Customer name:</h1>
                            <div className="border px-3 py-1 rounded-md text-center bg-[#F5F5F5] capitalize">
                                <span>{orderSummary.receiver_name ?? "--"}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Subtotal:</h1>
                                <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>{formatCurrency(orderSummary.subtotal)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Discount:</h1>
                                <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>{formatCurrency(orderSummary.discount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Shipping fee:</h1>
                                <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>{formatCurrency(orderSummary.shipping_fee)}</span>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="mt-5 w-full flex flex-col gap-y-3 justify-center">

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Grand Total:</h1>
                                <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>{formatCurrency(orderSummary.total_amount)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Paid:</h1>
                                <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>{formatCurrency(orderSummary.total_paid ?? 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Remaining balance:</h1>
                                <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>{formatCurrency(orderSummary.remaining_balance)}</span>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="absolute top-3 left-3">
                        <button 
                            className="border px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer"
                            onClick={copyOrderSummary}
                        >
                            <Copy strokeWidth={2} size={20} />
                        </button>
                    </div>
                    

                </div>
            </div>


        </Layout>
        


    </>
}