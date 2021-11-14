import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PRODUCTS, MUTATION_ADD_PRODUCT, MUTATION_UPDATE_PRODUCT, MUTATION_DELETE_PRODUCT } from '../queries';

const Products = () => {
    const [currentProduct, setCurrentProduct] = useState(null);

    const title = useRef('');
    const price = useRef('');
    
    const { loading : productsLoading, error : productsError, data : productsData} = useQuery(QUERY_PRODUCTS);
    const [ addProduct ] = useMutation(MUTATION_ADD_PRODUCT);
    const [ updateProduct ] = useMutation(MUTATION_UPDATE_PRODUCT);
    const [ deleteProduct ] = useMutation(MUTATION_DELETE_PRODUCT);

    if(productsLoading) {
        return <p>Loading Products...</p>
    } else {
        if(productsError){
            return <p>Error occured while loading Products</p>
        }
    }

    const addFormProduct = async e => {
        e.preventDefault();

        if(title.current.value.trim() !== '' && price.current.value.trim() !== ''){
            if(currentProduct) {
                await updateProduct({
                    variables: {
                        renewProduct: {
                            id: currentProduct.id,
                            title: title.current.value,
                            price: price.current.value
                        }
                    }
                })
                title.current.value = '';
                price.current.value = '';

                console.log('Product has been Updated');
                setCurrentProduct(null)
            } else {
                await addProduct({
                    variables: {
                        newProduct: {
                            title: title.current.value,
                            price: price.current.value
                        }
                    }
                })    
                title.current.value = '';
                price.current.value = '';

                console.log('Product has been Added');
            }
        } else {
            alert('Some credentials are missing.')
        }
    }

    const setProductToUpdate = product => {
        setCurrentProduct(product);
        title.current.value = product.title;
        price.current.value = product.price;
    }

    return (
        <div className="products">
            <h1>Products</h1>
            <small><span>Title</span><span>Price</span></small>
            <ul>
                {
                    productsData.products && productsData.products.length !== 0 ?
                    productsData.products.map(({id, title, price}) => (
                        <li key={id}>
                            <div className="data">
                                <span>{title}</span>
                                <span>${price}</span>
                            </div>
                            <div className="controls">
                                <button className="update" onClick={() => setProductToUpdate({id, title, price})}>Update</button>
                                <button className="delete" onClick={async () => {
                                    await deleteProduct({
                                        variables: {
                                            pid: id
                                        }
                                    })

                                    console.log('Product has been Deleted');
                                }}>Delete</button>
                            </div>
                        </li>
                    )) : <p style={{padding: '10px'}}>No Products available</p>
                }
            </ul>
            <form onSubmit={addFormProduct}>
                <h4>{currentProduct ? 'Update the Product' : 'Add New Product'}</h4>
                <div className="inputs">
                    <input ref={title} type="text" placeholder="Enter Title" />
                    <input ref={price} type="number" placeholder="Enter Price" />
                </div>
                <input type="submit" value={currentProduct ? 'Update' : 'Add'} />
            </form>
        </div>
    )
}

export default Products;