import Layout from '@/components/Layout'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import axios from 'axios'

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState([]);
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/api/products?id=${id}`).then(response => {
            setProductInfo(response.data)
        })
    })

    function goBack() {
        router.push("/products");
    }

    async function deleteProduct() {
        await axios.delete(`/api/products?id=${id}`)
        goBack()
    }

    return (
        <Layout>
            <h1 className="text-center">del? &nbsp; "{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className={"btn-red"} onClick={deleteProduct}>Y</button>
                <button onClick={goBack} className={"btn-default"}>N</button>
            </div>
        </Layout>
    )
}