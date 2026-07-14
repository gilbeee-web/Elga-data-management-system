import TextInput from "../../../Components/TextInput";

export default function OrderForm(){

    return <>

        



        <form>
            <div className="rounded-md bg-white p-5 h-120 overflow-y-auto">

                <div className="flex justify-between items-center bg-white sticky top-0">
                    
                    <h1 className="text-xl font-bold">Order Items</h1>
                    
                    <h2 className="text-md font-bold">Grand Total: <span className="bg-green-500 px-5 py-1 rounded-full text-white">₱5000.00</span> </h2>

                </div>

                <div className="mt-5 max-w-[90%]">
                    <div className="bg-white shadow-md border rounded-lg min-h-60 flex flex-col gap-y-10">

                        <div className="flex justify-between items-center bg-[#D9D9D9] rounded-t-lg border-b px-3">

                            <div className="flex gap-x-3 items-center p-2">
                                <label htmlFor="" className="text-sm font-semibold">Order Number: </label>
                                <input type="text" className="border rounded-md bg-white py-1 px-2"/>
                            </div>

                            <div className="flex gap-x-5 items-center">
                                <h1 className="font-semibold">Qty: 0</h1>
                                <h1 className="font-semibold">₱5000.00</h1>
                            </div>

                        </div>

                        <div className="flex flex-col gap-y-3 justify-center items-center">
                            <h1 className="text-xl font-bold">Your order is empty.</h1>

                            <div className="flex justify-center">
                                <button 
                                    className="bg-green-500 px-3 py-1 text-white rounded-md cursor-pointer hover:bg-green-400"
                                >
                                    + Add Item 
                                </button>
                            </div>   
                            

                        </div>



                    </div>

                    <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 border-t border-gray-300"></div>

                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                            + Add Order Number
                        </button>

                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 border-t border-gray-300"></div>

                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                            + Add Order Number
                        </button>

                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 border-t border-gray-300"></div>

                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                            + Add Order Number
                        </button>

                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                </div>  
                
                



            </div>
        </form>
    
    
    </>


}