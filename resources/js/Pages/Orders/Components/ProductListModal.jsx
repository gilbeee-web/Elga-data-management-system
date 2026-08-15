import { useState } from "react";
import { formatCurrency } from "../../../Utils/formatCurrency";

export default function ProductListModal({onClose, products, onAddProducts}){
    

    console.log("Products: ", products);


    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleSelect = (product) => {
        // check if this product is already selected
        const alreadySelected = selectedProducts.some((p) => p.id === product.id);

        if (alreadySelected) {
            // it's already selected, so remove it
            const updatedList = selectedProducts.filter((p) => p.id !== product.id);
            setSelectedProducts(updatedList);
        } else {
            // it's not selected yet, so add it
            const updatedList = [...selectedProducts, product];
            setSelectedProducts(updatedList);
        }
    };

    const isSelected = (id) => selectedProducts.some((p) => p.id === id); // check if the current product is already selected

    const handleAddProduct = () => {

        console.log("Selected Products: ", selectedProducts);

        onAddProducts(selectedProducts); // send selected products to parent
        setSelectedProducts([]);         // reset local selection
        onClose();                       // close the modal
    };


    const [filterValue, setFilterValue] = useState({
        searchName: "",
        category: ""
    });


    const filteredProducts = products.filter((product) => {

        const matchSearch = product.name.toLowerCase().includes(filterValue.searchName.toLowerCase());
        const matchCategory = filterValue.category === "" || product.category === filterValue.category;

        return matchSearch && matchCategory;

    });



    return <>

        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
            
            <div className="w-full bg-white sm:max-w-md md:max-w-2xl lg:max-w-3xl rounded-md shadow p-5 pt-3 overflow-y-auto min-h-[50vh] max-h-[90vh]">

                {/* Header */}

                <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                    
                    <h1 className="text-xl font-bold capitalize">Add Order Item</h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>


                <div className="mt-5 flex justify-between">
                    <div className="flex flex-col">
                        <label htmlFor="">Search product(s):</label>
                        <input 
                            value={filterValue.searchName}
                            onChange={(e) =>
                                setFilterValue((prev) => ({
                                    ...prev,
                                    searchName: e.target.value,
                                }))
                            }
                            type="text" 
                            className="min-w-120 border border-gray-400 rounded-md px-2 py-2 bg-white"
                            placeholder="Enter product name..."
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="">Category:</label>
                        <select 
                            value={filterValue.category}
                            onChange={(e) =>
                                setFilterValue((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                }))
                            }
                            className="min-w-50 border border-gray-400 rounded-md px-2 py-2 bg-white"
                        >
                            <option value="">All</option>
                            <option value="bag">Bags</option>
                            <option value="clothes">Clothes</option>
                            <option value="footwear">Footwear</option>
                            <option value="perfume">Perfume</option>
                        </select>
                    </div>
                </div>


                <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-5 px-3">
                    {
                        filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                                
                                const selected = isSelected(product.id);
                                return (
                                    <div 
                                        key={product.id} 
                                        className={`bg-white shadow-md p-3 flex justify-between rounded-md border cursor-pointer transition-colors ${
                                            selected
                                                ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50"
                                                : "border-gray-300"
                                        }`}
                                        onClick={() => toggleSelect(product)}
                                    >
                                        <div className="flex gap-x-5">

                                            <div className="border border-gray-200 rounded-md flex-shrink-0 h-20 w-20 overflow-hidden">
                                                <img 
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name} 
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="flex flex-col justify-between">
                                                <div className="flex flex-col">
                                                    <h1 className="text-lg font-semibold capitalize">{product.name}</h1>
                                                    <span className="text-sm text-gray-400 font-semibold capitalize">{product.category}</span>
                                                </div>

                                                <div>
                                                    <h1>{formatCurrency(product.variants_min_price ?? 0)}</h1>
                                                </div>
                                                
                                            </div>

                                            
                                        </div>
                                        

                                    </div>
                                )
                            })
                        ) :(
                            <div className="w-full flex justify-center items-center col-span-2 my-10">
                                <h1 className="text-lg font-bold text-gray-400">No products found.</h1>
                            </div>
                        )
                    }
                </div>


                <div className="border-t-2 border-gray-300 pt-3 mt-5">
                    <div className="flex gap-x-5 items-center justify-end">
                        <button 
                            onClick={onClose}
                            className="bg-gray-400 rounded-md text-white px-3 py-2 hover:bg-gray-300 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button 
                            className="bg-green-500 rounded-md text-white px-3 py-2 hover:bg-green-300 cursor-pointer"
                            onClick={handleAddProduct}
                        >
                            Add product {
                                selectedProducts.length > 0 && (
                                    <span>({selectedProducts.length})</span>
                                )
                            }
                        </button>
                    </div>
                </div>


            </div>
        </div>
    
    
    </>

}