import Layout from '@/components/Layout'
import Link from 'next/link'

export default function Products(){
    return(
        <Layout>
            <Link href={"/products/new"} className={"bg-gray-300 py-1 px-2 rounded-md text-white"}>Add new product</Link>
        </Layout>
    )
}