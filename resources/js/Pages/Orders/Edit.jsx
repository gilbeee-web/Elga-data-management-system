import Layout from "@/Layouts/AppLayout"
import { useForm, Link, router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import TextInput from "../../Components/TextInput";
import CustomerForm from "./Components/CustomerForm";
import OrderForm from "./Components/OrderForm";
import { route } from "ziggy-js";
import CustomerBook from "./Components/CustomerBook";


export default function Edit({order, status, customer}){

    const [selectedCustomer, setSelectedCustomer] = useState(customer);

    const tabs = ['customer', 'order', 'shipping', 'payment', 'shipment'];

    const [activeTab, setActiveTab] = useState("customer");

    console.log("Current Customer: ", customer);
    


    const handleTab = (selectedTab) => {
        
        console.log("Tab: ", selectedTab);

        setActiveTab(selectedTab);

    }

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



    
    return <>

        <Layout>
            
            <div className="flex justify-between items-center">

                <div className="flex items-center">
                    <button className="cursor-pointer" onClick={() => router.visit(route('order.index'))}>
                        <img src="/images/icons/arrow-back.png" alt="Arrow back"  className="object-contain w-8 h-8"/>
                    </button>

                    <h1 className="text-xl font-bold">{order.transaction_number}</h1>    

                </div>

                <div className="flex gap-x-3 items-center">
                    <h1 className="text-lg font-bold">Status:</h1>
                    <span className="bg-gray-400 px-5 py-2 rounded-md text-white capitalize font-semibold">
                        {order.order_status}
                    </span>
                </div>
            </div>


            <div className="mt-10 w-[75%] grid grid-cols-5 gap-10 pl-5">

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
                        Customer
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
                        Order
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
                        Shipment
                    </span>
                </button>

            </div>

            <div className="mt-8 grid grid-cols-[75%_25%] gap-4">
                {
                    activeTab === "customer" && (
                        <CustomerForm 
                            changeTab={handleTab} 
                            order={order} 
                            customer={selectedCustomer}
                            getSaveCustomers={handleGetSaveCustomers}
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
                        <OrderForm />
                    )
                }
                

                <div className="rounded-md bg-white p-5">
                    
                    <h1 className="text-xl font-bold text-center border-b-2 border-gray-400 pb-1">Order Summary</h1>
                    
                    <div className="mt-5 border-b-2 border-gray-400 pb-5">

                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-sm font-semibold">Customer name:</h1>
                            <div className="border px-5 py-1 rounded-md text-center bg-[#F5F5F5]">
                                <span>Gilbert Sta. Maria</span>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Subtotal:</h1>
                                <div className="border px-10 py-1 min-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>1233</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Discount:</h1>
                                <div className="border px-10 py-1 min-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>1233</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 w-full flex justify-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Shipping fee:</h1>
                                <div className="border px-10 py-1 min-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>1233</span>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="mt-5 w-full flex flex-col gap-y-3 justify-center">

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Grand Total:</h1>
                                <div className="border px-10 py-1 min-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>1233</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Paid:</h1>
                                <div className="border px-10 py-1 min-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>12</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold">Remaining balance:</h1>
                                <div className="border px-10 py-1 min-w-30 rounded-md text-center bg-[#F5F5F5]">
                                    <span>1233.00</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    

                </div>
            </div>


        </Layout>
        


    </>
}