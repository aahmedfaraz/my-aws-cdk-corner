# Steps to add Subscriptions

## 1. Add Subscriptions in graphql schema in CDK Backend

```js
type Subscription {
  onAddProduct: Product @aws_subscribe(mutations: ["addProduct"])
}
```

## 2. In Amplify Frontend get new Defined Subscription

```powershell
amplify codegen
```

```js
// OUTPUT
export const onAddProduct = /* GraphQL */ `
  subscription OnAddProduct {
    onAddProduct {
      id
      title
      price
    }
  }
`;
```

## 3. On Components use in this way

```js
import React, { useEffect } from 'react';
import { API } from 'aws-amplify';
import { onAddProduct } from '../graphql/subscriptions';

const Comp = () => {

    useEffect({
        // Subscription for - Add Product
        API.graphql({
            query: onAddProduct
        }).subscribe({
            next: (data) => { // This function will run on every subscription
                console.log('Added product Subscription', data);
            }
        })
        // eslint-disable-next-line
    },[])

    return (
        // ... My Elements
    )
}

```
