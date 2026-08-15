import Layout from "../Layouts/AppLayout";
import SalesTrendChart from "../Components/SalesTrendChart";
import OrderStatusChart from "../Components/OrderStatusChart";
import SummaryCard from "../Components/SummaryCard";
import { formatCurrency } from "../Utils/formatCurrency";
import { formatDateTime } from "../Utils/formatDateTime";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { ChartNoAxesCombined, ClipboardClock, ShoppingCart, Truck } from "lucide-react";

export default function Dashboard ({
        totalSales, totalOrders, pendingOrders, totalSfCollected, recentOrders, salesTrend, orderStatusDistribution, view, user
}){

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

    const handleOverviewFilter = (e) => {
        const period = e.target.value;

        router.get(route('dashboard.index'), { period }, {
            preserveState: true,
            preserveScroll: true,
            only: ['totalSales', 'totalOrders', 'pendingOrders', 'totalSfCollected', 'period'],
        });
    };


    return <>
        <Layout title={"Dashboard"} user={user}>
            
            <div className="h-full w-[95%]">

                <div className="w-full flex justify-between items-center">
                    <h1 className="font-bold text-lg">Overview</h1>

                    <select 
                        className="rounded-lg shadow-sm bg-white py-1 px-2 text-sm"
                        onChange={handleOverviewFilter}
                    >
                        <option value="today">Today</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-10">
                    <SummaryCard 
                        cardName={"Sales"}
                        isCurrency={true}
                        value={totalSales}
                        icon={ChartNoAxesCombined}
                        
                    />

                    <SummaryCard 
                        cardName={"Orders"}
                        isCurrency={false}
                        value={totalOrders}
                        icon={ShoppingCart}
                       
                    />

                    <SummaryCard 
                        cardName={"Pending orders"}
                        isCurrency={false}
                        value={totalOrders}
                        icon={ClipboardClock}
                       
                    />

                    <SummaryCard 
                        cardName={"Shipping fee collected"}
                        isCurrency={true}
                        value={totalSfCollected}
                        icon={Truck}
                       
                    />
                </div>

                <div className="mt-5 grid grid-cols-[70%_28%] gap-5">
                    <div className="">
                        <SalesTrendChart salesTrend={salesTrend} view={view}/>
                    </div>
                    
                    <div className="">
                        <OrderStatusChart orderStatusBreakdown={orderStatusDistribution} />
                    </div>
                    
                </div>

                <div className="mt-5 pb-5">

                    <h1 className="text-lg font-bold">Recent Orders</h1>

                    <table className="mt-3 w-full text-sm text-left border-collapse bg-white shadow-md rounded-lg">
                        <thead className="text-gray-500 uppercase text-xs border-b border-gray-300">
                            <tr className="">
                                <th className="p-3">TRANSACTION NO. / ORDER NO.</th>
                                <th className="p-3">CUSTOMER NAME</th>
                                <th className="p-3">
                                    TOTAL AMOUNT
                                </th>
                                <th className="p-3">STATUS</th>
                                <th className="p-3">
                                    DATE CREATED
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                recentOrders.length > 0 ? (
                        
                                    recentOrders.map((order)=> (
                                        <tr 
                                            className="border-b border-gray-400 cursor-pointer hover:bg-gray-100"
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
                                            <td className="p-3">{order.sender_name ?? "--"}</td>
                                            <td className="p-3">{formatCurrency(order.total_amount ?? 0)}</td>
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
                                ):
                                (
                                    <td className="p-3" colSpan={5}>No recent orders found.</td>
                                )
                            }
                        </tbody>
                    </table>


                </div>
                
            </div>
            
        </Layout>
    </>
}