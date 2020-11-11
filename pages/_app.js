import App from "next/app";
import Head from "next/head";
import Layout from "../layouts/layout";
import cartContext from "../components/cartContext";
import "../store.scss";
import { ToastProvider } from "react-toast-notifications";
import { useApollo } from "../lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { useState, useEffect } from "react";

// export default class MyApp extends App {
//   state = {
//     cart: [],
//     carttotal: 0,
//   };
//
//   componentDidMount = () => {
//     console.log(this.props);
//     const cart = JSON.parse(localStorage.getItem("cart"));
//     const carttotal = JSON.parse(localStorage.getItem("total"));
//     if (cart) {
//       this.setState({
//         cart,
//         carttotal,
//       });
//     }
//   };
//
//   addToCart = async (product) => {
//     const productExists = this.state.cart.findIndex(
//       (item) => item.id === product.id
//     );
//     if (productExists >= 0) {
//       await this.setState((prevState) => {
//         const updatedItem = prevState.cart;
//         updatedItem[productExists] = {
//           ...updatedItem[productExists],
//           qty: prevState.cart[productExists].qty + 1,
//         };
//         return { cart: updatedItem };
//       });
//     } else {
//       await this.setState({
//         cart: [...this.state.cart, product],
//       });
//     }
//     localStorage.setItem("cart", JSON.stringify(this.state.cart));
//   };
//
//   calculateTotal = async (price) => {
//     await this.setState({
//       carttotal: parseFloat((this.state.carttotal + price).toFixed(2)),
//     });
//     localStorage.setItem("total", JSON.stringify(await this.state.carttotal));
//   };
//
//   resetCart = async () => {
//     await this.setState({ cart: [], carttotal: 0 });
//     localStorage.removeItem("cart");
//     localStorage.removeItem("total");
//   };
//
//   render() {
//     const { Component, pageProps } = this.props;
//     const apolloClient = useApollo(pageProps.initialApolloState);
//     return (
//       <ToastProvider>
//         <ApolloProvider client={apolloClient}>
//           <Head>
//             <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
//             <meta
//               name="viewport"
//               content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
//             />
//           </Head>
// <cartContext.Provider
//   value={{
//     cart: this.state.cart,
//     addToCart: this.addToCart,
//     total: this.calculateTotal,
//     carttotal: this.state.carttotal,
//     resetCart: this.resetCart,
//   }}
// >
//   <Layout>
//     <Component {...pageProps} />
//   </Layout>
// </cartContext.Provider>;
//         </ApolloProvider>
//       </ToastProvider>
//     );
//   }
// }

const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  const [cart, setCart] = useState([]);
  const [carttotal, setTotal] = useState(0);

  const addToCart = async (product) => {
    // console.log("cart", product);
    const productExists = cart.findIndex((item) => item.id === product.id);
    if (productExists >= 0) {
      const updatedItem = cart;
      updatedItem[productExists] = {
        ...updatedItem[productExists],
        qty: cart[productExists].qty + product.qty,
      };
      await setCart(updatedItem);
    } else {
      await setCart([...cart, product]);
    }
    return;
    // addToast("Added to cart", { appearance: "success" });
    // localStorage.setItem("cart", JSON.stringify(cart));
  };

  const calculateTotal = async (price) => {
    await setTotal(parseFloat((carttotal + price).toFixed(2)));
    localStorage.setItem("total", JSON.stringify(carttotal));
  };

  const resetCart = async () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem("cart");
    localStorage.removeItem("total");
  };
  useEffect(() => {
    const _cart = JSON.parse(localStorage.getItem("cart"));
    const _carttotal = JSON.parse(localStorage.getItem("total"));
    if (_cart) {
      setCart(_cart);
      setTotal(_carttotal);
    } /*else {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("total", JSON.stringify(carttotal));
    }*/
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(carttotal));
  }, [cart, carttotal]);

  return (
    <ToastProvider>
      <ApolloProvider client={apolloClient}>
        <cartContext.Provider
          value={{
            cart: cart,
            addToCart: addToCart,
            total: calculateTotal,
            carttotal: carttotal,
            resetCart: resetCart,
          }}
        >
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
            />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </cartContext.Provider>
      </ApolloProvider>
    </ToastProvider>
  );
};

export default MyApp;
