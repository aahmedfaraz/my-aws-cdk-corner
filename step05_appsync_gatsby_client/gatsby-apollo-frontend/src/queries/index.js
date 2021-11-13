import { gql } from '@apollo/client';

export const QUERY_WELCOME = gql`
    query MyQuery {
        welcome
    }
`
export const QUERY_PRODUCTS = gql`
    query MyQuery {
        products {
            id
            price
            title
        }
    }
`

export const MUTATION_ADD_PRODUCT = gql`
    mutation MyMutation($newProduct: AddProductInput) {
        addProduct(product: $newProduct) {
            id
            price
            title
        }
    }
`

export const MUTATION_UPDATE_PRODUCT = gql`
    mutation MyMutation($renewProduct: UpdateProductInput) {
        updateProduct(product: $renewProduct) {
            id
            price
            title
        }
    }
`

export const MUTATION_DELETE_PRODUCT = gql`
    mutation MyMutation($pid: String) {
        deleteProduct(productID :$pid)
    }
`