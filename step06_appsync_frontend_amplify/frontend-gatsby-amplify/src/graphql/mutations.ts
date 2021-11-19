/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addProduct = /* GraphQL */ `
  mutation AddProduct($product: AddProductInput) {
    addProduct(product: $product) {
      id
      title
      price
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct($product: UpdateProductInput) {
    updateProduct(product: $product) {
      id
      title
      price
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct($productID: String) {
    deleteProduct(productID: $productID)
  }
`;
