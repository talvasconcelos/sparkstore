import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query {
    allProducts {
      id
      title
      intro
      image {
        filename
        publicUrl
      }
      price
      qty
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query getProductDetails($id: ID!) {
    Product(where: { id: $id }) {
      id
      url
      title
      intro
      description
      image {
        filename
        publicUrl
      }
      price
      qty
    }
  }
`;

export const ADD_ORDER = gql`
  mutation AddOrder(
    $user_name: String!
    $cart: CartItemRelateToManyInput
    $email: String!
    $address: String!
    $comment: String!
    $total: Float!
  ) {
    createOrder(
      data: {
        user_name: $user_name
        cart: $cart
        user_email: $email
        user_address1: $address
        user_comments: $comment
        total: $total
      }
    ) {
      id
    }
  }
`;

export const GET_ORDER = gql`
  query GET_ORDER($id: ID!) {
    Order(where: { id: $id }) {
      cart {
        item {
          title
          price
          qty
        }
        qty
      }
      total
      settled
      status
      invoice {
        id
        amount
        payment_request
        updatedAt
      }
    }
  }
`;

export const UPDATE_INVOICE = gql`
  mutation renewInvoice($id: ID!) {
    updateInvoice(id: $id, data: {}) {
      amount
      payment_request
      updatedAt
    }
  }
`;
