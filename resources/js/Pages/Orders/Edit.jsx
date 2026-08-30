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
import OrderStatusDropdown from "../../Components/OrderStatusDropdown";
import OrderTypeDropdown from "../../Components/OrderTypeDropdown";
import SaveLoading from "../../Components/SaveLoading";


export default function Edit({order, order_type, status, customer, orderReferences, shipmentInfo, payments, orderSummary, user}){

    console.log("Order Type: ", order_type);

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

    
    const [isSaving, setIsSaving] = useState(false);
    
    const handleIsSaving = (status) => {
        setIsSaving(status);
    }

    return <>

        <Layout title={"Orders"} user={user}>
            
            <div className="flex justify-between items-center">

                <div className="flex items-center">
                    <button className="cursor-pointer" onClick={() => router.visit(route('order.index'))}>
                        <ChevronLeft size={30} />
                    </button>

                    <h1 className="text-xl font-bold">{order.transaction_number}</h1>    

                </div>

                <div className="flex gap-x-5 items-center">

                    <OrderTypeDropdown 
                        order={order} 
                        hasShipmentInfo={shipmentInfo}
                    />

                    <OrderStatusDropdown order={order} />

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
                

                <div className="rounded-md bg-white p-5 relative">
                    
                    <h1 className="mt-5 text-xl font-bold text-center border-b-2 border-gray-400 pb-1">Order Summary</h1>
                    
                    <div className="mt-5 border-b-2 border-gray-400 pb-5">

                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-sm font-semibold">Customer name:</h1>
                            <div className="border px-3 py-1 rounded-md text-center bg-[#F5F5F5] capitalize">
                                <span>
                                    {
                                        isWalkinOrder ? `${orderSummary.sender_name ?? "--"} / ${orderSummary.receiver_name ?? "--"}` 
                                        : orderSummary.receiver_name ?? "--"
                                    }
                                </span>
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

                        {
                            !isWalkinOrder && (
                                <div className="mt-3 w-full flex justify-center">
                                    <div className="flex flex-col gap-y-1">
                                        <h1 className="text-sm font-semibold">Shipping fee:</h1>
                                        <div className="border px-3 py-1 min-w-25 max-w-30 rounded-md text-center bg-[#F5F5F5]">
                                            <span>{formatCurrency(orderSummary.shipping_fee)}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        

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

            {
                isSaving && (
                    <div className="w-full h-screen">
                        <SaveLoading />
                    </div>
                    
                )
            }


        </Layout>
        


    </>
}