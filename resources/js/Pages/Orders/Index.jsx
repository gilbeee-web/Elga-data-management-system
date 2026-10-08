import Layout from "@/Layouts/AppLayout"
import { route } from "ziggy-js"
import { Link, router } from "@inertiajs/react"
import { useState } from "react";
import { formatDateTime } from "../../Utils/formatDateTime";
import { formatCurrency } from "../../Utils/formatCurrency";
import TextInput from "../../Components/TextInput";
import { Ban, Check, CircleOff, Clipboard, HandCoins, PackageCheck, ReceiptText, RotateCwFadingClock, Search, SquarePen, Truck } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../../Components/Pagination";

export default function Index ({orders, user, products}){


    console.log("Orders: ", orders);

    const [isSelectingOrderType, setIsSelectingOrderType] = useState(false);

    const tabs = ['all', 'draft', 'shipping', 'payment', 'processing', 'shipped', 'cancelled'];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    const [currentSearch, setCurrentSearch] = useState(null);
    const [currentFilter, setCurrentFilter] = useState(null);

    const [isFetchingData, setIsFetchingData] = useState(false);

    const handleTab = (selectedTab) => {
        setIsFetchingData(true);

        let filterValue = selectedTab;
        if (selectedTab === "payment") {
            filterValue = "awaiting_payment";
        } else if (selectedTab === "shipping") {
            filterValue = "awaiting_shipping_fee";
        }

        setCurrentFilter(filterValue);
        setActiveTab(selectedTab);

        router.get(route('order.index'), { filter_status: filterValue, search: currentSearch }, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders'],
            onFinish: () => {
                setIsFetchingData(false);
            },
        });
    }

    const handleSearch = () => {
        
        setIsFetchingData(true);

        router.get(route('order.index'), { filter_status: currentFilter, search: currentSearch }, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders'],
            onFinish: () => {
                setIsFetchingData(false);
            }
        });
    };

    const statusClasses = {
        draft: "bg-gray-500",
        awaiting_shipping_fee: "bg-orange-500",
        awaiting_payment: "bg-red-500",
        payment_confirmed: "bg-yellow-500",
        processing: "bg-blue-500",
        shipped: "bg-green-500",
        cancelled: "bg-gray-800"
    };

    const orderStatusDisplay = {
        awaiting_payment: "Unpaid",
        payment_confirmed: "Fully Paid",
        awaiting_shipping_fee: "Awaiting Shipping Fee"
    };

    const handleCreateOrder = (order_type) => {
    
        if(products.length <= 0){
            Swal.fire({
                icon: "warning",
                title: "No Products Available",
                text: "There are no products available to add to this order. Please add a product first before creating an order."
            });

            return;
        }

        router.post(route('order.saveDraft'), {
            order_type: order_type
        });

    }

    const [currentPaymentStatus, setcurrentPaymentStatus] = useState("");

    const handleFilterPaymentStatus = (selectedStatus) => {

        console.log("fetching payment status");
        setIsFetchingData(true);

        setcurrentPaymentStatus(selectedStatus);

        // alert(selectedStatus);

        router.get(route('order.index'), { 
            filter_status: currentFilter, 
            search: currentSearch, 
            payment_status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders'],
            onFinish: () => {
                setIsFetchingData(false);
            }
        });

    }

    const [selectedOrderId, setSelectedOrderId] = useState([]);

    const handleSelectOrder = (orderId) => {

        setSelectedOrderId((prev) => {

            if (prev.includes(orderId)) {
                // Remove ID if already selected
                return prev.filter((id) => id !== orderId);
            }

            // Add ID if not selected
            return [...prev, orderId];
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all orders currently displayed
            const allOrderIds = orders.data.map((order) => order.id);

            setSelectedOrderId(allOrderIds);
        } else {
            // Unselect all
            setSelectedOrderId([]);
        }
    };


    const [isCancelling, setIsCancelling] = useState(false);

    const handleBulkCancelOrder = async () => {

        const result = await Swal.fire({
            title: "Cancel all selected orders?",
            text: "These action will cancel all the selected orders.",
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
    
        if (result.isConfirmed) {

            setIsCancelling(true);

            router.put(route('order.bulk.cancel'), {
                orderIds: selectedOrderId
            },{
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedOrderId([]);
                },

                onError: (errors) => {
                    Swal.fire({
                        title: "Unable to cancel orders",
                        text: errors.cancel ?? "Something went wrong.",
                        icon: "error",
                    });
                },

                onFinish: () => {
                    setIsCancelling(false);
                },
            });
        }

       

    }

    const [isPrinting, setIsPrinting] = useState(false);
    const handleBulkMarkPrintedReceipt = async () => {

        const result = await Swal.fire({
            title: "Selected order receipts already printed?",
            text: "Please make sure the receipt has been printed in Page365 before continuing.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
        });
    
        if(!result.isConfirmed){
            return;
        }else{
            setIsPrinting(true);
            router.put(route('order.bulk.receipt.printed'), {
                orderIds: selectedOrderId
            },{
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedOrderId([]);
                },

                onError: (errors) => {
                    Swal.fire({
                        title: "Unable to mark receipts",
                        text: errors.receipt ?? "Something went wrong.",
                        icon: "error",
                    });
                },

                onFinish: () => {
                    setIsPrinting(false);
                },
            });
        }
    }


    const [isCopied, setIsCopied] = useState(false);
    const copyTrackingNumber = async () => {

        const trackingNumbers = orders.data
            .filter(order => selectedOrderId.includes(order.id))
            .map(order => order.shipment.tracking_number);

        console.log(trackingNumbers);
    
        const message = trackingNumbers;

        await navigator.clipboard.writeText(message);

        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);

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

    const [isShipOrder, setIsShipOrder] = useState(false);
    const handleBulkShipOrder = async () => {

        const result = await Swal.fire({
            title: "Shipped selected orders?",
            text: "This can't be undone from here.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
        });
    
        if(!result.isConfirmed){
            return;
        }else{
            setIsShipOrder(true);
            router.put(route('order.bulk.ship'), {
                orderIds: selectedOrderId
            },{
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedOrderId([]);
                },

                onError: (errors) => {
                    Swal.fire({
                        title: "Ship failed",
                        text: "Unable to ship the order.",
                        icon: "error",
                    });
                },

                onFinish: () => {
                    setIsShipOrder(false);
                },
            });
        }
    }


    return <>
        <Layout user={user}>
            
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">
                    Order List
                </h1>

                <div className="relative">
                    <button 
                        className="rounded-md text-md bg-blue-500 px-3 py-2 text-white cursor-pointer hover:bg-blue-400 font-semibold"
                        onClick={() => setIsSelectingOrderType(!isSelectingOrderType)}
                    >
                        + Create order
                    </button>

                    {
                        isSelectingOrderType && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-40 z-20">
                                <button 
                                    onClick={() => handleCreateOrder("walkin")}
                                    className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                >
                                    Walk-in
                                </button>
                                <button 
                                    onClick={() => handleCreateOrder("shipment")}
                                    className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                >
                                    Shipment
                                </button>
                            </div>
                        )
                    }
                    
                </div>
                
            </div>

            {/* Navigation */}
            <div className="mt-10 flex gap-x-15 items-center">

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[0])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[0] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        All
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[1])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[1] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <SquarePen strokeWidth={2} size={20} />
                        Draft
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[2])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[2] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <Truck strokeWidth={2} size={20} />
                        Shipping
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[3])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[3] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <HandCoins strokeWidth={2} size={20} />
                        Payment
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[4])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[4] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <RotateCwFadingClock strokeWidth={2} size={20} />
                        Processing
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[5])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[5] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <PackageCheck strokeWidth={2} size={20} />
                        Shipped
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[6])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[6] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <CircleOff strokeWidth={2} size={20} />
                        Cancelled
                    </span>
                </button>

            </div>



            <div className="mt-8">
                <div className="w-full flex justify-between items-center">

                    <div className="flex gap-x-8 items-center">
                        
                        {
                            activeTab === tabs[3] && (
                                <div className="flex gap-x-2 items-center">
                                    <label htmlFor="payment_status" className="font-medium">Payment Status:</label>
                                    <select 
                                        name="payment_status"
                                        value={currentPaymentStatus}
                                        className="border border-gray-400 bg-white px-2 py-1 rounded-md max-w-55"
                                        onChange={(e) => handleFilterPaymentStatus(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="paid">Full Payment</option>
                                        <option value="partial">Partial Payment</option>
                                    </select>
                                </div>
                            )
                        }

                        {
                            selectedOrderId.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleBulkCancelOrder}
                                    disabled={isCancelling}
                                    className="p-2 rounded-xl flex gap-x-2 items-center bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                                >
                                    {isCancelling ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                                            <span>Cancelling orders...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Ban size={15} />
                                            <span>Cancel order ({selectedOrderId.length})</span>
                                        </>
                                    )}
                                </button>
                            )
                        }

                        {
                            (selectedOrderId.length > 0 && activeTab === tabs[3]) && (
                                <button
                                    type="button"
                                    onClick={handleBulkMarkPrintedReceipt}
                                    disabled={isPrinting}
                                    className="p-2 rounded-xl flex gap-x-2 items-center bg-green-500 hover:bg-green-400 text-white cursor-pointer"
                                >
                                    {isPrinting ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                                            <span>Marking receipt printed...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ReceiptText size={15}/>
                                            <span>Mark as receipt printed ({selectedOrderId.length})</span>
                                        </>
                                    )}
                                </button>
                            )
                        }

                        {
                            (selectedOrderId.length > 0 && activeTab === tabs[4]) && 
                            <>
                                <button
                                    type="button"
                                    onClick={copyTrackingNumber}
                                    className="p-2 rounded-xl flex gap-x-2 items-center bg-white hover:bg-gray-100 border border-gray-400 cursor-pointer"
                                >
                                    {
                                        isCopied ? <Check size={15}/> : <Clipboard size={15}/>
                                    }
                                    <span>Copy tracking number</span> 
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBulkShipOrder}
                                    className="p-2 rounded-xl flex gap-x-2 items-center bg-green-500 hover:bg-green-400 text-white cursor-pointer"
                                >
                                    <Truck  size={15}/>
                                    <span>{isShipOrder ? "Shipping orders..." : "Shipped Order"}</span> 
                                </button>
                            </>
                        }

                    </div>

                    <div className="relative">
                        <input 
                            type="text" 
                            className="min-w-xs rounded-md border border-gray-400 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            placeholder="Search order..."
                            value={currentSearch}
                            onChange={(e) => setCurrentSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === "Enter"){
                                    handleSearch(currentSearch);
                                }
                            }}
                        />

                        <button className="absolute top-0 right-0 h-full border-l border-gray-400 px-4 rounded-r-md flex items-center justify-center">
                            <Search size={20} strokeWidth={2} />
                        </button>
                    </div>

                    
                    
                </div>
                
                <table className="mt-5 w-full text-sm text-left border-collapse bg-white shadow-sm rounded-lg">
                    <thead className="text-gray-600 uppercase text-xs border-b border-gray-300">
                        <tr>
                            {
                                (activeTab !== "all" && activeTab !== "shipped" && activeTab !== "cancelled") && (
                                    <th className="p-3">
                                        <input 
                                            type="checkbox" 
                                            className="h-4 w-4" 
                                            checked={
                                                orders.data.length > 0 &&
                                                orders.data.every((order) => selectedOrderId.includes(order.id)) //check if the all id is selected
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )
                            }
                            
                            <th className="p-3">TRANSACTION NO. / ORDER NO.</th>
                            <th className="p-3">ORDER TYPE</th>
                            <th className="p-3">CUSTOMER / RECEIVER NAME</th>
                            <th className="p-3">
                                {activeTab === "payment" ? "REMAINING BALANCE" : "TOTAL AMOUNT"}
                            </th>
                            <th className="p-3">
                                {activeTab === "processing" && "J&T Tracking No."}
                            </th>
                            <th className="p-3">STATUS</th>
                            <th className="p-3">
                                {activeTab === "shipped" ? "DATE SHIPPED" : "DATE CREATED"}
                            </th>
                            {
                                (activeTab === "shipped" || activeTab === "all") && (
                                    <th className="p-3">REMARKS</th>
                                )
                            }

                            
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isFetchingData ? 
                            <tr>
                                <td colSpan={8} className="py-12">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                                        <span className="text-sm text-gray-500 font-medium">Loading orders...</span>
                                    </div>
                                </td>
                            </tr>
                            
                            : orders.data.length > 0 ?
                            (
                                orders.data.map((order) => (
                                    <tr 
                                        className="border-b border-gray-300 hover:bg-gray-100 cursor-pointer" 
                                        onClick={() => router.visit(route('order.edit', order.id))}
                                        key={order.id}
                                    >
                                        {
                                            (activeTab !== "all" && activeTab !== "shipped" && activeTab !== "cancelled") && (
                                                <td 
                                                    className="p-3"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedOrderId.includes(order.id)}
                                                        onChange={() => handleSelectOrder(order.id)}
                                                        className="h-4 w-4"
                                                    />
                                                </td>
                                            )
                                        }
                                        
                                        <td className="p-3">
                                            <h1 className="font-semibold">{order.transaction_number}</h1>
                                            
                                            {
                                                order.references.map((ref, index) => (
                                                  <span className="text-sm" key={index}>
                                                    #{ref.order_number} 
                                                    {index < order.references.length - 1 && " - "}
                                                  </span>  
                                            ))}
                                            
                                        </td>
                                        <td className="p-3">{order.order_type === "walkin" ? "Walk-in" : "Shipment"}</td>
                                        <td className="p-3">
                                            <h1 className="font-semibold">{order.sender_name ?? "--"}</h1>
                                            <span className="text-xs">{order.receiver_name !== order.sender_name ? order.receiver_name : ""}</span>
                                        </td>
                                        <td className="p-3">
                                            {
                                                activeTab === "payment" 
                                                ? formatCurrency(order.remaining_balance ?? "0.00")  
                                                : formatCurrency(order.total_amount ?? "0.00")
                                            }
                                        </td>

                                        <td className="p-3 capitalize">
                                            {activeTab === "processing" && order.shipment.tracking_number}
                                        </td>

                                        <td className="p-3">
                                            
                                            <span className={`py-1 px-3 rounded-full text-white font-semibold capitalize  ${
                                                order.payment_status === 'partial' ? 
                                                "bg-orange-500" 
                                                : statusClasses[order.order_status] || "bg-gray-500"
                                            }`}>

                                                {
                                                    order.payment_status !== 'partial' ? 
                                                    orderStatusDisplay[order.order_status] ?? order.order_status
                                                    : "Partial Payment" 
                                                }
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {activeTab === "shipped" ? formatDateTime(order.completed_at) : formatDateTime(order.created_at)}
                                        </td>
                                        {
                                            (activeTab === "shipped" || activeTab === "all") && (
                                                <td className="p-3">{order.remarks ?? "--"}</td>
                                            )
                                        }

                                    </tr>
                                ))
                            ) :
                            (
                                <tr className="text-center">
                                    <td colSpan={8} className="font-semibold p-4">No orders found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

                <Pagination
                    data={orders}
                    name="orders"
                />
            </div>



        </Layout>
    </>
}