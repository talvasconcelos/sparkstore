import { useQuery } from "@apollo/client";
import { GET_PRODUCT_DETAILS, GET_ALL_PRODUCTS } from "../../graphql/graphql";
import { useContext, useState, useEffect } from "react";
import CartContext from "../../components/cartContext";
import { useToasts } from "react-toast-notifications";
import { initializeApollo } from "../../lib/apolloClient";
import { useRouter } from "next/router";

const Productitem = ({ Product, loading, error, ...props }) => {
  const router = useRouter();
  const { addToast } = useToasts();
  const { addToCart, total } = useContext(CartContext);
  const [qty, setQty] = useState(1);
  const handleQty = (e) => {
    e.preventDefault();
    setQty(+e.target.value);
    // console.log(qty);
  };

  // const { data: { Product } = {}, loading, error } = useQuery(
  //   GET_PRODUCT_DETAILS,
  //   {
  //     variables: { id: props.id },
  //   }
  // );
  if (error) {
    addToast(error.message, { appearance: "error", autoDismiss: true });
    console.error("Failed to load product", error);
  }

  if (loading || router.isFallback) return <p>Loading...</p>;

  return (
    <div class="container grid-lg" style="margin-bottom: 3rem;">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/">Home</a>
        </li>
        <li class="breadcrumb-item">{Product.url}</li>
      </ul>
      <div class="columns">
        <div class="column col-sm-12 col-6">
          <figure>
            <img
              class="img-responsive img-fit-contain"
              src={Product.image.publicUrl}
              alt={Product.image.filename}
            />
          </figure>
        </div>
        <div class="column col-sm-12 col-6">
          <article>
            <h1 class="title">{Product.title}</h1>
            <h3 class="subtitle">
              <sup>&euro;</sup>
              {Product.price}
            </h3>
            <p>{Product.intro}</p>
            <p style="white-space: pre-line;">{Product.description}</p>
            <form class="form-horizontal">
              <div class="form-group">
                <div class="col-6 col-sm-9 input-group">
                  <span class="input-group-addon">Qty</span>
                  <input
                    class="form-input"
                    type="number"
                    min="1"
                    placeholder={1}
                    value={qty}
                    onChange={handleQty}
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="col-6 col-sm-9 input-group">
                  <button
                    class="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({ ...Product, qty: +qty });
                      total(Product.price * qty);
                      setQty(1);
                      addToast("Added to cart", {
                        appearance: "success",
                        autoDismiss: true,
                      });
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </form>
          </article>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const client = initializeApollo();
  const response = await client.query({
    query: GET_ALL_PRODUCTS,
  });

  const { allProducts } = response.data;

  const paths = allProducts.map((id) => ({
    params: { id: `${id.id}` },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  const data = await apolloClient.query({
    query: GET_PRODUCT_DETAILS,
    variables: { id: params.id },
  });

  return {
    props: {
      Product: data.data.Product,
      loading: data.loading,
      error: !data.error ? null : data.error,
    },
    revalidate: 1,
  };
}

// Productitem.getInitialProps = async ({ query: { id } }) => ({ id });

export default Productitem;
