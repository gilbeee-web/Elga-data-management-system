
export default function ProductModal({product, onClose, editProduct, deleteProduct}){

    console.log("Product variants: ", product.variants);

    return <>

        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex items-center justify-center">

            <div className="w-full bg-white sm:max-w-md md:max-w-2xl lg:max-w-3xl rounded-md shadow p-5 pt-3 overflow-y-auto max-h-[90vh]">
                 
                {/* Header */}
                <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                    
                    <h1 className="text-xl font-semibold capitalize">Product Details</h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="flex justify-between items-start mt-3">

                    <div className="flex gap-x-5 items-center mt-3 px-5">

                        <div>
                            <img 
                                src={`/storage/${product.image}`} 
                                alt={product.name}  
                                className="object-contain w-30 h-auto rounded-md"
                            />
                        </div>

                        <div>
                            <h1 className="uppercase font-semibold text-2xl">{product.name}</h1>
                            <p className="text-md font-semibold capitalize text-gray-500">{product.category}</p>
                        </div>

                    </div>

                    <div className="flex gap-x-3 items-center">
                        <button 
                            className="p-2 text-sm bg-green-500 rounded-md text-white cursor-pointer hover:bg-green-400"
                            onClick={() => editProduct(product.id)}
                        >
                            Edit product
                        </button>
                        <button 
                            className="p-2 text-sm bg-red-700 rounded-md text-white cursor-pointer hover:bg-red-600"
                            onClick={() => deleteProduct(product.id)}
                        >
                            Delete product
                        </button>
                    </div>
                </div>
                



                <table className="mt-5 w-full text-sm text-left shadow-md rounded-lg">

                    <thead className="text-gray-600 text-md border-b border-gray-300">
                        <tr className="bg-gray-100">
                            <th className="p-3">Variants</th>
                            <th className="p-3">Variant code</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Sold</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                       {
                        product.variants && product.variants.length > 0 ? (
                            product.variants.map((variant) => (
                                <tr key={variant.id} className="border-b border-gray-300">
                                    <td className="p-3 uppercase text-gray-600 font-semibold">{variant.variant_name}</td>
                                    <td className="p-3 uppercase text-gray-600 font-semibold">{variant.product_code}</td>
                                    <td className="p-3 uppercase text-gray-600 font-semibold">{variant.price}</td>
                                    <td className="p-3 uppercase text-gray-600 font-semibold">{variant.sold}</td>
                                </tr>
                            ))
                        ) : (
                            
                            <tr>
                                <td colSpan={4} className="text-center font-bold text-lg">
                                    No product variants yet.
                                </td>
                            </tr>
                            

                        )
                       }
                    </tbody>

                </table>



            </div>


        </div>
    
    
    </>

}