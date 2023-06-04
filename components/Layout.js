import {signIn, signOut, useSession} from 'next-auth/react'
import "tailwindcss/tailwind.css"
import Nav from '@/components/Nav'

export default function Layout() {
    const {data: session} = useSession()
    if (!session) {
        return (
            <div className="bg-blue-900 w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <div className="p-2">
                        <button className="bg-white w-1/4 p-2 px-4 rounded-lg" onClick={() => signIn("google")}>Login
                            with Google
                        </button>
                    </div>
                    <button className="bg-white w-1/4 p-2 px-4 rounded-lg " onClick={() => signIn("facebook")}>Login
                        with Facebook
                    </button>
                </div>
            </div>
        )
    } else {
        return (

            <div className="bg-blue-900 min-h-screen flex">
                <Nav/>
                <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">logged in as {session.user.email}
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            </div>

        )
    }
}
