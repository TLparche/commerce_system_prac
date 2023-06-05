import {useRouter} from 'next/router'
import axios from 'axios'
import {useState} from 'react'

export default function ProductForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function createProduct(event) {
        event.preventDefault()
        const data = {title, description, price};
        await axios.post("/api/products", data);
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push("/products")
    }
    return (

        <form onSubmit={createProduct}>
            <h1>New Product</h1>
            <label>Product name</label>
            <input type="text" placeholder={"product name"} value={title}
                   onChange={event => setTitle(event.target.value)}/>
            <label>Description</label>
            <textarea placeholder={"description"} value={description}
                      onChange={event => setDescription(event.target.value)}/>
            <label>Price (in USD)</label>
            <input type="text" placeholder={"price"} value={price}
                   onChange={event => setPrice(event.target.value)}/>
            <button type={'submit'} className="btn-primary">Save</button>
        </form>

    )
}