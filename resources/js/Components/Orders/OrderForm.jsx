import { useForm } from "@inertiajs/react";

export default function OrderForm({children}){

    const form = useForm({
        customer_name: "",
        order_number: "",
        order_items: {
            item_name: "",
            price: 0,
            qty: 0,
            discount: 0
        }
    });

    function handleSubmit(e){

        e.preventDefault();
        
        form.post(route('order.store'));

    }

    return (

        <form onSubmit={handleSubmit} className="w-[40%] p-5 border rounded-md mt-10">
            <div>
                <label className="block mb-1 font-medium">
                    Customer Name
                </label>

                <input
                    type="text"
                    value={form.data.customer_name}
                    onChange={(e) =>
                        form.setData(
                            'customer_name',
                            e.target.value
                        )
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter customer name"
                />

                {form.errors.customer_name && (
                    <p className="text-red-500 text-sm mt-1">
                        {form.errors.customer_name}
                    </p>
                )}
            </div>
        </form>
    );



}