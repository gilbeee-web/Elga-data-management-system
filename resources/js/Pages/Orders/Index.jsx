import Layout from "@/Layouts/AppLayout"
import { route } from "ziggy-js"
import { Link, router } from "@inertiajs/react"
import { useState } from "react";
import { formatDateTime } from "../../Utils/formatDateTime";
import { formatCurrency } from "../../Utils/formatCurrency";

export default function Index ({orders}){


    console.log("Orders: ", orders);

    const tabs = ['all', 'draft', 'shipping', 'payment', 'processing', 'shipped'];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    const [currentSearch, setCurrentSearch] = useState(null);

    const handleTab = (selectedTab) => {

        let filterStatus = selectedTab;

        if(selectedTab === 'payment'){
            filterStatus = "awaiting_payment";
        }else if(selectedTab === "shipping"){
            filterStatus = "awaiting_shipping_fee";
        }

        router.get(route('order.index'), {filter_status: filterStatus, search: currentSearch}, {
            preserveState: true,
            preserveScroll: true,
            only:['orders'],
        });

        setActiveTab(selectedTab);
    }

    const handleSearch = (value) => {
        router.get(route('order.index'), { filter_status: currentFilter, search: value }, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders'],
        });
    };

    const statusClasses = {
        draft: "bg-gray-500",
        awaiting_shipping_fee: "bg-blue-500",
        awaiting_payment: "bg-red-500",
        payment_confirmed: "bg-blue-500",
        processing: "bg-yellow-500",
        shipped: "bg-green-500",
    };

    const orderStatusDisplay = {
        awaiting_payment: "Unpaid",
        payment_confirmed: "Partial Payment",
        awaiting_shipping_fee: "Awaiting Shipping Fee"
    };



    return <>
        <Layout title={"Orders"}>
            
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl border-b-3 inline-block border-red-500">
                    Order List
                </h1>

                <button 
                    className="rounded-md text-md bg-green-500 px-3 py-2 text-white cursor-pointer hover:bg-green-400"
                    onClick={() => router.post(route('order.saveDraft'))}
                >
                    + Create order
                </button>
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
                        className={`text-2xl font-bold ${
                            activeTab === tabs[1] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Draft
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
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
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
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
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[4])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[4] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Processing
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[5])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[5] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Shipped
                    </span>
                </button>

            </div>



            <div className="mt-10">
                
                <table className="w-full text-sm text-left border-collapse bg-white shadow-md rounded-lg">
                    <thead className="text-gray-600 uppercase text-xs border-b border-gray-300">
                        <tr className="bg-gray-300">
                            <th className="p-3">TRANSACTION NUMBER / ORDER NUM</th>
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
                        {orders.data.length > 0 ?
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
                                                  <span className="text-sm">
                                                    {ref.order_number} 
                                                    {index < order.references.length - 1 && " - "}
                                                  </span>  
                                            ))}
                                            
                                        </td>
                                        <td className="p-3">{order.sender_name}</td>
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
                                    <td colSpan={4} className="text-xl font-bold p-4">No orders yet.</td>
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