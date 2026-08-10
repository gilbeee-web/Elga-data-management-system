import { useForm } from "@inertiajs/react"
import { useEffect, useState } from "react";
import { route } from "ziggy-js";

export default function ReportFilterModal({onClose, initialFilters}){

    const {data, setData, processing, errors, get} = useForm({
        period: "",
        sort_by: "",
        sort_direction: "",
        dateFrom: "",
        dateTo: "",
    });

    const customPeriod = data.period === 'custom';
    
    useEffect(() => {

        if (data.period !== 'custom') {
            setData('dateFrom', '');
            setData('dateTo', '');
        }

    }, [data.period]);

    const handleGenerateReport = (e) => {
        e.preventDefault();

        get(route('report.index'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                console.log("Error: ", errors);
            },
        });
    };

    useEffect(() => {

        if(initialFilters){
            setData({
                period: initialFilters.period,
                sort_by: initialFilters.sort_by,
                sort_direction: initialFilters.sort_direction,
                dateFrom: initialFilters.dateFrom,
                dateTo: initialFilters.dateTo
            });
        }

    }, [initialFilters])



    return (
    
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
        
            <div className="w-full bg-white sm:max-w-md md:max-w-xl lg:max-w-sm rounded-md shadow p-3 pt-3 overflow-y-auto min-h-[50vh]">

                {/* Header */}
                <div className="w-full flex justify-between items-center border-b border-gray-300">
                    
                    <h1 className="text-lg font-bold capitalize">
                        Filter Report
                    </h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form className="mt-5" onSubmit={handleGenerateReport}>
                    <div className="flex flex-col">
                        <h1 className="mb-2 font-semibold">Period</h1>

                        <div className="flex flex-col gap-y-3">
                            <div className="flex gap-x-5 items-center">
                                <div className="flex gap-x-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="period"
                                        id="daily"
                                        value="daily"
                                        checked={data.period === 'daily'}
                                        onChange={(e) => setData('period', e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="daily" className="text-sm">Today</label>
                                </div>

                                <div className="flex gap-x-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="period"
                                        id="weekly"
                                        value="weekly"
                                        checked={data.period === 'weekly'}
                                        onChange={(e) => setData('period', e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="weekly" className="text-sm">This Week</label>
                                </div>

                                <div className="flex gap-x-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="period"
                                        id="monthly"
                                        value="monthly"
                                        checked={data.period === 'monthly'}
                                        onChange={(e) => setData('period', e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="monthly" className="text-sm">This Month</label>
                                </div>
                            </div>

                            <div className="flex gap-x-5 items-center">
                                <div className="flex gap-x-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="period"
                                        id="yearly"
                                        value="yearly"
                                        checked={data.period === 'yearly'}
                                        onChange={(e) => setData('period', e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="yearly" className="text-sm">This Year</label>
                                </div>

                                <div className="flex gap-x-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="period"
                                        id="custom"
                                        value="custom"
                                        checked={data.period === 'custom'}
                                        onChange={(e) => setData('period', e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="custom" className="text-sm">Custom</label>
                                </div>
                            </div>

                            {customPeriod && (
                                <div className="mt-3">
                                    <h1 className="text-sm font-semibold mb-2">Custom Period:</h1>

                                    <div className="flex gap-x-3 items-center">
                                        <input 
                                            type="date" 
                                            className="bg-white rounded-md border border-gray-300 p-2"
                                            value={data.dateFrom}
                                            onChange={(e) => setData("dateFrom", e.target.value)}
                                        />
                                        <span className="text-sm font-semibold">to</span>
                                        <input 
                                            type="date" 
                                            className="bg-white rounded-md border border-gray-300 p-2"
                                            min={data.dateFrom || undefined} 
                                            value={data.dateTo}
                                            onChange={(e) => setData("dateTo", e.target.value)}
                                        />
                                    </div>

                                    {errors.dateTo && (
                                        <p className="text-red-500 text-xs mt-1">{errors.dateTo}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col">
                        <h1 className="mb-2 font-semibold">Sort By</h1>

                        <div className="flex flex-col gap-y-3">
                            <div className="flex gap-x-2 items-center">
                                <input 
                                    type="radio" 
                                    name="sort_by"
                                    id="paid_at"
                                    value="paid_at"
                                    checked={data.sort_by === 'paid_at'}
                                    onChange={(e) => setData("sort_by", e.target.value)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="paid_at" className="text-sm">Payment Date</label>
                            </div>

                            <div className="flex gap-x-2 items-center">
                                <input 
                                    type="radio" 
                                    name="sort_by"
                                    id="payment_amount"
                                    value="payment_amount"
                                    checked={data.sort_by === 'payment_amount'}
                                    onChange={(e) => setData("sort_by", e.target.value)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="payment_amount" className="text-sm">Amount Paid</label>
                            </div>

                            <div className="flex gap-x-2 items-center">
                                <input 
                                    type="radio" 
                                    name="sort_by"
                                    id="payment_type"
                                    value="payment_type"
                                    checked={data.sort_by === 'payment_type'}
                                    onChange={(e) => setData("sort_by", e.target.value)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="payment_type" className="text-sm">Payment Type</label>
                            </div>

                            <div className="flex gap-x-2 items-center">
                                <input 
                                    type="radio" 
                                    name="sort_by"
                                    id="payment_method"
                                    value="payment_method"
                                    checked={data.sort_by === 'payment_method'}
                                    onChange={(e) => setData("sort_by", e.target.value)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="payment_method" className="text-sm">Mode of Payment</label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col">
                        <h1 className="mb-2 font-semibold">Order</h1>

                        <div className="flex gap-x-5 items-center">
                            <div className="flex gap-x-2 items-center">
                                <input 
                                    type="radio" 
                                    name="sort_direction"
                                    id="ascending"
                                    value="asc"
                                    checked={data.sort_direction === 'asc'}
                                    onChange={(e) => setData("sort_direction", e.target.value)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="ascending" className="text-sm">Ascending</label>
                            </div>

                            <div className="flex gap-x-2 items-center">
                                <input 
                                    type="radio" 
                                    name="sort_direction"
                                    id="descending"
                                    value="desc"
                                    checked={data.sort_direction === 'desc'}
                                    onChange={(e) => setData("sort_direction", e.target.value)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="descending" className="text-sm">Descending</label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 w-full flex justify-end">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-500 hover:bg-green-400 rounded-md px-3 py-2 text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </form>


            </div>
        </div>
    
    
    
    )


}