import { useContext, useState } from "react";
import { useRouter } from "next/router";
import CartContext from "../components/cartContext";
import CartItem from "../components/cartItem";
import { useToasts } from "react-toast-notifications";

import { useQuery, useMutation } from "@apollo/client";

import { ADD_ORDER } from "../graphql/graphql";

function ValidateEmail(inputText) {
  let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
}

const Cart = () => {
  const { cart, carttotal, resetCart } = useContext(CartContext);
  // const grouped = groupById(cart);
  const { addToast } = useToasts();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [orderId, setOrderId] = useState(false);

  const router = useRouter();

  const resetForm = () => {
    setName("");
    setAddress("");
    setEmail("");
    setComment("");
  };

  const [placeOrder, { data, error, loading }] = useMutation(ADD_ORDER, {
    onError(err) {
      addToast(err.message, { appearance: "error", autoDismiss: true });
      console.error(err);
    },
    onCompleted(data) {
      resetForm();
      setOrderId(data.createOrder.id);
      setTimeout(() => {
        // console.log("placeOrder", data.createOrder);
        resetCart();
        router.push(`/invoices/${data.createOrder.id}`);
      }, 500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ValidateEmail(email)) {
      addToast("Not a valid email.", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    placeOrder({
      variables: {
        user_name: name,
        cart: {
          create: cart.map((item) => ({
            item: { connect: { id: item.id } },
            qty: item.qty,
          })),
        },
        email: email,
        address: address,
        comment: comment,
        total: carttotal,
      },
    });
  };

  // console.log(cart);

  return (
    <div className="container grid-lg">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/">Home</a>
        </li>
        <li class="breadcrumb-item">Cart</li>
      </ul>
      <div className="columns">
        <div className="column col-8 col-sm-12">
          <table class="table is-fullwidth mt-6">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>
                  <abbr title="Quantity">Qty</abbr>
                </th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <CartItem key={item.id} product={item} count={item.qty} />
              ))}
            </tbody>
          </table>
          <br />
          <div className="columns mb-4">
            <div className="column col-9 col-sm-12">
              <div class="form-group">
                <label class="form-label" for="input-example-3">
                  Want to add something...
                </label>
                <textarea
                  class="form-input"
                  id="input-example-3"
                  placeholder="...or just leave some nice words or suggestions?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="column col-4 col-sm-12">
          <aside>
            <header className="text-center mb-2">
              <h2 class="my-2">
                Cart Total: <span class="is-size-4">&euro;{carttotal}</span>
              </h2>
              <small>No dirty fiat accepted! Bitcoin only!</small>
            </header>
            <div className="col-10 col-mx-auto col-md-12">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input
                  class="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div class="form-group">
                <label class="form-label">Adress</label>
                <input
                  class="form-input"
                  type="text"
                  placeholder="Full address for delivery"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  class="form-input"
                  type="email"
                  placeholder="johndoe@mail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <p class="form-input-hint">
                  Please use a correct email, or we won't be able to contact you
                  if something goes wrong!
                </p>
              </div>
              <button
                class={`btn btn-lg btn-success mr-2 ${loading && "loading"}`}
                onClick={handleSubmit}
                disabled={!ValidateEmail(email) && !address}
              >
                Checkout
              </button>
              <button class="btn btn-lg btn-error" onClick={resetCart}>
                Clear
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
