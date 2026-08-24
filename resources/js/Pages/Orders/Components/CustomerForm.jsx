import { useForm } from "@inertiajs/react";
import TextInput from "../../../Components/TextInput";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function CustomerForm({order, order_type, changeTab, customer, getSaveCustomers, readOnly, isSaving}){

    console.log("Read only: ", readOnly);
    
    const {data, setData, post, put, processing, errors} = useForm({
        sender_name: "",
        receiver_name: "",
        contact_number: null,
        address: "",
        is_save_customer: false
    });


    const handleFieldChange = (field, value) => {
        setData(data => ({
            ...data,
            [field]: value
        }));
    };

    const isWalkinOrder = order_type === 'walkin';


    const saveCustomer = (e) => {

        e.preventDefault();

        isSaving(true);


        console.log("Submitting...");
        
        post(route("order.customer.save", order.id), {

            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Customer saved!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                changeTab("order");
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "Save customer failed",
                    text: "Unable to save the customer.",
                });
                console.log("Errors: ", errors)
            },
            onFinish: () => isSaving(false)
        });
    

    }


    useEffect(() => {
        
        if(customer){
            
            console.log("Customer: ", customer);

            setData({
                sender_name: customer.sender_name,
                receiver_name: customer.receiver_name,
                contact_number: customer.contact_number,
                address: customer.address,
                is_save_customer: false
            });
        }


    }, [customer]);

    useEffect(() => {
        console.log("Customer Data:", data);
    }, [data]);




    return <>

        <form onSubmit={saveCustomer}>
            <div className="relative rounded-md bg-white p-5 h-125">
                
                <div className="flex justify-between items-center">
                    <div className="flex gap-x-10 items-center">
                        <h1 className="font-bold text-xl">Customer Information</h1>

                        {
                            !readOnly && (
                                <div className="flex gap-x-3 items-center">
                                    <input
                                        type="checkbox"
                                        id="is_save_customer"
                                        name="is_save_customer"
                                        checked={data.is_save_customer}
                                        disabled={readOnly}
                                        onChange={(e) => setData("is_save_customer", e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="is_save_customer">Add as frequent customer</label>
                                </div>
                            )
                        }
                        
                    </div>
                    
                    {
                        !readOnly && (
                            <button 
                                type="button"
                                className="text-green-500 font-semibold cursor-pointer hover:underline"
                                onClick={getSaveCustomers}
                            >
                                Customer book
                            </button>
                        )
                    }
                    
                </div>

                <div className="flex gap-x-3 items-start mt-12">
                    <div className="h-10 flex items-center">
                        <label htmlFor="receiver_name" className="text-md font-semibold">
                            <span className="text-red-500 text-sm">*</span> Customer Name: 
                        </label>
                    </div>

                    <TextInput 
                        name={"sender_name"}
                        placeholder="Enter customer name..."
                        type="text"
                        value={data.sender_name}
                        error={errors.sender_name}
                        isDisabled={readOnly}
                        onChange={(e) => handleFieldChange("sender_name", e.target.value)}
                    /> 

                </div>
                
                <div className="mt-5 flex gap-x-3 items-start">

                    <div className="h-10 flex items-center">
                        <label htmlFor="receiver_name" className="text-md font-semibold">
                            <span className="text-red-500 text-sm">*</span>  Receiver's name: 
                        </label>
                    </div>
                    

                    <TextInput 
                        name={"receiver_name"}
                        placeholder="Enter receiver's name..."
                        type="text"
                        value={data.receiver_name}
                        error={errors.receiver_name}
                        isDisabled={readOnly}
                        onChange={(e) => handleFieldChange("receiver_name", e.target.value)}
                    /> 

                </div>  

                <div className="mt-5 flex gap-x-3 items-start">
                    <div className="h-10 flex items-center">
                        <label htmlFor="receiver_name" className="text-md font-semibold">
                            <span className="text-red-500 text-sm">{!isWalkinOrder ? "*" : ""}</span> Contact Number: 
                        </label>
                    </div>

                    <TextInput 
                        name={"contact_number"}
                        placeholder="Enter contact number (11 digits)..."
                        type="text"
                        value={data.contact_number}
                        error={errors.contact_number}
                        isDisabled={readOnly}
                        onChange={(e) => handleFieldChange("contact_number", e.target.value)}
                    /> 

                </div>

                <div className="mt-5 flex gap-x-3 items-start">

                    <div className="h-10 flex items-center">
                        <label htmlFor="address" className="text-md font-semibold">
                            <span className="text-red-500 text-sm">{!isWalkinOrder ? "*" : ""}</span> Address:
                        </label>
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Enter address..."
                            name="address"
                            value={data.address}
                            disabled={readOnly}
                            className={`border rounded-md text-sm w-170 p-2 ${
                                readOnly 
                                    ? "bg-gray-100 border-gray-300 text-gray-500" 
                                    : "bg-white border-gray-400"
                            }`}
                            onChange={(e) => handleFieldChange("address", e.target.value)}
                        />

                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div>

                </div>
                {
                    !readOnly ? (
                        <div className="absolute bottom-5 right-3 flex justify-end">
                            <button type="submit" className="px-8 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 cursor-pointer">
                            Save
                            </button>
                        </div>
                    ):
                    (
                        <div className="absolute bottom-5 right-3 flex justify-end">
                            <button 
                                type="button" 
                                className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 cursor-pointer"
                                onClick={() => changeTab("order")}
                            >
                                Next
                            </button>
                        </div>
                    )
                }
                
            </div>
        </form>

    </>

}