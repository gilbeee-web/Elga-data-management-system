import { useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import Layout from "../../../Layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";
import { formatCurrency } from "../../../Utils/formatCurrency";
import Swal from "sweetalert2";
import { ChevronLeft, CirclePlus, CircleX, Eye, ImagePlus } from "lucide-react";
import { route } from "ziggy-js";
import SaveLoading from "../../../Components/SaveLoading";

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


    const [showImagePreview, setShowImagePreview] = useState(null);

    useEffect(() => {
        if (!previewImage) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowImagePreview(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showImagePreview]);


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

    const [isSaving, setIsSaving] = useState(false);

    const saveProduct = (e) => {
        e.preventDefault();

        if(data.name === "" || data.category === ""){
            Swal.fire({
                icon: "error",
                title: "Error saving the product",
                text: "Please fill up the required field."
            });

            return;
        }else if(data.variants[0].variant_name === "" || data.variants[0].price === null || data.variants[0].product_code === "") {
            Swal.fire({
                icon: "error",
                title: "Error saving the product",
                text: "Please add at least one product variant."
            })
            return;
        }

        setIsSaving(true);

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
                onFinish: () => setIsSaving(false),
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
                }, 
                onFinish: () => setIsSaving(false)
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

            if(!previewImage && product.image){
                setPreviewImage(`/storage/${product.image}`);
            }
        }

        console.log("data.variants: ", data.variants);

    }, [mode,product]);

    return <>
        
        <div className="flex gap-x-2 items-center">
            <button className="cursor-pointer" onClick={() => router.visit(route('product.index'))}>
                <ChevronLeft strokeWidth={2} size={30}/>
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
                    <h1 className="text-lg font-bold">Product Information</h1>
                </div>

                <div className="flex gap-x-20 items-center">

                    <TextInput 
                        name={"name"} 
                        label={"Product name:"}
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                        required={true}
                        placeholder="eg. clothes"
                        className="w-100"
                    />

                    
                    

                    <div className="flex flex-col">
                        <label htmlFor="category" className="font-semibold">Product category: <span className="text-red-500">*</span></label>
                        <select 
                            name="category"
                            value={data.category} 
                            onChange={(e) => setData("category", e.target.value)}
                            className="border border-gray-400 bg-white px-5 py-2 rounded-md"
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

                <div className="mt-5 flex flex-col gap-y-1">
                    <label className="font-semibold">Product Image:</label>

                    {previewImage ? (
                        <div className="mt-5 relative px-2 py-1 border border-gray-400 rounded-md w-fit group">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-auto h-30 rounded-md border cursor-pointer"
                                onClick={() => setShowImagePreview(true)}
                            />

                            <div 
                                className="absolute h-full inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-md"
                                onClick={() => setShowImagePreview(true)}
                            >
                                <Eye size={28} color={"#FFF"}/>
                            </div>

                            <div className="absolute -right-2 -top-3">
                                <button 
                                    type="button"
                                    className="text-xl cursor-pointer"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        setData("image", null);
                                    }}
                                >
                                    <CircleX strokeWidth={3} color="red" size={20}/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label htmlFor="product_image" className="cursor-pointer inline-block w-fit">
                            <div className="border-2 border-dashed w-60 h-25 rounded-md flex items-center justify-center hover:bg-gray-200">
                                <div className="flex flex-col items-center">
                                    <ImagePlus size={30}/>
                                    <span>Upload Image</span>
                                    <span className="text-xs text-gray-500">
                                        Allowed format: JPG, JPEG, PNG
                                    </span>
                                </div>
                            </div>
                        </label>
                    )}

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

            {showImagePreview && (
                <div 
                    className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center"
                    onClick={() => setShowImagePreview(false)}
                >

                    <button className="absolute top-4 right-4 text-white text-3xl cursor-pointer hover:text-gray-300" onClick={() => setShowImagePreview(false)}>
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

            <div className="mt-3 bg-white rounded-md p-5 w-[70%]">

                <div className="mb-5">
                    <h1 className="text-lg font-bold">
                        Product Variants
                    </h1>
                </div>
                
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
                            placeholder="Do not empty"
                        />

                        <TextInput
                            name="product_code"
                            value={item.product_code}
                            onChange={(e) =>
                                updateVariant(index, "product_code", e.target.value)
                            }
                            placeholder="A01"
                        />

                        <div className="flex gap-x-10 items-center">
                            <input
                                type="text"
                                className="w-30 border border-gray-400 rounded-md px-3 py-1"
                                value={
                                    editingPrice === index
                                        ? item.price
                                        : item.price ? formatCurrency(item.price)
                                        : "" 
                                }
                                placeholder="0.00"
                                onFocus={() => setEditingPrice(index)}
                                onBlur={() => setEditingPrice(null)}
                                onChange={(e) => {
                                    const value = Number(e.target.value);

                                    updateVariant(
                                        index,
                                        "price",
                                        Number.isNaN(value) ? 0 : value
                                    );
                                }}
                                // onChange={(e) =>
                                //     updateVariant(index, "price", Number(e.target.value))
                                // }
                            />

                            {
                                data.variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(index)} className="cursor-pointer">
                                       <CircleX strokeWidth={2} color="red" size={20} />
                                    </button>
                                )
                            }
                        </div>
                        
                        
                    </div>
                ))}


                <div className="mt-5 border-t border-gray-300 flex justify-center items-center">
                
                    <button 
                        type="button"
                        className="flex gap-x-2 items-center mt-2 cursor-pointer transition-transform duration-200 hover:scale-110"
                        onClick={addVariant}
                    >
                        <CirclePlus strokeWidth={2} size={20}/>
                        <span className="text-md font-semibold">Add</span>
                    </button>
                    
                </div>

            </div>

            <div className="w-[70%] flex gap-x-5 items-center mt-5 justify-end">

                <button 
                    type="button"
                    className="border border-gray-300 bg-white px-3 py-2 rounded-md cursor-pointer"
                    onClick={() => router.visit(route('product.index'))}
                >
                    Cancel
                </button>

                <button 
                    className={` px-3 py-2 rounded-md text-white cursor-pointer ${
                        isSaving ? "bg-green-400" : "bg-green-500 hover:bg-green-400"
                    }`}
                    type="submit"
                >
                    Save
                </button>
            </div>
        </form>

        {
            isSaving && (
                <SaveLoading />
            )
        }

    
    </>
}