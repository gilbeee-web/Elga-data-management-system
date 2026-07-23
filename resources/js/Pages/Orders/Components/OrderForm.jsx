import { useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import ProductListModal from "./ProductListModal";
import { route } from "ziggy-js";
import { router, useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";

export default function OrderForm({order, changeTab, orderReferences: initialOrderReferences}){


    console.log("Order Form (order references init): ", initialOrderReferences);

    const {data, setData, post, proccessing, errors} = useForm({
        orderReferences: [
            {
                order_number: "",
                items: []
            }
        ]
    });

    
    const [activerOrderIndex, setActiverOrderIndex] = useState(null);

    const [products, setProducts] = useState(null);

    const handleOpenProductList = async (index) => {

        const order = data.orderReferences[index];

        if (!order.order_number.trim()) {
            alert("Please enter an order number first.");
            return;
        }


        try{

            const response = await fetch(route('product.getAllProducts'));

            if(!response){
                alert("Something went wrong");
            }

            const result = await response.json();

            console.log("Fetch products: ", result);
            if(result){
                setProducts(result);
                setActiverOrderIndex(index); // set which order number that opened the modal
            }


        }catch(error){
            console.log("Error: ", error)
        }

    }

    const handleAddOrder = () => {
        setData("orderReferences", [
            ...data.orderReferences,
            { 
                order_number: "", 
                items: [] 
            }
        ]);
    };

    const handleRemoveOrder = (index) => {
        setData(
            "orderReferences",
            data.orderReferences.filter((_, i) => i !== index)
        );
    };


    const handleAddedProducts = (addedProducts) => {

        console.log("Product added: ", addedProducts);

        //copy the original array of added products so it doesnt update directly
        const updated = [...data.orderReferences];  

        // get the specific order number to update
        const targetOrder = updated[activerOrderIndex]; 

        // collect the ids that exists in the target order
        const existingIds = new Set(targetOrder.items.map((item) => item.id)); 

        // make a default value to the new added products and also filter the products by existing ids
        const newItems = addedProducts
            .filter((p) => !existingIds.has(p.id))
            .map((p) => ({
                ...p,
                selected_variant_id: p.variants?.[0]?.id ?? null, // default to first variant
                qty: 1,
                discount: 0,
                variant_price: p.variants?.[0]?.price
            }));

        //merge the new added products to the current order items
        updated[activerOrderIndex] = {
            ...targetOrder,
            items: [...targetOrder.items, ...newItems]
        }

        // set the updated data to the form
        setData("orderReferences", updated);

        setProducts(null); //close the modal of productList after adding 
    }

    const handleItemChange = (orderIndex, itemIndex, field, value) => {

        // copy the original or existing (added products)
        const updated = [...data.orderReferences];

        // get the target order number by its index
        const targetOrder = updated[orderIndex];

        // get the target orderItems by its index
        const targetItems = [...targetOrder.items];

        //get the current item to updateor change
        const currentItem = targetItems[itemIndex];

        // update first all the common field that changes value
        let updatedItem = {
            ...currentItem,
            [field]: value,
        };

        // if the variant changed, find the variant by its id and update the price
        if (field === "selected_variant_id") {

            const selectedVariant = currentItem.variants.find(
                (v) => v.id === value
            );

            updatedItem = {
                ...updatedItem,
                variant_price: selectedVariant?.price ?? currentItem.variant_price,
            };
        }

        //update the target items by its new values
        targetItems[itemIndex] = updatedItem;

        //update the  order and the info of the target items
        updated[orderIndex] = {
            ...targetOrder,
            items: targetItems,
        };

        console.log("Updated Items: ", updated);

        setData("orderReferences", updated);
    };


    const handleOrderNumberChange = (orderIndex, value) => {
        const updated = [...data.orderReferences];

        // get the target order number by its index
        const targetOrder = updated[orderIndex];

        updated[orderIndex] = {
            ...targetOrder,
            order_number: value,
        };

        setData("orderReferences", updated);
    }

    const handleRemoveItem = (orderIndex,itemIndex) => {
        
        const updated = [...data.orderReferences];
        const targetOrder = updated[orderIndex];

        const updatedItems = targetOrder.items.filter((_, i) => i !== itemIndex);

        updated[orderIndex] = {
            ...targetOrder,
            items: updatedItems
        }

        setData("orderReferences", updated);

    }


    const [orderInfo, setOrderInfo] = useState({
        totalQty: 0,
        totalDisc: 0,
        subtotal: 0
    });


    const getSubtotal = (item) => {

        const variant = item.variants.find((v) => v.id === item.selected_variant_id); // find the variant

        const price = variant ? variant.price : 0;

        //formula for subtotal
        const finalPrice = price - item.discount; 

        const subtotal = finalPrice * item.qty;

        // if subtotal is less than 0 return 0 to avoid negative number or subtotal
        return subtotal < 0 ? 0 : subtotal; 
    };

    const getOrderTotals = (order) => {
        let totalQty = 0;
        let totalDiscount = 0;
        let totalSubtotal = 0;

        order.items.forEach((item) => {
            totalQty += item.qty;
            totalDiscount += item.discount * item.qty;
            totalSubtotal += getSubtotal(item);
        });

        return { totalQty, totalDiscount, totalSubtotal };
    };


    const getGrandTotals = () => {
        let totalQty = 0;
        let totalDiscount = 0;
        let totalSubtotal = 0;

        data.orderReferences.forEach((order) => {
            const orderTotals = getOrderTotals(order);
            totalQty += orderTotals.totalQty;
            totalDiscount += orderTotals.totalDiscount;
            totalSubtotal += orderTotals.totalSubtotal;
        });

        return { totalQty, totalDiscount, totalSubtotal };
    };

    const grandTotals = getGrandTotals();


    const saveOrderItems = (e) => {

        e.preventDefault();

        console.log("Submitting...");
        
        post(route("order.saveOrderItem", order.id), {
            
            onSuccess: () => {
                changeTab("shipping");
            },

            onError: (errors) => {
                console.log("Errors: ", errors)
            }
        });
    }

    useEffect(() => {
        if (initialOrderReferences.length > 0) {
            console.log("Order References:", initialOrderReferences);

            setData({
                orderReferences: initialOrderReferences,
            });
        }
    }, [initialOrderReferences]);

    useEffect(() => {
        console.log("Order Form Data:", data);
    }, [data]);




    return <>

        <form onSubmit={saveOrderItems} className="flex flex-col gap-y-3">  
            <div className="rounded-md bg-white h-115 overflow-y-auto flex flex-col">

                <div className="flex-1">
                    {/* Tab Header  */}
                    <div className="flex justify-between items-center bg-white px-5 pt-5">
                        
                        <h1 className="text-xl font-bold">Order Items</h1>
                        
                    </div>


                    <div className="mt-5 max-w-[90%] px-5 pt-2">

                        {/* Order Card */}
                        {
                            data.orderReferences.map((order, orderIndex) => {

                                const { totalQty, totalDiscount, totalSubtotal } = getOrderTotals(order);

                                return(
                                    <div className="mb-5" key={orderIndex}>

                                        <div className="bg-white shadow-md border rounded-lg min-h-60 flex flex-col gap-y-3">

                                            <div className="flex justify-between items-center bg-[#D9D9D9] rounded-t-lg border-b px-3">

                                                <div className="flex gap-x-3 items-center p-2">
                                                    <label htmlFor="" className="text-sm font-semibold">Order Number: </label>
                                                    <input 
                                                        type="text" 
                                                        value={order.order_number}
                                                        onChange={(e) => handleOrderNumberChange(orderIndex, e.target.value)}
                                                        className="border rounded-md bg-white py-1 px-2"
                                                    />
                                                </div>

                                                <div className="flex gap-x-5 items-center">
                                                    <h1 className="font-semibold">Qty: {totalQty}</h1>
                                                    <h1 className="font-semibold">Discount: {formatCurrency(totalDiscount)}</h1>
                                                    <h1 className="font-semibold">{formatCurrency(totalSubtotal)}</h1>

                                                    {
                                                        data.orderReferences.length > 1 && (
                                                            <button 
                                                                onClick={() => handleRemoveOrder(orderIndex)}
                                                                type="button"
                                                                className="cursor-pointer"
                                                            >
                                                            <img src={"/images/icons/delete-icon.svg"} alt="Delete Icon" className="object-contain w-8 h-8"/>
                                                            </button>
                                                        )
                                                    }

                                                </div>

                                            </div>
                                            
                                            {
                                                order.items.length === 0 ? (
                                                    <div className="mt-3 flex flex-col gap-y-3 justify-center items-center">
                                                        <h1 className="text-xl font-bold">Your order is empty.</h1>

                                                        <div className="flex justify-center">
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleOpenProductList(orderIndex)}
                                                                className="bg-green-500 px-3 py-1 text-white rounded-md cursor-pointer hover:bg-green-400"
                                                            >
                                                                + Add Item 
                                                            </button>
                                                        </div>   
                                                        

                                                    </div>
                                                ): 
                                                (
                                                    <div 
                                                        className="flex flex-col gap-y-2 px-3 pb-3 "
                                                    >
                                                        {
                                                            order.items.map((item, itemIndex) => (
                                                                <div key={itemIndex} className="grid grid-cols-[25%_75%] gap-x-10 border-b border-gray-400 pb-3 px-3">
                                                                    
                                                                    <div className="flex gap-x-3">

                                                                        <div 
                                                                            className="border border-gray-200 rounded-md flex-shrink-0 h-12 w-12 overflow-hidden"
                                                                        >
                                                                            <img 
                                                                                src={`/storage/${item.image}`}
                                                                                alt={item.name} 
                                                                                className="h-full w-full object-cover object-center"
                                                                            />
                                                                        </div>

                                                                        <div className="flex flex-col">
                                                                            <h1 className="text-sm font-bold max-w-25">
                                                                                {item.name}
                                                                            </h1>

                                                                            <select 
                                                                                value={item.selected_variant_id ?? ""}
                                                                                onChange={(e) =>
                                                                                    handleItemChange(orderIndex, itemIndex, "selected_variant_id", Number(e.target.value))
                                                                                } 
                                                                                className="text-sm font-semibold text-gray-400 cursor-pointer"
                                                                            >
                                                                                {
                                                                                    item.variants.map((variant) => (
                                                                                        <option value={variant.id} key={variant.id}>
                                                                                            {variant.variant_name}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                        </div>

                                                                    </div>


                                                                    <div className="flex gap-x-5 items-center">
                                                                        
                                                                        <div className="flex gap-x-2 items-center">
                                                                            <label htmlFor="" className="font-bold text-sm">Qty:</label>
                                                                            <input 
                                                                                type="number" 
                                                                                min={0}
                                                                                value={item.qty}
                                                                                onChange={(e) =>
                                                                                    handleItemChange(orderIndex, itemIndex, "qty", Number(e.target.value))
                                                                                }
                                                                                className="px-3 py-1 border border-gray-400 max-w-20 rounded-xl text-center bg-[#F5F5F5]"
                                                                            />
                                                                        </div>

                                                                        <div className="flex gap-x-2 items-center">
                                                                            <label htmlFor="" className="font-bold text-sm">Discount:</label>
                                                                            <input 
                                                                                type="number" 
                                                                                min={0}
                                                                                onChange={(e) =>
                                                                                    handleItemChange(orderIndex, itemIndex, "discount", Number(e.target.value))
                                                                                }
                                                                                className="px-3 py-1 border border-gray-400 max-w-20 rounded-xl text-center bg-[#F5F5F5]"
                                                                            />
                                                                        </div>

                                                                        <div className="flex gap-x-2 items-center">
                                                                            <label htmlFor="" className="font-bold text-sm">Subtotal:</label>
                                                                            <div className="py-1 min-w-23 max-w-30 border border-gray-400 rounded-xl bg-[#F5F5F5] text-center">
                                                                                <span>{formatCurrency(getSubtotal(item))}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="">
                                                                            <button onClick={() => handleRemoveItem(orderIndex, itemIndex)}>
                                                                                <img 
                                                                                    src={'/images/icons/remove-btn.svg'} 
                                                                                    alt="Remove Btn" 
                                                                                    className="cursor-pointer object-contain h-5 w-5"
                                                                                />
                                                                            </button>
                                                                        </div>

                                                                    </div>


                                                                    
                                                            

                                                            
                                                                </div>
                                                            ))
                                                        }


                                                        <div className="flex items-center gap-4 mt-4">
                                                            <div className="flex-1 border-t border-gray-300"></div>

                                                            <button 
                                                                type="button"
                                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                                                                onClick={() => handleOpenProductList(orderIndex)}
                                                            >
                                                                + Add Item
                                                            </button>

                                                            <div className="flex-1 border-t border-gray-300"></div>
                                                        </div>


                                                        
                                                    </div>
                                                )
                                            }
                                            



                                        </div>
                                    </div>
                                )
                                
                                
                            })
                        }
                        
                        {
                            data.orderReferences?.length > 0 && data.orderReferences[0].items?.length > 0 && (

                                <div className="h-full flex items-center gap-4 pb-5">
                                    <div className="flex-1 border-t border-gray-300"></div>

                                    <button 
                                        type="button"
                                        className="border px-4 py-2 rounded-md cursor-pointer"
                                        onClick={handleAddOrder}
                                    >
                                        + Add Order Number
                                    </button>

                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>
                            )
                        }

                        
                    </div>  
                </div>
                
            </div>

            <div className="bg-white shadow-lg border border-gray-400 rounded-md min-h-20 w-full">
                    
                <div className="h-full flex justify-between items-center px-5">

                    <div className="flex gap-x-5 items-center">
                        <h1>Grand Total: {formatCurrency(grandTotals.totalSubtotal)}</h1>
                        <h1>Total Discount: {formatCurrency(grandTotals.totalDiscount)}</h1>
                        <h1>Total Qty: {grandTotals.totalQty}</h1>
                    </div>

                    <div className="">
                        <button
                            disabled={data.orderReferences?.length > 0 && data.orderReferences[0].items.length <= 0}
                            className={
                                data.orderReferences?.length > 0 && data.orderReferences[0].items.length > 0
                                    ? "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                                    : "bg-gray-400 text-white px-4 py-2 rounded-md cursor-pointer"
                            }
                            type="submit"
                        >
                            Save
                        </button>
                    </div>


                </div>

                

            </div>
        </form>

        {/* modal to search and add product to order number */}

        {
            products && (
                <ProductListModal 
                    products={products}
                    onClose={() => setProducts(null)}
                    onAddProducts={handleAddedProducts}
                />
            )
        }
        
    
    
    </>


}