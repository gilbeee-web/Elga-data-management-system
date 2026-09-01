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
import { Ban, ChevronDown, ChevronLeft, CircleAlert, CircleCheck, CircleCheckBig, Clock, Copy, Trash2 } from "lucide-react";
import OrderStatusDropdown from "../../Components/OrderStatusDropdown";
import OrderTypeDropdown from "../../Components/OrderTypeDropdown";
import SaveLoading from "../../Components/SaveLoading";
import OrderStatusHistory from "./Components/OrderStatusHistory";


export default function Edit({order, order_type, status, customer, orderReferences, shipmentInfo, payments, orderSummary, user}){

    console.log("Order Type: ", order_type);
    console.log("Payments: ", payments);

    const isWalkinOrder = order_type === 'walkin';
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
        } else if (selectedTab === 'shipping' && !isWalkinOrder) {
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
            } 
            
            // else if (!hasShipping && !isWalkinOrder) {
            //     console.log("hey");
            //     message = "Please set the shipping fee first.";
            // }
        } else if (selectedTab === 'shipment') {
            if (!hasCustomer) {
                message = "Please complete the Customer Info tab first.";
            } else if (!hasOrderItems) {
                message = "Please add at least one order item first.";
            } else if (!hasShipping && !isWalkinOrder) {
                console.log("hey2");
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

    const [showOrderHistory, setShowOrderHistory] = useState(false);
    const [orderStatusHistory, setOrderStatusHistory] = useState(null);

    const handleShowOrderHistory = async() => {
        console.log("Clicked order history");

        try{

            if(order){
                const response = await fetch(route('order.getOrderStatusHistory', order.id));

                if(!response){
                    alert("Something went wrong");
                }

                const result = await response.json();

                console.log("Order history result: ", result);

                if(result){
                    setOrderStatusHistory(result);
                }

                setShowOrderHistory(true);
            }else{
                alert("Something went wrong");
            }
            

        }catch(error){
            console.log("Error: ", error);
        }
    }

    const [isSaving, setIsSaving] = useState(false);
    
    const handleIsSaving = (status) => {
        setIsSaving(status);
    }

    return <>

        <div className="min-h-screen w-full py-3 px-10 bg-gray-100">
            
            <div className="flex justify-between items-center">

                <div className="flex items-center">
                    <button className="cursor-pointer" onClick={() => router.visit(route('order.index'))}>
                        <ChevronLeft size={30} />
                    </button>

                    <h1 className="text-xl font-bold">{order.transaction_number}</h1>    

                </div>

                <div className="flex gap-x-5 items-center">

                    {payments.length === 0 && !(isWalkinOrder === false && shipmentInfo) && (
                        <OrderTypeDropdown
                            order={order}
                            hasShipmentInfo={shipmentInfo}
                        />
                    )}
                        
                    <OrderStatusDropdown order={order} />

                </div>

                
                
            </div>

            <div className="w-full mt-8 flex justify-between items-center">
                <div className="w-[75%] grid grid-cols-5 gap-3 pl-5">

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

                    {
                        order_type === 'shipment' && (
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
                        )
                    }    
                    
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

                <div className="">
                    <button 
                        className="flex gap-x-2 items-center px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white font-semibold cursor-pointer"
                        onClick={handleShowOrderHistory}
                    >
                        <Clock size={20}/>
                        View History
                    </button>
                </div>

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
                            order_type={order_type}
                            isSaving={handleIsSaving}
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
                            order_type={order_type}
                            isSaving={handleIsSaving}
                        />
                    )
                }

                {
                    !isWalkinOrder && activeTab === "shipping" && (
                        <ShippingForm 
                            changeTab={(tab) => setActiveTab(tab)}
                            shippingInfo={shipmentInfo}
                            order={order}
                            customer={selectedCustomer}
                            readOnly={isLocked}
                            isSaving={handleIsSaving}
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
                            order_type={order_type}
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
                            order_type={order_type}
                        /> 
                    )
                }
                

            
                <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">

                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">
                                Order Summary
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Review order and payment details
                            </p>
                        </div>

                        <button
                            type="button"
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                            onClick={copyOrderSummary}
                            title="Copy order summary"
                        >
                            <Copy size={18} strokeWidth={2} />
                        </button>
                    </div>


                    <div className="p-5">

                        {/* Customer */}
                        <div className="mb-5">
                            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                                Customer
                            </h2>

                            <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-100">
                                <p className="font-semibold text-gray-800 capitalize">
                                    {
                                        isWalkinOrder
                                            ? `${orderSummary.sender_name ?? "--"} / ${orderSummary.receiver_name ?? "--"}`
                                            : orderSummary.receiver_name ?? "--"
                                    }
                                </p>
                            </div>
                        </div>


                        {/* Order Breakdown */}
                        <div className="space-y-3">

                            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Order Details
                            </h2>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span className="font-medium text-gray-800">
                                    {formatCurrency(orderSummary.subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                    Discount
                                </span>

                                <span className="font-medium text-red-500">
                                    - {formatCurrency(orderSummary.discount)}
                                </span>
                            </div>

                            {!isWalkinOrder && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">
                                        Shipping fee
                                    </span>

                                    <span className="font-medium text-gray-800">
                                        {formatCurrency(orderSummary.shipping_fee)}
                                    </span>
                                </div>
                            )}

                        </div>


                        {/* Total */}
                        <div className="my-5 border-t border-dashed border-gray-300" />

                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">
                                Grand Total
                            </span>

                            <span className="text-xl font-bold text-green-600">
                                {formatCurrency(orderSummary.total_amount)}
                            </span>
                        </div>


                        {/* Payment */}
                        <div className="mt-5 bg-gray-50 rounded-lg p-4 space-y-3">

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Paid
                                </span>

                                <span className="font-semibold text-gray-800">
                                    {formatCurrency(orderSummary.total_paid ?? 0)}
                                </span>
                            </div>

                            <div className="border-t border-gray-200" />

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-600">
                                    Remaining Balance
                                </span>

                                <span className={`text-lg font-bold ${
                                    Number(orderSummary.remaining_balance) > 0
                                        ? "text-red-500"
                                        : "text-green-600"
                                }`}>
                                    {formatCurrency(orderSummary.remaining_balance)}
                                </span>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {
                showOrderHistory && (
                    <OrderStatusHistory 
                        onClose={() =>  setShowOrderHistory(false)}
                        statusHistory={orderStatusHistory}
                    />
                )
            }

            {
                isSaving && (
                    <div className="w-full h-screen">
                        <SaveLoading  />
                    </div>
                    
                )
            }


        </div>
        


    </>
}