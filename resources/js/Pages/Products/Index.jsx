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

    return <>
        <Layout title={"Products"}>
            
            
            <div className="w-full flex justify-between">

                <h1 className="font-bold text-2xl border-b-3 inline-block border-red-500">
                    Product List
                </h1>

                <button 
                    className="rounded-md text-md bg-green-500 px-3 text-white cursor-pointer hover:bg-green-400"
                    onClick={() => router.visit(route("product.create"))}
                >
                    + Add product
                </button>

            </div>

            <div className="w-full flex justify-between mt-8">

                <div>
                    <select 
                        name="category_filter" 
                        className="border bg-white px-5 py-2 rounded-md"
                    >
                        <option value="" disabled hidden>Select Category</option>
                        <option value="bag">Bag</option>
                        <option value="clothes">Clothes</option>
                        <option value="footwear">Footwear</option>
                        <option value="perfume">Perfume</option>
                    </select>
                </div>


               <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search product..."
                        className="w-full rounded-md py-2 pl-3 pr-14 bg-white"
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

            <div className="grid grid-cols-3 gap-x-20 mt-5">

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
                                    <p className="text-md text-gray-500 capitalize">{product.category}</p>
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