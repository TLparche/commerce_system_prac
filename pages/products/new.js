import Layout from '@/components/Layout'
export default function NewProduct(){
    return(
        <Layout>
            <h1>New Product</h1>
            <label>Product name</label>
            <input type="text" placeholder={"product name"}/>
            <label>Description</label>
            <textarea placeholder={"description"} />
            <label>Price (in USD)</label>
            <input type="text" placeholder={"price"}/>
            <button className="btn-primary">Save</button>
        </Layout>
    )
}