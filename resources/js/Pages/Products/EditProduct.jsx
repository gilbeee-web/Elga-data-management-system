import Layout from "../../Layouts/AppLayout"
import ProductForm from "./Components/ProductForm"

export default function EditProduct({product, user}){
    return <>

        <Layout title={"Products"} user={user}>
            <div>
                <ProductForm 
                    mode={"edit"} 
                    product={product}
                />
            </div>
        </Layout>
    
    </>
}