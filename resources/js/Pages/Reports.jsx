import { useState } from "react";
import Layout from "../Layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";
import SummaryCard from "../Components/SummaryCard"; 
import { formatDateTime } from "../Utils/formatDateTime";
import { formatCurrency } from "../Utils/formatCurrency";
import ReportFilterModal from "../Components/ReportFilterModal";
import ExportButton from "../Components/ExportButton";
import { ArrowLeftRight, ChartNoAxesCombined, Funnel, Search, Truck } from "lucide-react";

export default function Reports({filters, summaryCards, transactions, user}){

    console.log("Summary cards: ", summaryCards.totalOrders);
    console.log("Transactions: ", transactions);


    const [openFilter, setOpenFilter] = useState(false);

    const [searchVal, setSearchVal] = useState("");
    const [isFetchingData, setIsFetchingData] = useState(false);

    const handleSearch = () => {
        setIsFetchingData(true);

        router.get(route('report.index'), {
            ...filters,
            search: searchVal,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsFetchingData(false),
        });
    };

    const [isExport, setIsExport] = useState(false);

    return <>

        <Layout title={"Reports"} user={user}>

            <h1 className="font-bold text-2xl">Sales Report</h1>

            <div className="w-full mt-5 flex justify-between items-center">

                <div className="flex gap-x-5 items-center">
                
                    <div className="flex items-center gap-2 bg-white border border-[#E2E0D8] rounded-lg px-3 h-10 w-100">
                        <Search strokeWidth={1} size={20} color="gray"/>

                        <input
                            type="text"
                            placeholder="Search transaction..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                    handleSearch();
                                }
                            }}
                            className="w-full border-none outline-none text-sm text-[#2C2C2A] placeholder:text-[#8A8880] bg-transparent"
                        />
                    </div>
                    

                   <button 
                        className="flex gap-x-2 items-center border border-gray-300 shadow-sm px-3 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => setOpenFilter(true)}
                    >
                        <Funnel strokeWidth={2} size={15} />

                        <span className="text-sm font-semibold">Filter</span>

                    </button>

                </div>

                <div>
                
                    <ExportButton filters={filters}/>

                </div>


            </div>

            {
                openFilter && (
                    <ReportFilterModal 
                        onClose={() => setOpenFilter(false)}
                        initialFilters={filters}
                    />
                )
            }


            <div className="mt-5 grid grid-cols-3 gap-10">

                <SummaryCard 
                    cardName={"Transactions"}
                    isCurrency={false}
                    value={summaryCards.totalTransactions}
                    icon={ArrowLeftRight}
                    
                />

                <SummaryCard 
                    cardName={"Sales"}
                    isCurrency={true}
                    value={summaryCards.totalSales}
                    icon={ChartNoAxesCombined}
                    
                />

                

                <SummaryCard 
                    cardName={"Shipping fee collected"}
                    isCurrency={true}
                    value={summaryCards.totalSfCollected}
                    icon={Truck}
                />
            </div>

            <div className="mt-5 pb-5">

                <h1 className="text-lg font-bold">Transactions</h1>

                <table className="mt-3 w-full text-sm text-left border-collapse bg-white shadow-md rounded-lg">
                    <thead className="text-gray-500 uppercase text-xs border-b border-gray-300">
                        <tr className="">
                            <th className="p-3">TRANSACTION NO.</th>
                            <th className="p-3">CUSTOMER NAME</th>
                            <th className="p-3">PAYMENT TYPE</th>
                            <th className="p-3">
                                AMOUNT PAID
                            </th>
                            <th className="p-3">MODE OF PAYMENT</th>
                            <th className="p-3">REFERENCE NO.</th>
                            <th className="p-3">
                                PAYMENT DATE
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isFetchingData ? 
                                <tr>
                                    <td colSpan={7} className="py-12">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                                            <span className="text-sm text-gray-500 font-medium">Loading transaction...</span>
                                        </div>
                                    </td>
                                </tr>

                            :transactions.data.length > 0 ? (
                    
                                transactions.data.map((transaction)=> (
                                    <tr 
                                        className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                        onClick={() => router.visit(route('order.edit', transaction.order.id))}
                                        key={transaction.id}
                                    >
                                        <td className="p-3">
                                            <h1 className="font-semibold">{transaction.order.transaction_number}</h1>
                                        </td>
                                        <td className="p-3">{transaction.order.sender_name ?? "--"}</td>
                                        <td className="p-3 capitalize">{
                                            transaction.payment_type === 'down_payment' ? 
                                            "Down Payment" : transaction.payment_type
                                        }</td>
                                        <td className="p-3">{formatCurrency(transaction.payment_amount ?? 0)}</td>
                                        <td className="p-3">
                                            <h1 className="capitalize font-semibold">{transaction.payment_method}</h1>
                                            <span className="text-xs">{transaction.mop_name}</span>
                                        </td>
                                        <td className="p-3">{transaction.reference_number}</td>
                                        <td className="p-3">{formatDateTime(transaction.paid_at)}</td>
                                    
                                    </tr>
                                    
                                    
                                ))
                            ):
                            (
                                <td className="p-3" colSpan={7}>No transactions found.</td>
                            )
                        }

                    </tbody>
                </table>
                
                {transactions.data.length > 0 && (
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                        <span>
                            Showing {transactions.from ?? 0}–{transactions.to ?? 0} of {transactions.total} transactions
                        </span>
                        <div className="flex gap-1">
                            {transactions.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveState: true, preserveScroll: true}
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