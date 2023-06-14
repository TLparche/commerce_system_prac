import NextAuth, {getServerSession} from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from '@next-auth/mongodb-adapter'
import clientPromise from '@/pages/lib/mongodb'

const adminEmail = ["h010508@gmail.com"];

export const authOptions ={
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: ({session, token, user}) => {
            if (adminEmail.includes(session?.user?.email)){
                return session;
            } else {
                return false;
            }
        }
    }
}
export default NextAuth(authOptions)

export async function isAdminRequest(req, res){
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmail.includes(session?.user?.email)){
        res.status(401);
        res.end();
        throw "not admin"
    }
}