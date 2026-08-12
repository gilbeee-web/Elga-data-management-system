import Layout from "../../Layouts/AppLayout"
import ProductForm from "./Components/ProductForm"

export default function CreateProduct({user}){
    return <>

        <Layout title={"Products"} user={user}>
            <div>
                <ProductForm mode={"create"}/>
            </div>
        </Layout>
        


    </>
}