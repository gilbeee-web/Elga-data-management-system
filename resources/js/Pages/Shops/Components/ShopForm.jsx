import { useForm } from "@inertiajs/react";
import { Camera, ChevronLeft, CircleX, Eye, ImagePlus, Store } from "lucide-react";
import { useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import { route } from "ziggy-js";

export default function ShopForm({onClose, onSuccess, shop, mode}){


    console.log("Mode: ", mode);

    const {data, setData, transform, errors, post, put} = useForm({
        cover_photo: null,
        name: "",
        location: ""
    });

    const [coverPhotoPreview, setCoverPhotoPreview]  = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setData("cover_photo", file);

        setCoverPhotoPreview(URL.createObjectURL(file));
    };

    const [openCoverPreview, setOpenCoverPreview] = useState(false);

    useEffect(() => {
        if (!coverPhotoPreview) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOpenCoverPreview(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openCoverPreview]);



    const isEdit = mode === 'edit';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (shop_id) => {

        setIsSubmitting(true);

        if (isEdit && shop_id) {
            transform((data) => ({ ...data, _method: 'put' }));

            post(route('shop.update', shop_id), {
                forceFormData: true,
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) => {
                    console.log("Errors: ", errors);
                },
                onFinish: () => setIsSubmitting(false)
            });
        } else {
            post(route('shop.store'), {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) => {
                    console.log("Errors: ", errors);
                },
                onFinish: () => setIsSubmitting(false)
            });
        }
    }


    useEffect(() => {
    
        if(isEdit && shop){
            setData({
                name: shop.name,
                location: shop.location,
                cover_photo: null
            });

            if(!coverPhotoPreview && shop.cover_photo){
                setCoverPhotoPreview(`/storage/${shop.cover_photo}`);
            }
        }

    }, [shop]);




    return (

        <div className="mt-3">
                            
            <div className="flex gap-x-1 items-center">
                <button 
                    className="cursor-pointer"
                    onClick={onClose}
                >
                    <ChevronLeft size={30}/>
                </button>
                <h1 className="text-lg font-semibold">
                    {mode === 'edit' ? "Update Store" : "Add Store"}
                </h1>
            </div>


            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(shop?.id);
                }} 
                className="mt-5"
            >
                    
                <div className="flex flex-col gap-y-5">

                    {/* Shop Info */}
                    <TextInput 
                        label={"Store Name:"}
                        placeholder="Enter store name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required={true}
                        error={errors.name}
                        className="w-100"
                    />

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="location" className="font-semibold">Location:<span className="text-red-500">*</span></label>
                        <textarea 
                            value={data.location}
                            onChange={(e) => setData("location",e.target.value)} 
                            className="max-w-100 border border-gray-400 p-3 rounded-md"
                        >

                        </textarea>

                        {errors.location && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.location}
                            </p>
                        )}
                    </div>


                    {/* Cover Photo */}
                    <div className="mb-4 flex flex-col gap-y-1">

                        <label htmlFor="cover_photo" className="font-semibold">Cover Photo:</label>
                        {
                            coverPhotoPreview ? (

                                <div className="mt-5 relative px-2 py-1 border border-gray-400 rounded-md w-fit group">
                                    <img
                                        src={coverPhotoPreview}
                                        alt="Preview"
                                        className="w-auto h-30 rounded-md border cursor-pointer"
                                        onClick={() => setOpenCoverPreview(true)}
                                    />

                                    <div 
                                        className="absolute h-full inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-md"
                                        onClick={() => setOpenCoverPreview(true)}
                                    >
                                        <Eye size={28} color={"#FFF"}/>
                                    </div>

                                    <div className="absolute -right-2 -top-3">
                                        <button 
                                            type="button"
                                            className="text-xl cursor-pointer"
                                            onClick={() => {
                                                setCoverPhotoPreview(null);
                                                setData("cover_photo", null);
                                            }}
                                        >
                                            <CircleX strokeWidth={3} color="red" size={20}/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="cover_photo" className="cursor-pointer inline-block w-fit">
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
                            )
                        }
                        
                        <input
                            id="cover_photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        {errors.cover_photo && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.cover_photo}
                            </span>
                        )}

                    </div>

                    {openCoverPreview && (
                        <div 
                            className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center"
                            onClick={() => setOpenCoverPreview(false)}
                        >

                            <button className="absolute top-4 right-4 text-white text-3xl cursor-pointer hover:text-gray-300" onClick={() => setOpenCoverPreview(false)}>
                                &times;
                            </button>
                            
                            <img 
                                src={coverPhotoPreview}
                                alt="Full preview"
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    
                </div>

                <div className="mt-10 w-full flex justify-end">
                    <button
                        type="submit" 
                        className={`rounded-md text-md px-3 py-2 text-white cursor-pointer ${
                            isSubmitting ? "bg-green-400" : "bg-green-500 hover:bg-green-400"
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
                
            </form>



            
        </div>

    )


}