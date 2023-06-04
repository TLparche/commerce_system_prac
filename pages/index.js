import "tailwindcss/tailwind.css"
import Layout from '@/components/Layout'
import {useSession} from 'next-auth/react'

export default function Home() {
    const {data: session} = useSession();
    return (
        <Layout>
            <div className={"text-blue-900 flex justify-between"}>
                <h2>
                    Hello, <b>{session?.user?.name} </b>
                </h2>
                <div className={"bg-gray-300 flex gap-1 text-black items-center rounded-lg overflow-hidden"}>
                    <img src={session?.user?.image} alt={""} className={"w-10 h-10 p-1"}/>
                    <a className={"items-center pl-1 p-2"}>{session?.user?.name} </a>
                </div>
                </div>
        </Layout>
    )
}
