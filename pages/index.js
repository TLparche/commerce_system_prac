import {signIn, signOut, useSession} from 'next-auth/react'

export default function Home() {
    const { data: session } = useSession()
    if (!session){
        return (
            <div className="bg-blue-900 w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <div className="p-2">
                        <button className="bg-white w-1/4 p-2 px-4 rounded-lg" onClick={() => signIn("google")}>Login with Google</button>
                    </div>
                    <button className="bg-white w-1/4 p-2 px-4 rounded-lg " onClick={() => signIn("Facebook")}>Login with Facebook</button>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-blue-900 min-h-screen">
            <div>logged in as {session.user.email}
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        </div>

    )
}
