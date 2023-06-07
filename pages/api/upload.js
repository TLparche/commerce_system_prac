import multiparty from 'multiparty'
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import fs from "fs"
import mime from "mime-types"
const bucketName = "leeu-trial";
const regionName = "ap-northeast-2";
export default async function UploadProduct(req, res){
    const form = new multiparty.Form();
    const {fields, files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if(err) reject(err);
            resolve({fields, files});
        })
    })
    console.log(files.file.length);
    const client = new S3Client({
        region: regionName,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    })
    const links = [];
    for (const file of files.file){
        const ext = file.originalFilename.split(".").pop();
        const newFilename = Date.now() + "." + ext;
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: "public-read",
            ContentType: mime.lookup(file.path)
        }));
        const link = `https://${bucketName}.s3.${regionName}.amazonaws.com/${newFilename}`
        links.push(link);
    }
    return res.json({links});
}

export const config ={
    api: {bodyParser: false},

}