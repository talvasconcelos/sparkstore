const CartItem = (props) => {
  return (
    <tr>
      <th>{props.product.title}</th>
      <td>
        &euro;
        {props.product.price}
      </td>
      <td>{props.count}</td>
      <td>
        &euro;
        {+(props.count * props.product.price).toFixed(2)}
      </td>
    </tr>
  );
};

export default CartItem;
