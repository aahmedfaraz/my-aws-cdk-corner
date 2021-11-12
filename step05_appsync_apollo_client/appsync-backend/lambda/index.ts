import getProducts from './getProducts';
import addProduct from './addProduct';
import updateProduct from './updateProduct';
import deleteProduct from './deleteProduct';

type AppsyncEvent = {
    info: {
        fieldName: String
    },
    arguments: {
        product: Product
        productID: String
    }
}

type Product = {
    id: String
    title: String
    price: Number
}

exports.handler = async ( event : AppsyncEvent ) => {
    const { info: {fieldName}, arguments: {product, productID} } = event;
    
    switch( fieldName ) {
        case 'welcome':
            return 'Welcome from Appsync Lambda developed by <Ahmed_Faraz/>'
        case 'products':
            return await getProducts();
        case 'addProduct':
            return await addProduct(product);
        case 'updateProduct':
            return await updateProduct(product);
        case 'deleteProduct':
            return await deleteProduct(productID);
        default:
            return 'No Match Found'
    }
}