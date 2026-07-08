import Layout from "../../Layouts/AppLayout"
import ProductForm from "./Components/ProductForm"

export default function EditProduct({product}){
    return <>

        <Layout title={"Products"}>
            <div>
                <ProductForm 
                    mode={"edit"} 
                    product={product}
                />
            </div>
        </Layout>
    
    </>
}