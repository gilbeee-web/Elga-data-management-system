import { useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import Layout from "../../../Layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import Swal from "sweetalert2";

export default function ProductForm({mode, product}){

    const {data, setData, post, transform, errors} = useForm({
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


    const [editingPrice, setEditingPrice] = useState(null);



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

        if (data.variants[0].variant_name === "" || data.variants[0].price === null || data.variants[0].product_code === "") {
            alert("Please add at least one product variant");
            return;
        }

        if (product && mode === "edit") {
            transform((data) => ({ ...data, _method: 'put' }));

            post(route("product.update", product.id), {
                forceFormData: true,
                onStart: () => console.log("started"),
                onSuccess: () => {
                    console.log("success");

                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Product updated successfully!",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });

                },
                onError: (errors) => {

                    console.log(errors);

                    Swal.fire({
                        icon: "error",
                        title: "Updating product failed",
                        text: Object.values(errors)[0],
                    });

                } ,
                onFinish: () => console.log("finished"),
            });
        } else {
            post(route("product.store"), {

                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Product created successfully!",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                },

                onError: (errors) => {
                    Swal.fire({
                        icon: "error",
                        title: "Creating product failed",
                        text: Object.values(errors)[0],
                    });
                    console.log("Errors: ", errors);
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

        console.log("data.variants: ", data.variants);

    }, [mode,product]);

    return <>
        
        <div className="flex items-center">
            <button className="cursor-pointer" onClick={() => router.visit(route('product.index'))}>
                <img src="/images/icons/arrow-back.png" alt="Arrow back"  className="object-contain w-5 h-5"/>
            </button>

            {
                mode === "create" ? (
                    <h1 className="text-xl font-bold">Add Product</h1>
                ) : (
                    <h1 className="text-xl font-bold">Edit Product</h1>
            )}

        </div>

        
        

        <form onSubmit={saveProduct}>

            <div className="mt-3 bg-white rounded-md p-5 w-[70%]">

                <div className="mb-5">
                    <h1 className="text-lg font-bold border-b-3 inline-block border-red-500">Product Information</h1>
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
                            <option value="other">Others</option>
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
                        Product Variants
                    </h1>
                </div>
                
                {/* <div className="grid grid-cols-[1fr_1fr_1fr_auto] font-semibold">

                    <div>Variant <span className="text-red-500">*</span></div>

                    <div>Product Code <span className="text-red-500">*</span></div>

                    <div>Price <span className="text-red-500">*</span></div>

                    <div></div>

                </div> */}

                

                {data.variants.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr_1fr_auto] mb-4 items-end"
                    >
                        
                        {index === 0 && (
                            <>
                                <label>Variant <span className="text-red-500">*</span></label>
                                <label>Product Code <span className="text-red-500">*</span></label>
                                <label>Price <span className="text-red-500">*</span></label>
                                <label></label>
                            </>
                        )}
                        
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

                        <div className="flex gap-x-10 items-center">
                            <input
                                type="text"
                                className="w-30 border bg-[#F5F5F5] rounded-md px-3 py-1"
                                value={
                                    editingPrice === index
                                        ? item.price
                                        : formatCurrency(item.price)
                                }
                                onFocus={() => setEditingPrice(index)}
                                onBlur={() => setEditingPrice(null)}
                                onChange={(e) =>
                                    updateVariant(index, "price", Number(e.target.value))
                                }
                            />

                            {
                                data.variants.length > 1 && (
                                    <button onClick={() => removeVariant(index)}>
                                        <img 
                                            src={'/images/icons/remove-btn.svg'} 
                                            alt="Remove Btn" 
                                            className="cursor-pointer object-contain h-5 w-5"
                                        />
                                    </button>
                                )
                            }
                        </div>
                        
                        
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