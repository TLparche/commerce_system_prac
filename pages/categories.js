import Layout from '@/components/Layout'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'


export default function Categories() {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories()
    },[]);
    function deleteCategory(category){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete(`/api/categories?_id=${_id}`)
                await Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                fetchCategories();
            }
        })
    }
    function fetchCategories(){
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(event) {
        event.preventDefault();
        if (!name) {
            // 이름이 제공되지 않았을 경우 오류 처리
            await Swal.fire(
                'Error',
                'Category name is required.',
                'error'
            );
            return;
        }
        const data = {name, parentCategory, properties: properties.map(p => ({
                name: p.name,
                value: p.value.split(","),
            }))}
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put("/api/categories", data);
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }
        setName("");
        setParentCategory("");
        setProperties([]);
        fetchCategories()
    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name, value}) => (
            {name, value: value.join(",")}))
        )
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:"", value:""}]
        });
    }
    function deleteProperty(index) {
        setProperties(prev => {
            return [...prev].filter((_, prevIndex) => prevIndex !== index)
        })
    }
    function changePropertyName(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function changePropertyValue(index, property, newValue){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].value = newValue;
            return properties;
        })
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit Category ${editedCategory.name}` : "Create new category"}</label>
            <form onSubmit={saveCategory}>
                <div className={"flex gap-1"}>
                    <input type="text" placeholder={"Category name"} value={name}
                           onChange={event => setName(event.target.value)}/>
                    <select value={parentCategory} onChange={event => setParentCategory(event.target.value)}>
                        <option value="">No parent category</option>
                        {categories.length>0 && categories.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className={"mb-2"}>
                    <label className={"block"}>Properties</label>
                    <button className={"btn-default text-sm"} type={'button'} onClick={addProperty}>Add new property</button>
                    {properties&&properties.length > 0 && properties.map((property, index)=> (
                        <div className={"flex gap-1"}>
                            <input type={"text"} placeholder={"property name"} className={"mb-0"} value={property.name} onChange={(event) => {
                                changePropertyName(index, property, event.target.value)}}/>
                            <input type={"text"} placeholder={"property value"} className={"mb-0"} value={property.value} onChange={(event)=>{
                                changePropertyValue(index, property, event.target.value)}
                            }/>
                            <button type={"button"} className={"btn-default"} onClick={()=>deleteProperty(index)}>Remove</button>
                        </div>
                        )
                    )}
                </div>
                <button type="submit" className={"btn-primary py-1"}>Save</button>
            </form>
            <table className={"basic mt-2"}>
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                {categories.length>0 && categories.map((category) => (
                    <tr>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td>
                            <button className={"btn-primary text-sm mr-1 inline-flex gap-1"} onClick={() => editCategory(category)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Edit
                            </button>
                            <button className={"btn-primary text-sm mr-1 inline-flex gap-1"} onClick={() => deleteCategory(category)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                            </button>
                        </td>
                    </tr>

                ))}
                </tbody>
            </table>
        </Layout>
    )
}