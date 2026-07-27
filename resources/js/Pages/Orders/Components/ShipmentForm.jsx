import { formatCurrency } from "../../../Utils/formatCurrency";

export default function ShipmentForm({order, customer, orderReferences, shippingInfo, changeTab}){

    console.log("Order references: ", orderReferences);
    
    const saveShipment = () => {

    }

    return <>

        <form 
            onSubmit={saveShipment}
            className="flex flex-col gap-y-3"
        >  
            <div className="rounded-md bg-white h-135 p-5 overflow-y-auto">

                <h1 className="text-xl font-bold">Review Transaction</h1>


                <div className="mt-5 w-[80%] border-2 border-gray-300 shadow-sm rounded-lg px-5 py-5">

                    <h1 className="font-bold text-lg">Customer Information</h1>

                    <div className="mt-5 flex gap-x-20">

                        <div className="flex flex-col gap-y-5">

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold text-gray-500">Customer Name:</h1>
                                <div className="border px-3 py-1 min-w-50 max-w-70 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold">{customer.sender_name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold text-gray-500">Contact Number:</h1>
                                <div className="border px-3 py-1 min-w-50 max-w-70 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold">{customer.contact_number}</span>
                                </div>
                            </div>

                            
                            
                        </div>


                        <div className="flex flex-col gap-y-5">

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold text-gray-500">Receiver's Name:</h1>
                                <div className="border px-3 py-1 min-w-50 max-w-60 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold">{customer.receiver_name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-sm font-semibold text-gray-500">Address:</h1>
                                <div className="border px-3 py-1 min-w-50 max-w-80 rounded-md text-center bg-[#F5F5F5]">
                                    <span className="font-semibold text-sm">{customer.address}</span>
                                </div>
                            </div>
                            
                        </div>

                    </div>

                </div>


                <div className="mt-10 w-[80%] border-2 border-gray-300 shadow-sm rounded-lg px-5 py-5">

                    <h1 className="font-bold text-lg">Order Items</h1>

                    {
                        orderReferences.map((order) => (
                            <div 
                                key={order.id}
                                className="mt-5 rounded-lg border min-h-60 flex flex-col gap-y-3 w-[80%]"
                            > 

                                <div className="rounded-t-lg border-b-2 border-gray-300 px-3 py-2">
                                    <h1 className="text-lg font-bold">#{order.order_number}</h1>
                                </div>

                                <div 
                                    className="flex flex-col gap-y-2 px-3 pb-3 "
                                >
                                    {
                                        order.items.map((item, itemIndex) => (
                                            <div 
                                                key={itemIndex} 
                                                className="flex justify-between"
                                            >
                                                <div className="flex gap-x-3">
                                                    <div 
                                                        className="border border-gray-200 rounded-md flex-shrink-0 h-15 w-15 overflow-hidden"
                                                    >
                                                        <img 
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name} 
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <h1 className="uppercase font-bold">{item.name}</h1>
                                                        <h1 className="uppercase text-sm text-gray-400">
                                                            {item.variant_name}
                                                        </h1>
                                                    </div>
                                                </div>


                                                <div className="flex flex-col items-end">
                                                    <h1 className="font-bold">{formatCurrency(item.variant_price)}</h1>
                                                    <h1 className="text-sm text-sm text-gray-400">x{item.qty}</h1>
                                                </div>
                                                
                                                

                                            </div>
                                    ))}
                                


                                </div>





                            </div>
                        ))
                    }
                    

                </div>



            </div>
        </form>

    
    </>



}