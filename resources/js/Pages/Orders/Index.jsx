import Layout from "@/Layouts/AppLayout"
import { route } from "ziggy-js"
import { Link, router } from "@inertiajs/react"
import { useState } from "react";
import { formatDateTime } from "../../Utils/formatDateTime";
import { formatCurrency } from "../../Utils/formatCurrency";
import TextInput from "../../Components/TextInput";
import { CircleOff, HandCoins, PackageCheck, RotateCwFadingClock, Search, SquarePen, Truck } from "lucide-react";

export default function Index ({orders, user}){


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
        awaiting_shipping_fee: "bg-blue-500",
        awaiting_payment: "bg-red-500",
        payment_confirmed: "bg-blue-500",
        processing: "bg-yellow-500",
        shipped: "bg-green-500",
        cancelled: "bg-gray-800", 
    };

    const orderStatusDisplay = {
        awaiting_payment: "Unpaid",
        payment_confirmed: "Partial Payment",
        awaiting_shipping_fee: "Awaiting Shipping Fee"
    };

    const handleCreateOrder = (order_type) => {

        router.post(route('order.saveDraft'), {
            order_type: order_type
        });

    }




    return <>
        <Layout title={"Orders"} user={user}>
            
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



            <div className="mt-5">
                <div className="w-full flex justify-end relative">
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
                
                <table className="mt-5 w-full text-sm text-left border-collapse bg-white shadow-sm rounded-lg">
                    <thead className="text-gray-600 uppercase text-xs border-b border-gray-300">
                        <tr>
                            <th className="p-3">TRANSACTION NO. / ORDER NO.</th>
                            <th className="p-3">ORDER TYPE</th>
                            <th className="p-3">CUSTOMER NAME</th>
                            <th className="p-3">
                                {activeTab === "payment" ? "REMAINING BALANCE" : "TOTAL AMOUNT"}
                            </th>
                            <th className="p-3">STATUS</th>
                            <th className="p-3">
                                {activeTab === "shipped" ? "DATE SHIPPED" : "DATE CREATED"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isFetchingData ? 
                            <tr>
                                <td colSpan={6} className="py-12">
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
                                        <td className="p-3 capitalize">{order.order_type ?? "--"}</td>
                                        <td className="p-3">{order.sender_name ?? "--"}</td>
                                        <td className="p-3">
                                            {
                                                activeTab === "payment" 
                                                ? formatCurrency(order.remaining_balance ?? "0.00")  
                                                : formatCurrency(order.total_amount ?? "0.00")
                                            }
                                        </td>

                                        <td className="p-3">
                                            
                                            <span className={`py-1 px-3 rounded-full text-white font-semibold capitalize ${
                                                statusClasses[order.order_status] || "bg-gray-500"
                                            }`}>
                                                {orderStatusDisplay[order.order_status] ?? order.order_status}
                                            </span>
                                        </td>

                                        <td className="p-3">{formatDateTime(order.created_at)}</td>
                                    </tr>
                                ))
                            ) :
                            (
                                <tr className="text-center">
                                    <td colSpan={6} className="text-xl font-bold p-4">No orders found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

                {orders.data.length > 0 && (
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                        <span>
                            Showing {orders.from ?? 0}–{orders.to ?? 0} of {orders.total} orders
                        </span>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveState: true, preserveScroll: true, only: ['orders'] }
                                        )
                                    }
                                    className={`px-3 py-1 rounded ${
                                        link.active
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>



        </Layout>
    </>
}