import Link from "next/link";
import CartContext from "./cartContext";
import { useContext } from "react";

const Navbar = (props) => {
  const { cart } = useContext(CartContext);
  return (
    <header class="navbar bg-dark" style="margin-bottom: 3rem;">
      <section class="navbar-section">
        <Link href="/">
          <a class="navbar-logo">
            <img src="/spark_logo_w.png" />
          </a>
        </Link>
      </section>
      <section class="navbar-section">
        <Link href="/cart">
          <a class="btn btn-link">Cart {cart.length}</a>
        </Link>
      </section>
    </header>
  );
};

export default Navbar;
