import Layout from "@/Layouts/AppLayout"
import { route } from "ziggy-js"
import { Link, router } from "@inertiajs/react"
import { useState } from "react";

export default function Index ({orders}){


    console.log("Orders: ", orders);

    const tabs = ['all', 'draft', 'shipping', 'payment', 'processing', 'shipped'];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleTab = (selectedTab) => {

        setActiveTab(selectedTab);

    }

    const statusClasses = {
        draft: "bg-gray-100",
        shipping_fee: "bg-blue-100",
        payment: "bg-red-100",
        processing: "bg-yellow-100",
        shipped: "bg-green-100"
    };


    console.log("Order List: ", orders);



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
                            <th className="p-3">TRANSACTION NUMBER</th>
                            <th className="p-3">CUSTOMER NAME</th>
                            <th className="p-3">ORDER NUMBER</th>
                            <th className="p-3">STATUS</th>
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
                                        <td className="p-3">{order.transaction_number}</td>
                                        <td className="p-3">{order.sender_name}</td>
                                        <td className="p-3">{order.reference ?? 'N/A'}</td>
                                        <td className="p-3">
                                            <span className={`py-1 px-3 rounded-full text-white font-semibold capitalize ${
                                                statusClasses[order.order_satus] || "bg-gray-500"
                                            }`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        {/* <td className="p-3">
                                            <button 
                                                className="text-green-400 hover:underline cursor-pointer"
                                                onClick={() => router.visit(route('order.edit', order.id))}
                                            >
                                                View
                                            </button>
                                        </td> */}
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