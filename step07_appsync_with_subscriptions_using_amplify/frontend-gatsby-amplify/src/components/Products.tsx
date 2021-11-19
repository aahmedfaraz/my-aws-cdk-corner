import React, { useState, useEffect, useRef } from 'react';
import { API } from 'aws-amplify';
import { products } from '../graphql/queries';
import { addProduct, updateProduct, deleteProduct } from '../graphql/mutations';
import { onAddProduct, onUpdateProduct, onDeleteProduct } from '../graphql/subscriptions';

type AddProductInput = {
    title: String,
    price: Number
}

type UpdateProductInput = {
    id: String,
    title: String,
    price: Number
}

const Products = () => {
    const [current, setCurrent] = useState(null);
    const [productsData, setProductsData] = useState([]);
    
    const titleRef : any = useRef('');
    const priceRef : any = useRef('');
    
    useEffect(() => {
        getAllProducts();
        // Subscription for - Add Product
        API.graphql({
            query: onAddProduct
        }).subscribe({
            next: (data) => {
                console.log('Added product Subscription', data);
            }
        })

        // Subscription for - Update Product
        API.graphql({
            query: onUpdateProduct
        }).subscribe({
            next: (data) => {
                console.log('Updated product Subscription', data);
            }
        })

        // Subscription for - Delete Product
        API.graphql({
            query: onDeleteProduct
        }).subscribe({
            next: (data) => {
                console.log('Deleted product Subscription', data);
                // update UI
                setProductsData(
                    productsData.filter(product => product.id !== data.value.data.onDeleteProduct)
                );
            }
        })
    // eslint-disable-next-line
    }, []);

    // 1 - Function to Fetch All Products
    const getAllProducts = async () => {
        try {
          const res : any = await API.graphql({
              query: products
          })
          const data = await res.data.products;
          console.log('Products', data);
          setProductsData(data)
        } catch (err) {
          console.log(`Error: `, err);
          alert('Error occured in getting products');
        }
    }

    // 2 - Function to add new product
    const addNewProduct = async (newProduct : AddProductInput) => {
        try {
            // add product
            const res : any = await API.graphql({
                query: addProduct,
                variables: {
                    product: newProduct
                }
            })
            // get data
            const data = await res.data.addProduct;
            console.log('Added Product', data);
            // update UI
            setProductsData([...productsData, data]);
            titleRef.current.value = '';
            priceRef.current.value = '';
        } catch (err) {
            console.log(`Error: `, err);
            alert('Error occured in adding the product');
        }
    }

    // 3 - Function to set Product on Form to Update
    const setProductToUpdate = (product = null) => {
        switch(product) {
            case null:
                setCurrent(null);
                titleRef.current.value = '';
                priceRef.current.value = '';
                break;
            default:
                setCurrent(product);
                titleRef.current.value = product.title;
                priceRef.current.value = product.price;
                break;
        }
    }

    // 4 - Function to add new product
    const updateExistingProduct = async (existingProduct : UpdateProductInput) => {
        try {
            // update product
            const res : any = await API.graphql({
                query: updateProduct,
                variables: {
                    product: existingProduct
                }
            })
            // get data
            const data = await res.data.updateProduct;
            console.log('Updated Product', data);
            // update UI
            setProductsData(
                productsData.map(product => product.id === existingProduct.id ? existingProduct : product)
            );
            // set current to null
            setProductToUpdate();
        } catch (err) {
            console.log(`Error: `, err);
            alert('Error occured in updating the product');
        }
    }

    // 5 - Function to handle on form submit (Add and Update both)
    const onSubmit = async e => {
        e.preventDefault();
        if (titleRef.current.value.trim() === '' && priceRef.current.value.trim() === '') {
            alert('Some credentials are missing');
        } else {
            // Get the new Product entered in the form
            const inputProduct : any = {
                title: titleRef.current.value,
                price: parseFloat(priceRef.current.value)
            }
            // Add or Update ?
            if (current) {
                // Update
                inputProduct.id = current.id;
                updateExistingProduct(inputProduct);
            } else {
                // Add
                addNewProduct(inputProduct);
            }
        }
    }


    const deleteTheProduct = async id => {
        try {
            // delete product
            await API.graphql({
                query: deleteProduct,
                variables: {
                    productID: id
                }
            })
            console.log('Deleted Product', id);
            setProductsData(productsData.filter(product => product.id !== id))
        } catch (err) {
            console.log('Error', err);
            alert('Error occured in updating the product');
        }
    }

    return (
        <div className="products">
            <h1>Products</h1>
            <small><span>Title</span><span>Price</span></small>
            <ul>
                {
                    productsData && productsData.length !== 0 ?
                    productsData.map( product => {
                        const {id, title, price} = product;
                        return (
                            <li key={id}>
                                <div className="data">
                                    <span>{title}</span>
                                    <span>${price}</span>
                                </div>
                                <div className="controls">
                                    <button className="update" onClick={() => setProductToUpdate(product)}>Update</button>
                                    <button className="delete" onClick={() => deleteTheProduct(id)}>Delete</button>
                                </div>
                            </li>
                        )
                    }) : <p style={{padding: '10px'}}>No Products available</p>
                }
            </ul>
            <form onSubmit={onSubmit}>
                <h4>{current ? 'Update the Product' : 'Add New Product'}</h4>
                <div className="inputs">
                    <input ref={titleRef} type="text" placeholder="Enter Title" />
                    <input ref={priceRef} type="number" placeholder="Enter Price" />
                </div>
                <input type="submit" value={current ? 'Update' : 'Add'} />
            </form>
        </div>
    )
}

export default Products;