import {useRouter} from 'next/router'
import axios from 'axios'
import {useEffect, useState} from 'react'
import Spinner from '@/components/Spinner'
import {ReactSortable} from 'react-sortablejs'

export default function ProductForm({
                                        _id,
                                        title: existingTitle,
                                        description: existingDescription,
                                        price: existingPrice,
                                        images: existingImages,
                                        category: existingCategory,
                                        properties: existingProperties,
                                    }) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [images, setImages] = useState(existingImages || "");
    const [category, setCategory] = useState(existingCategory || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState(existingProperties || "");
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
        })
    }, [])

    async function createProduct(event) {
        event.preventDefault()
        const data = {title, description, price, images, category, properties};
        if (_id) {
            await axios.put("/api/products", {...data, _id});
        } else {
            await axios.post("/api/products", data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push("/products")
    }

    async function uploadImages(event) {
        const files = event.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);
            setImages(oldImg => {
                return [...oldImg, ...res.data.links];
            })
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function updateProperties(name, value) {
        setProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[name] = value;
            return newProductProps;
        });
    }


    const organizedProperty = [];
    if (categories.length > 0 && category) {
        const copyOrganizedProperty = categories.find(({_id}) => _id === category);
        if (copyOrganizedProperty) {
            organizedProperty.push(...copyOrganizedProperty.properties);
        }
    }
    return (
        <form onSubmit={createProduct}>
            <label>Product name</label>
            <input type="text" placeholder={"product name"} value={title}
                   onChange={event => setTitle(event.target.value)}/>
            <label>Category</label>
            <select value={category} onChange={event => setCategory(event.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map((category) => (
                    <option value={category._id}>{category.name}</option>
                ))}
            </select>
            {organizedProperty.length > 0 && organizedProperty.map((item) => (
                <div key={item.name} className={"flex gap-2"}>
                    <label>{item.name}</label>
                    <select value={properties[item.name]}
                            onChange={event => updateProperties(item.name, event.target.value)}>
                        {item.value.map(ele => (
                            <option key={ele} value={ele}>{ele}</option>
                        ))}
                    </select>
                </div>
            ))
            }
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} className={"flex flex-wrap gap-1"} setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24">
                            <img src={link} alt={""} className={"rounded-lg"}/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 p-1 bg-gray-200 flex items-center">
                        <Spinner/>
                    </div>
                )}
                <label
                    className="w-24 h-24 border text-center flex items-center justify-center text-sm gap-1 rounded-md bg-gray-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" className="hidden" onChange={uploadImages}/>
                </label>
            </div>
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