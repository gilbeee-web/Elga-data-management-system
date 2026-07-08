import { useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import Layout from "../../../Layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";

export default function ProductForm({mode, product}){

    const {data, setData, post, put, processing,errors} = useForm({
        name: "",
        category: "",
        image: null,
        variants: [
            {
                variant_name: "",
                product_code: "",
                price: "",
            },
        ],
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setData("image", file);

        setPreviewImage(URL.createObjectURL(file));
    };

    const addVariant = () => {
        setData("variants", [
            ...data.variants,
            {
                variant_name: "",
                product_code: "",
                price: ""
            }
        ]);
    };

    const removeVariant = (index) => {
        if (data.variants.length === 1) return;

        setData(
            "variants",
            data.variants.filter((_, i) => i !== index)
        );
    };
    


    const updateVariant = (index, field, value) => {

        const updated = [...data.variants]; // create a copy of the variant array

        updated[index][field] = value; // update the selected index with field with the value ex. updateVariant[1][variant_name] = "Small" 
        setData("variants",updated);
    };


    const saveProduct = (e) => {
        e.preventDefault();
        console.log("Submitting...");


        if (product && mode === "edit") {
            
            console.log("Product to update: ", data);

            put(route("product.update", product.id), {
                onStart: () => console.log("started"),
                onSuccess: () => console.log("success"),
                onError: (errors) => console.log(errors),
                onFinish: () => console.log("finished"),
            });
        } else {
            post(route("product.store"), {
                onError: (errors) => {
                    console.log("Errors: ", errors)
                }
            });
        }
    };


    useEffect(() => {
        if(mode === 'edit' && product){
            setData({
                name: product.name,
                category: product.category,
                image: null,
                variants: product.variants
            });

            if(!previewImage){
                setPreviewImage(`/storage/${product.image}`);
            }
        }

        console.log("Product.variants: ", product.variants);
        console.log("data.variants: ", data.variants);

    }, [mode,product]);

    return <>
        
        {
            mode === "create" ? (
                <h1 className="text-xl font-bold">Add Product</h1>
            ) : (
                <h1 className="text-xl font-bold">Edit Product</h1>
        )}
        

        <form onSubmit={saveProduct}>

            <div className="mt-3 bg-white rounded-md p-5 w-[70%]">

                <div className="mb-5">
                    <h1 className="text-lg font-bold border-b-3 inline-block border-red-500">Prdouct Information</h1>
                </div>

                <div className="flex gap-x-20 items-center">

                    <TextInput 
                        name={"name"} 
                        label={"Product name:"}
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                    />

                    
                    

                    <div className="flex flex-col">
                        <label htmlFor="category">Product category:</label>
                        <select 
                            name="category"
                            value={data.category} 
                            onChange={(e) => setData("category", e.target.value)}
                            className="border bg-white px-5 py-2 rounded-md"
                        >
                            <option value="" disabled hidden>Select Category</option>
                            <option value="bag">Bag</option>
                            <option value="clothes">Clothes</option>
                            <option value="footwear">Footwear</option>
                            <option value="perfume">Perfume</option>
                        </select>

                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category}
                            </p>
                        )}
                    </div>
                
                </div>
                
                <div className="mt-5 flex flex-col">
                    <label>Product Image:</label>

                    <label htmlFor="product_image" className="cursor-pointer inline-block w-fit">

                        {previewImage ? (

                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-auto h-30 rounded-md border"
                            />

                        ) : (

                            <div className="border-2 border-dashed w-70 h-35 rounded-md flex items-center justify-center hover:bg-gray-200">
                                <div className="flex flex-col items-center">
                                    <img
                                        src="/images/icons/add-photo-icon.png"
                                        className="w-10 h-10"
                                    />

                                    <span>Upload Image</span>

                                    <span className="text-xs text-gray-500">
                                        Allowed format: JPG, JPEG, PNG
                                    </span>
                                </div>
                            </div>

                        )}

                    </label>

                    <input
                        id="product_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    {errors.image && (
                        <span className="text-red-500 text-sm mt-1">
                            {errors.image}
                        </span>
                    )}
                </div>

            </div>

            <div className="mt-3 bg-white rounded-md p-5 w-[70%]">

                <div className="mb-5">
                    <h1 className="text-lg font-bold border-b-3 inline-block border-red-500">
                        Prdouct Variants
                    </h1>
                </div>
                
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] font-semibold">

                    <div>Variant <span className="text-red-500">*</span></div>

                    <div>Product Code <span className="text-red-500">*</span></div>

                    <div>Price <span className="text-red-500">*</span></div>

                    <div></div>

                </div>

                

                {data.variants.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-end"
                    >
                        <TextInput
                            name="variant_name"
                            value={item.variant_name}
                            onChange={(e) =>
                                updateVariant(index, "variant_name", e.target.value)
                            }
                        />

                        <TextInput
                            name="product_code"
                            value={item.product_code}
                            onChange={(e) =>
                                updateVariant(index, "product_code", e.target.value)
                            }
                        />
                        

                        <input 
                            type="number" 
                            className="w-30 border bg-[#F5F5F5] rounded-md px-2 py-1"
                            name="price"
                            value={item.price}
                            onChange={(e) =>
                                updateVariant(index, "price", e.target.value)
                            }
                        />

                        {/* <TextInput
                            name="price"
                            type="number"
                            value={item.price}
                            className="w-10"
                            onChange={(e) =>
                                updateVariant(index, "price", e.target.value)
                            }
                        /> */}

                        <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            disabled={data.variants.length === 1}
                            className="px-3 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-400 disabled:bg-gray-300"
                        >
                            ✕
                        </button>
                    </div>
                ))}


                <div className="mt-5 border-t flex justify-center items-center">
                
                    <button 
                        type="button"
                        className="flex gap-x-2 items-center mt-2 cursor-pointer transition-transform duration-200 hover:scale-110"
                        onClick={addVariant}
                    >
                        <img src={"/images/icons/add-icon.png"} alt="" className="object-contain w-5 h-5"/>
                        <span className="text-md font-semibold">Add</span>
                    </button>
                    
                </div>

            </div>

            <div className="w-[70%] flex gap-x-5 items-center mt-5 justify-end">

                <button 
                    type="button"
                    className="bg-gray-300 px-3 py-2 rounded-md text-white cursor-pointer hover:bg-gray-400"
                    onClick={() => router.visit(route('product.index'))}
                >
                    Cancel
                </button>

                <button 
                    className="bg-green-500 px-3 py-2 rounded-md text-white cursor-pointer hover:bg-green-400"
                    type="submit"
                >
                    Save
                </button>
            </div>
        </form>

        




    
    </>
}