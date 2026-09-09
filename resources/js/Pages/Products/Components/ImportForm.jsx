import { router, useForm } from "@inertiajs/react";
import { FilePlusCorner, FileSpreadsheet, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { route } from "ziggy-js";

export default function ImportForm({onClose}){


    const {data, setData, post, errors, processing} = useForm({
        file: null
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setData("file", file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!data.file){
            return;
        }

        post(route("product.import"), {
            forceFormData: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const removeFile = () => {
        setData("file", null);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };


    const [onLoadTemplate, setOnLoadTemplate] = useState(false);

    const handleDownloadTemplate = () => {
        setOnLoadTemplate(true);

        window.location.href = route('product.download.template');

        setTimeout(() => {
            setOnLoadTemplate(false);
        }, 1500);
    };

    return (


        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center">

            <div className="w-full bg-white sm:max-w-md md:max-w-2xl lg:max-w-2xl rounded-md shadow p-5 pt-3 overflow-y-auto max-h-[90vh]">
                 
                {/* Header */}
                <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                    
                    <h1 className="text-xl font-semibold capitalize">Import Product</h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="w-full">

                    {/* Upload Area */}
                    {
                        !data.file && (
                        <div className="mt-5 w-full flex justify-center">

                            <label
                                htmlFor="file"
                                className="cursor-pointer"
                            >
                                <div className="border-2 border-dashed border-gray-400 w-72 h-32 rounded-md flex items-center justify-center hover:bg-gray-100 transition">

                                    <div className="flex flex-col items-center text-center">

                                        <FilePlusCorner
                                            color="gray"
                                            size={30}
                                        />

                                        <span className="mt-1">
                                            Upload or drag and drop
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            Allowed format: XLSX, XLS or CSV
                                        </span>

                                    </div>

                                </div>
                            </label>

                            <input
                                id="file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                        </div>
                    )}

                    {/* File Preview */}
                    {data.file && (
                        <div className="mt-5 w-full">

                            <div className="border border-gray-400 rounded-md p-4 flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="bg-green-100 p-3 rounded-md">
                                        <FileSpreadsheet
                                            size={30}
                                            className="text-green-600"
                                        />
                                    </div>

                                    <div>

                                        <p className="font-medium truncate max-w-100">
                                            {data.file.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(data.file.size)}
                                        </p>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>

                            </div>

                        </div>
                    )}

                    {/* Validation Error */}
                    {errors.file && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.file}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="mt-5 w-full flex justify-between items-center">

                        <div>
                            <button 
                                className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white rounded-md px-3 py-2"
                                type="button"
                                onClick={handleDownloadTemplate}
                            >
                                {onLoadTemplate ? "Downloading..." : "Download Template"}
                            </button>
                        </div>

                        <div className="flex gap-x-2 items-center">

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-2 border rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={!data.file || processing}
                                className={`px-3 py-2 rounded-md font-semibold text-white ${
                                    data.file && !processing
                                        ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                            >
                                {processing ? "Importing..." : "Upload file"}
                            </button>
                        </div>
                    </div>
                    

                </form>
            </div>
        </div>
    )


}