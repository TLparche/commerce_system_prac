import Layout from '@/components/Layout'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import axios from 'axios'

export default function DeleteCategoryPage() {
    const router = useRouter();
    const [categoryInfo, setCategoryInfo] = useState([]);
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/api/categories?id=${id}`).then(response => {
            setCategoryInfo(response.data)
        })
    },[])

    function goBack() {
        router.push("/categories");
    }

    async function deleteCategory() {
        await axios.delete(`/api/categories?id=${id}`)
        goBack()
    }

    return (
        <Layout>
            <h1 className="text-center">del? &nbsp; "{categoryInfo?.name}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className={"btn-red"} onClick={deleteCategory}>Y</button>
                <button onClick={goBack} className={"btn-default"}>N</button>
            </div>
        </Layout>
    )
}