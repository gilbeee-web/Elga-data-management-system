export default function CustomerBook({customers, selectCustomer ,onClose}){

    console.log("customers: ", customers);


    return <>
    
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center">

            <div className="w-full bg-white sm:max-w-md md:max-w-2xl lg:max-w-5xl rounded-md shadow p-5 pt-3 overflow-y-auto max-h-[90vh]">
                
                <div className="flex justify-between items-center">

                    <h1 className="font-bold text-xl">Customer Book</h1>
                    
                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>

                </div>


                <div className="mt-5">
                    <table className="mt-5 w-full text-sm text-left shadow-md rounded-lg">

                        <thead className="text-gray-600 text-md border-b border-gray-300">
                            <tr className="bg-gray-100">
                                <th className="p-3">Sender Name</th>
                                <th className="p-3">Receiver Name</th>
                                <th className="p-3">Contact number</th>
                                <th className="p-3 text-center">Address</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        {
                            customers && customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-gray-300">
                                        <td className="p-3 capitalize text-gray-600 font-semibold">{customer.sender_name}</td>
                                        <td className="p-3 capitalize text-gray-600 font-semibold">{customer.receiver_name}</td>
                                        <td className="p-3 capitalize text-gray-600 font-semibold">{customer.contact_number}</td>
                                        <td className="p-3 max-w-2xs truncate capitalize text-gray-600 font-semibold">{customer.address}</td>
                                        <td className="p-3 capitalize text-gray-600 font-semibold">
                                            <button 
                                                className="text-green-500 hover:underline cursor-pointer"
                                                onClick={() => selectCustomer(customer)}
                                            >
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                
                                <tr>
                                    <td colSpan={5} className="text-center font-bold text-lg p-4">
                                        No customers yet.
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>

                    </table>
                </div>




            </div>
        </div>
    
    
    
    
    </>



}