import { router } from "@inertiajs/react"
import Layout from "../../Layouts/AppLayout"
import { route } from "ziggy-js";
import { useState } from "react";
import ProductModal from "./Components/ProductModal";

export default function Dashboard ({products}){

    const [productInfo, setProductInfo] = useState(null);

    const viewProduct = async (id) => {
        
        console.log("View product: ", id);

        try {
            
            const response = await fetch(route('product.view', id));

            if(!response){
                alert("Something went wrong");
            }

            const result = await response.json();

            console.log("Product info: ", result);

            setProductInfo(result.product);

        } catch (error) {
            console.log("Errors: ", error);
        }
    }


    const handleEditProduct = (id) => {
        router.visit(route('product.edit', id));
    }

    const tabs = ['all', 'clothes', 'bags', 'footwear', 'perfume', 'skincare'];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    return <>
        <Layout title={"Products"}>
            
            
            <div className="w-full flex justify-between items-center">

                <h1 className="font-bold text-2xl border-b-3 inline-block border-red-500">
                    Product List
                </h1>

                <button 
                    className="rounded-md text-md bg-blue-500 px-3 py-2 text-white cursor-pointer hover:bg-blue-400"
                    onClick={() => router.visit(route("product.create"))}
                >
                    + Add product
                </button>

            </div>

            
            {/* Navigation */}
            <div className="mt-10 flex gap-x-15 items-center">

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
                        All
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
                        Clothes
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
                        Bags
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
                        Footwear
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
                        Perfumes
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[5])}
                >
                    <span
                        className={`text-2xl font-bold ${
                            activeTab === tabs[5] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        Skincare
                    </span>
                </button>

                <div className="ml-20 relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search product..."
                        className="w-full rounded-md py-2 pl-3 bg-white"
                    />

                    <button className="absolute top-0 right-0 h-full px-4 bg-[#DF9BAA] rounded-r-md flex items-center justify-center">
                        <img
                            src="/images/icons/search-icon.png"
                            alt="Search"
                            className="w-5 h-5"
                        />
                    </button>
                </div>

            </div>

            {/* <div className="w-full mt-5 flex justify-end">

               <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search product..."
                        className="w-full rounded-md py-2 pl-3 bg-white"
                    />

                    <button className="absolute top-0 right-0 h-full px-4 bg-[#DF9BAA] rounded-r-md flex items-center justify-center">
                        <img
                            src="/images/icons/search-icon.png"
                            alt="Search"
                            className="w-5 h-5"
                        />
                    </button>
                </div>

            </div> */}

            <div className="grid grid-cols-4 gap-x-10 mt-10">

                {products.data.length > 0 ? (
                    products.data.map((product) => (
                        <div key={product.id}>
                            
                            <div 
                                className="bg-green-50 border-2 border-[#DF9BAA] rounded-xl shadow relative cursor-pointer transition-transform duration-200 hover:scale-105"
                                onClick={() => viewProduct(product.id)}
                            >
                                
                                <div 
                                    className="absolute top-2 right-2 bg-[#E0DD94] text-[#949556] text-xs px-3 py-1 font-bold rounded-full"
                                >
                                    Sold: {product.variants_sum_sold}
                                </div>

                                <img 
                                    src={product.image ? `/storage/${product.image}` : 'images/default_product.png'}
                                    alt="Product Image" 
                                    className="w-full h-40 object-cover object-center rounded-t-xl"
                                />

                               
                                <div className="px-3 py-2">
                                    <h1 className="font-semibold text-xl">{ product.name }</h1>
                                    <p className="text-sm text-gray-500 capitalize font-semibold">{product.category}</p>
                                </div>

                                <div className="px-3 py-2">
                                    {product.variants_min_price === product.variants_max_price ? (
                                        <span className="font-semibold text-green-500">₱{product.variants_min_price}</span>
                                    ) : (
                                        <span className="font-semibold">
                                            ₱{product.variants_min_price} - ₱{product.variants_max_price}
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        className="border border-dashed h-80 bg-white rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => router.visit(route("product.create"))}
                    >
                        <div className="flex h-full items-center justify-center">
                            <h1>+ Add Product</h1>
                        </div>
                    </div>
                )}
                
            </div>


            {
                productInfo && (
                    <ProductModal 
                        product={productInfo}
                        onClose={() => setProductInfo(null)}
                        editProduct={handleEditProduct}
                    />
                )
            }



            
        </Layout>
    </>
}