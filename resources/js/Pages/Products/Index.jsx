import { router } from "@inertiajs/react"
import Layout from "../../Layouts/AppLayout"
import { route } from "ziggy-js";
import { useEffect, useState } from "react";
import ProductModal from "./Components/ProductModal";
import Swal from "sweetalert2";
import { formatCurrency } from "../../Utils/formatCurrency";
import { CirclePlus, Eye, Flower, Handbag, Search, Shirt, ShoppingBag, SportShoe, Toolbox } from "lucide-react";

export default function Dashboard ({products, user}){

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

    const handleDeleteProduct = async (id) => {

        const result = await Swal.fire({
            title: "Delete product?",
            text: "This product will removed permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if(!result.isConfirmed){
            return;
        }

        if(result.isConfirmed){
            router.delete(route('product.destroy', id));
            setProductInfo(null);
        }
        
    }

    const tabs = ['all', 'clothes', 'bag', 'footwear', 'perfume', 'skincare'];

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [currentSearch, setCurrentSearch] = useState("");
    const [currentCategory, setCurrentCategory] = useState("all");

    const [isFetchingData, setIsFetchingData] = useState(false);



    const handleTab = async (selectedTab) => {

        setIsFetchingData(true);

        let categoryValue = selectedTab;
        
        setCurrentCategory(categoryValue);
        setActiveTab(selectedTab);

        router.get(route('product.index'), { category: categoryValue, search: currentSearch }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsFetchingData(false);
            },
        });
    }

    const handleSearch = () => {
        
        setIsFetchingData(true);

        router.get(route('product.index'), { category: currentCategory, search: currentSearch }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsFetchingData(false);
            }
        });
    };


    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!previewImage) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setPreviewImage(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [previewImage]);


    useEffect(() => {

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setProductInfo(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [productInfo]);

    return <>
        <Layout title={"Products"} user={user}>
            
            
            <div className="w-full flex justify-between items-center">

                <h1 className="font-bold text-2xl">
                    Product List
                </h1>

                <button 
                    className="flex gap-x-2 items-center rounded-md text-md bg-blue-500 px-3 py-2 text-white cursor-pointer hover:bg-blue-400"
                    onClick={() => router.visit(route("product.create"))}
                >
                    <CirclePlus size={15} />
                    <span>Add product</span>
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
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[1] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <Shirt strokeWidth={2} size={20}/>
                        Clothes
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[2])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[2] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <Handbag strokeWidth={2} size={20}/>
                        Bags
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[3])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[3] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <SportShoe strokeWidth={2} size={20} />
                        Footwear
                    </span>
                    
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[4])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[4] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <Flower strokeWidth={2} size={20} />
                        Perfumes
                    </span>
                </button>

                <button 
                    className="text-start cursor-pointer"
                    onClick={() => handleTab(tabs[5])}
                >
                    <span
                        className={`flex gap-x-2 items-center text-2xl font-bold ${
                            activeTab === tabs[5] 
                            ? "border-b-3 border-green-600"
                            : "text-gray-400"
                        }`}
                    >
                        <Toolbox strokeWidth={2} size={20} />
                        Skincare
                    </span>
                </button>

                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={currentSearch}
                        onChange={(e) => setCurrentSearch(e.target.value)}
                        className="w-full rounded-md py-2 pl-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#DF9BAA]"
                        onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                handleSearch(currentSearch);
                            }
                        }}
                    />

                    <button className="absolute top-0 right-0 h-full px-4 bg-[#DF9BAA] rounded-r-md flex items-center justify-center">
                        <Search size={20} color={"#FFFF"}/>
                    </button>
                </div>

            </div>
            
            {
                isFetchingData ? (
                    <div className="mt-10 w-full flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                        <span className="text-sm text-gray-500 font-medium">Loading more...</span>
                    </div>
                ) :
                (
                    <div className="grid grid-cols-4 gap-x-10 gap-y-5 mt-10">

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

                                        <div className="relative group overflow-hidden rounded-t-lg min-h-50 w-full">
                                            {
                                                product.image ? (
                                                    <div>
                                                        <img 
                                                            src={`/storage/${product.image}`}
                                                            alt="Product Image" 
                                                            className="w-full h-50 object-cover object-center"
                                                        />

                                                        <div 
                                                            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // prevent triggering viewProduct
                                                                setPreviewImage(product.image ? `/storage/${product.image}` : 'images/default_product.png');
                                                            }}
                                                        >
                                                            
                                                            <Eye size={40} color={"#FFFF"}/>
                                                            
                                                        </div>
                                                    </div>
                
                                                    
                                                ) : (
                                                    <div className="h-50 w-full flex justify-center items-center bg-black/20">
                                                        <ShoppingBag size={100} color="gray"/>
                                                    </div>
                                                )
                                            }
                                            
                                            
                                        </div>
        
                                        <div className="px-3 py-2">
                                            <h1 className="font-semibold text-lg">{ product.name }</h1>
                                            <p className="text-sm text-gray-500 capitalize font-semibold">{product.category}</p>
                                        </div>

                                        <div className="px-3 py-2">
                                            {Number(product.variants_min_price) === Number(product.variants_max_price) ? (
                                                <span className="font-semibold text-green-500">
                                                    {formatCurrency(Number(product.variants_min_price))}
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-green-500">
                                                    {formatCurrency(Number(product.variants_min_price))}
                                                    {" - "}
                                                    {formatCurrency(Number(product.variants_max_price))}
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                className="border-2 border-dashed h-65 bg-white rounded-md cursor-pointer hover:bg-gray-100"
                                onClick={() => router.visit(route("product.create"))}
                            >
                                <div className="flex gap-x-2 h-full items-center justify-center">
                                    <CirclePlus  />
                                    <h1 className="font-semibold text-lg">Add Product</h1>
                                </div>
                            </div>
                        )}
                        
                    </div>
                )
            }

            

            {previewImage && (
                <div 
                    className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center"
                    onClick={() => setPreviewImage(null)}
                >

                    <button className="absolute top-4 right-4 text-white text-3xl cursor-pointer hover:text-gray-300" onClick={() => setPreviewImage(null)}>
                        &times;
                    </button>
                    
                    <img 
                        src={previewImage}
                        alt="Full preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}


            {
                productInfo && (
                    <ProductModal 
                        product={productInfo}
                        onClose={() => setProductInfo(null)}
                        editProduct={handleEditProduct}
                        deleteProduct={handleDeleteProduct}
                    />
                )
            }



            
        </Layout>
    </>
}