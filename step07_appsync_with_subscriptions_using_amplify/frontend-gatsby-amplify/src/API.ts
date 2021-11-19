/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AddProductInput = {
  title?: string | null,
  price?: number | null,
};

export type Product = {
  __typename: "Product",
  id?: string | null,
  title?: string | null,
  price?: number | null,
};

export type UpdateProductInput = {
  id?: string | null,
  title?: string | null,
  price?: number | null,
};

export type AddProductMutationVariables = {
  product?: AddProductInput | null,
};

export type AddProductMutation = {
  addProduct?:  {
    __typename: "Product",
    id?: string | null,
    title?: string | null,
    price?: number | null,
  } | null,
};

export type UpdateProductMutationVariables = {
  product?: UpdateProductInput | null,
};

export type UpdateProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    id?: string | null,
    title?: string | null,
    price?: number | null,
  } | null,
};

export type DeleteProductMutationVariables = {
  productID?: string | null,
};

export type DeleteProductMutation = {
  deleteProduct?: string | null,
};

export type WelcomeQuery = {
  welcome?: string | null,
};

export type ProductsQuery = {
  products?:  Array< {
    __typename: "Product",
    id?: string | null,
    title?: string | null,
    price?: number | null,
  } | null > | null,
};

export type OnAddProductSubscription = {
  onAddProduct?:  {
    __typename: "Product",
    id?: string | null,
    title?: string | null,
    price?: number | null,
  } | null,
};

export type OnUpdateProductSubscription = {
  onUpdateProduct?:  {
    __typename: "Product",
    id?: string | null,
    title?: string | null,
    price?: number | null,
  } | null,
};

export type OnDeleteProductSubscription = {
  onDeleteProduct?: string | null,
};
