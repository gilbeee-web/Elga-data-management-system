import { useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import ProductListModal from "./ProductListModal";
import { route } from "ziggy-js";
import { router, useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import Swal from "sweetalert2";

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
            Swal.fire({
                icon: "error",
                title: "Unable to add order item",
                text: "Please enter the order number first.",
            });
            // alert("Please enter an order number first.");
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


    //item total with discount 
    const getItemTotal = (item) => {

        const variant = item.variants.find((v) => v.id === item.selected_variant_id); // find the variant

        const price = variant ? variant.price : 0;

        //formula for subtotal
        const finalPrice = price - item.discount; 

        const subtotal = finalPrice * item.qty;

        // if subtotal is less than 0 return 0 to avoid negative number or subtotal
        return subtotal < 0 ? 0 : subtotal; 
    };

    const getItemAmount = (item) => {

        const variant = item.variants.find((v) => v.id === item.selected_variant_id); // find the variant

        const price = variant ? variant.price : 0;

        const totalAmount = price * item.qty;

        
        return totalAmount < 0 ? 0 : totalAmount; 
    };




    const getOrderTotals = (order) => {
        let totalQty = 0;
        let totalDiscount = 0;
        let totalSubtotal = 0;
        let finalTotal = 0;

        order.items.forEach((item) => {
            totalQty += item.qty;
            totalSubtotal += item.variant_price * item.qty;
            totalDiscount += item.discount * item.qty;
            finalTotal += getItemTotal(item);
        });

        return { totalQty, totalSubtotal, totalDiscount, finalTotal };
    };


    const getGrandTotals = () => {
        let grand_totalQty = 0;
        let grand_totalDiscount = 0;
        let grand_totalSubtotal = 0;
        let grand_finalTotal = 0;

        data.orderReferences.forEach((order) => {

            const orderTotals = getOrderTotals(order);

            grand_totalQty += orderTotals.totalQty;
            grand_totalDiscount += orderTotals.totalDiscount;
            grand_totalSubtotal += orderTotals.totalSubtotal;
            grand_finalTotal += orderTotals.finalTotal;
        });

        return { grand_totalQty, grand_totalSubtotal, grand_totalDiscount, grand_finalTotal };
    };

    const grandTotals = getGrandTotals();


    const saveOrderItems = (e) => {

        e.preventDefault();

        console.log("Submitting...");
        
        post(route("order.saveOrderItem", order.id), {

            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Order items saved!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                changeTab("shipping");
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "Save order items failed",
                    text: Object.values(errors)[0],
                });

                console.log("Errors: ", errors)
            },
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


                    <div className="mt-5 px-5 pt-2">

                        {/* Order Card */}
                        {
                            data.orderReferences.map((order, orderIndex) => {

                                const { totalQty, totalSubtotal, totalDiscount, finalTotal } = getOrderTotals(order);

                                return(
                                    <div className="mb-5" key={orderIndex}>

                                        <div className="bg-white shadow-sm border border-gray-300 rounded-lg min-h-60 flex flex-col gap-y-3">

                                            <div className="flex justify-between items-center">

                                                <div className="flex gap-x-3 items-center p-2">
                                                    <label htmlFor="" className="text-sm font-semibold">Order Number: </label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Enter order number"
                                                        value={order.order_number}
                                                        onChange={(e) => handleOrderNumberChange(orderIndex, e.target.value)}
                                                        className="border border-gray-400 rounded-md bg-white py-1 px-2"
                                                    />
                                                </div>

                                                <div>
                                                    {
                                                        data.orderReferences.length > 1 && (
                                                            <button 
                                                                onClick={() => handleRemoveOrder(orderIndex)}
                                                                type="button"
                                                                className="cursor-pointer p-3"
                                                            >
                                                            <img src={"/images/icons/delete-icon.svg"} alt="Delete Icon" className="object-contain w-8 h-8 border rounded-md hover:bg-gray-100"/>
                                                            </button>
                                                        )
                                                    }
                                                </div>


                                            </div>
                                            {
                                                totalQty > 0 && (
                                                    <div className="w-full grid grid-cols-4 bg-[#F7F7F4] p-5 items-center justify-center">
                                                
                                                        <div className="w-full flex flex-col justify-center">
                                                            <label className="text-sm text-gray-500 font-semibold">Qty:</label>
                                                            <h1 className="font-bold text-lg">{totalQty}</h1>
                                                        </div>

                                                        <div className="w-full flex flex-col justify-center">
                                                            <label className="text-sm text-gray-500 font-semibold">Discount:</label>
                                                            <h1 className="font-bold text-lg">{formatCurrency(totalDiscount)}</h1>
                                                        </div>

                                                        <div className="w-full flex flex-col justify-center">
                                                            <label className="text-sm text-gray-500 font-semibold">Subtotal:</label>
                                                            <h1 className="font-bold text-lg">{formatCurrency(totalSubtotal)}</h1>
                                                        </div>



                                                        <div className="w-full flex flex-col justify-center">
                                                            <label className="text-sm text-gray-500 font-semibold">Total:</label>
                                                            <h1 className="font-bold text-xl text-red-500">{formatCurrency(finalTotal)}</h1>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            
                                            
                                            {
                                                order.items.length === 0 ? (
                                                    <div className="mt-3 flex flex-col gap-y-3 justify-center items-center">
                                                        <h1 className="text-xl font-bold">Your order is empty.</h1>

                                                        <div className="flex justify-center">
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleOpenProductList(orderIndex)}
                                                                className="bg-blue-500 px-3 py-1 text-white rounded-md cursor-pointer hover:bg-blue-400"
                                                            >
                                                                + Add Item 
                                                            </button>
                                                        </div>   
                                                        

                                                    </div>
                                                ): 
                                                (
                                                    <div className="flex flex-col px-4 pb-4">
                                                        {order.items.map((item, itemIndex) => (
                                                            <div
                                                                key={itemIndex}
                                                                className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 items-center border-b border-gray-100 py-3 last:border-b-0"
                                                            >
                                                                {/* Product */}
                                                                <div className="flex gap-x-3 items-center min-w-0">
                                                                    <div className="border border-gray-200 rounded-md flex-shrink-0 h-12 w-12 overflow-hidden bg-[#F7F7F4]">
                                                                        <img
                                                                            src={`/storage/${item.image}`}
                                                                            alt={item.name}
                                                                            className="h-full w-full object-cover object-center"
                                                                        />
                                                                    </div>

                                                                    <div className="flex flex-col min-w-0">
                                                                        <h1 className="text-sm font-medium uppercase truncate">
                                                                            {item.name}
                                                                        </h1>

                                                                        <select
                                                                            value={item.selected_variant_id ?? ""}
                                                                            onChange={(e) =>
                                                                                handleItemChange(orderIndex, itemIndex, "selected_variant_id", Number(e.target.value))
                                                                            }
                                                                            className="text-xs text-gray-500 cursor-pointer bg-transparent focus:outline-none"
                                                                        >
                                                                            {item.variants.map((variant) => (
                                                                                <option value={variant.id} key={variant.id}>
                                                                                    {variant.variant_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {/* Price / Qty / Discount / Total / Remove */}
                                                                <div className="flex gap-x-4 items-end">

                                                                    {/* Read-only: muted fill, no border */}
                                                                    <div className="flex flex-col items-center">
                                                                        <label className="text-xs text-gray-400 mb-1">Price</label>
                                                                        <div className="py-1.5 px-2 min-w-20 rounded-md bg-[#F5F5F5] text-center text-sm text-gray-600">
                                                                            {formatCurrency(item.variant_price)}
                                                                        </div>
                                                                    </div>

                                                                    {/* Editable: white bg, visible border */}
                                                                    <div className="flex flex-col items-center">
                                                                        <label className="text-xs text-gray-400 mb-1">Qty</label>
                                                                        <input
                                                                            type="number"
                                                                            min={1}
                                                                            value={item.qty}
                                                                            onChange={(e) =>
                                                                                handleItemChange(orderIndex, itemIndex, "qty", Number(e.target.value))
                                                                            }
                                                                            className="py-1.5 border border-gray-300 w-16 rounded-md text-center text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                                                        />
                                                                    </div>

                                                                    {/* Editable */}
                                                                    <div className="flex flex-col items-center">
                                                                        <label className="text-xs text-gray-400 mb-1">Discount</label>
                                                                        <input
                                                                            type="text"
                                                                            value={Number(item.discount ?? 0)}
                                                                            onChange={(e) =>
                                                                                handleItemChange(orderIndex, itemIndex, "discount", Number(e.target.value))
                                                                            }
                                                                            className="py-1.5 border border-gray-300 w-16 rounded-md text-center text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                                                        />
                                                                    </div>

                                                                    {/* Read-only, bold since it's a result */}
                                                                    <div className="flex flex-col items-center">
                                                                        <label className="text-xs text-gray-400 mb-1">Total</label>
                                                                        <div className="py-1.5 px-2 min-w-20 rounded-md bg-[#F5F5F5] text-center text-sm font-medium text-gray-900">
                                                                            {formatCurrency(getItemTotal(item))}
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleRemoveItem(orderIndex, itemIndex)}
                                                                        type="button"
                                                                        aria-label="Remove item"
                                                                        className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-md border border-gray-300 text-red-600 hover:bg-red-50 flex-shrink-0"
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="flex justify-center mt-4">
                                                            <button
                                                                type="button"
                                                                className="text-sm text-gray-500 border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-md flex items-center gap-1 cursor-pointer"
                                                                onClick={() => handleOpenProductList(orderIndex)}
                                                            >
                                                                + Add item
                                                            </button>
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
                                        className="border px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
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

            <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-6 py-4 flex items-center justify-between">
 
                <div className="flex items-center gap-7">

                   
            
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Qty</span>
                        <span className="text-sm font-medium text-gray-900">{grandTotals.grand_totalQty}</span>
                    </div>
            
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Subtotal</span>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(grandTotals.grand_totalSubtotal)}</span>
                    </div>
            
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Discount</span>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(grandTotals.grand_totalDiscount)}</span>
                    </div>
            
                    <div className="w-px h-9 bg-gray-200" />
            
                    <div className="flex flex-col">
                        <span className="text-xs text-red-500">Grand Total</span>
                        <span className="text-2xl font-semibold text-red-700">{formatCurrency(grandTotals.grand_finalTotal)}</span>
                    </div>
            
                </div>
            
                <button
                    type="submit"
                    className="h-[42px] px-7 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md cursor-pointer"
                >
                    Save
                </button>
            
            </div>

            {/* <div className="bg-white shadow-lg border border-gray-400 rounded-md min-h-20 w-full">
                    
                <div className="h-full flex justify-between items-center px-5">

                    <div className="flex gap-x-5 items-center">
                        <h1>Subtotal: {formatCurrency(grandTotals.grand_totalSubtotal)}</h1>
                        <h1>Grand Total: {formatCurrency(grandTotals.grand_finalTotal)}</h1>
                        <h1>Total Discount: {formatCurrency(grandTotals.grand_totalDiscount)}</h1>
                        <h1>Total Qty: {grandTotals.grand_totalQty}</h1>
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

                

            </div> */}
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