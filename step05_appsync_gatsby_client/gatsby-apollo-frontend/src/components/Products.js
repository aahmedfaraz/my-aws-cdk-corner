import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../queries';

const Products = () => {

    const { loading, error, data } = useQuery(QUERY_PRODUCTS);

    if(loading) {
        return <p>Loading Products...</p>
    }

    if(error) {
        return <p>Error Occured in getting Products...</p>
    }

    return (
        <div className="products">
            <h1>Products</h1>
            <small><span>Title</span><span>Price</span></small>
            <ul>
                {
                    data.products && data.products.length !== 0 ?
                    data.products.map(({id, title, price}) => (
                        <li key={id}>
                            <div className="data">
                                <span>{title}</span>
                                <span>${price}</span>
                            </div>
                            <div className="controls">
                                <button className="update">Update</button>
                                <button className="delete">Delete</button>
                            </div>
                        </li>
                    )) : <p style={{padding: '10px'}}>No Products available</p>
                }
            </ul>
            <form>
                <h4>Add New Product</h4>
                <div className="inputs">
                    <input type="text" placeholder="Enter Title" />
                    <input type="number" placeholder="Enter Price" />
                </div>
                <input type="submit" value="Add" />
            </form>
        </div>
    )
}

export default Products;