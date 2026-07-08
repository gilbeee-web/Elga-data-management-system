import Layout from "../../Layouts/AppLayout"
import ProductForm from "./Components/ProductForm"

export default function CreateProduct(){
    return <>

        <Layout title={"Products"}>
            <div>
                <ProductForm mode={"create"}/>
            </div>
        </Layout>
        


    </>
}