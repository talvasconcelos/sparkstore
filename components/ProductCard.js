import Link from "next/link";
import { useContext } from "react";
import CartContext from "./cartContext";
import { useToasts } from "react-toast-notifications";

const ProductCard = (props) => {
  const { addToCart, total } = useContext(CartContext);
  const { addToast } = useToasts();
  return (
    <div
      className="column col-sm-12 col-md-6 col-4"
      style="margin-bottom: 1em;"
    >
      <div class="card">
        <div class="card-header">
          <div class="card-title h5">{props.product.title}</div>
        </div>
        <div class="card-image">
          <figure class="is-16by9">
            <img src={props.product.image.publicUrl} />
          </figure>
        </div>
        <div class="card-body">
          <p style="height: 1rem;word-wrap: break-word;text-overflow:ellipsis;">
            {props.product.intro}
          </p>
          <div class="card-subtitle text-gray">
            <sup>&euro; </sup>
            {props.product.price}
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-lg mx-1"
            onClick={(e) => {
              e.preventDefault();
              addToCart(props.product);
              total(props.product.price);
              addToast("Added to cart", {
                appearance: "success",
                autoDismiss: true,
              });
            }}
          >
            Buy
          </button>
          <Link href="/products/[id]" as={`/products/${props.product.id}`}>
            <button class="btn btn-lg mx-1">Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
