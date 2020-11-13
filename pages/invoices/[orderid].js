import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import QRCode from "qrcode";
import { useToasts } from "react-toast-notifications";
import { initializeApollo } from "../../lib/apolloClient";
const fetch = require("isomorphic-unfetch");

import { GET_ORDER, UPDATE_INVOICE } from "../../graphql/graphql";

const makeQR = async (address) => {
  try {
    const qr = await QRCode.toDataURL(address, { margin: 4 });
    return qr;
  } catch (err) {
    console.error(err);
  }
};

const RenewInvoice = ({ updateInvoice, invoiceId, loading }) => {
  return (
    <div class="empty my-2">
      <div class="empty-icon">
        <i class="icon icon-refresh" />
      </div>
      <p class="empty-title h5">The invoice expired.</p>
      <p class="empty-subtitle">Click to get a new one.</p>
      <div class="empty-action">
        <button
          class={`btn btn-primary ${loading ? "loading" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            updateInvoice({ variables: { id: invoiceId } });
          }}
        >
          New invoice
        </button>
      </div>
    </div>
  );
};

const InvoicePaid = ({ sats }) => {
  return (
    <>
      <svg
        class="checkmark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path
          class="checkmark__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
      <p class="text-center">
        <strong>{`${sats} sats paid!`}</strong>
      </p>
    </>
  );
};

const OrderPage = (props) => {
  // console.log(props);
  const { addToast } = useToasts();
  let showInvoice = false;
  const [qr, setQR] = useState("");
  const [time, setTime] = useState(0);

  const [updateInvoice, { loading: mutationLoading }] = useMutation(
    UPDATE_INVOICE,
    {
      refetchQueries: ["GET_ORDER"],
      onError(error) {
        addToast(error.message, { appearance: "error", autoDismiss: true });
      },
    }
  );
  const {
    data: { Order } = {},
    loading,
    error,
    startPolling,
    stopPolling,
  } = useQuery(GET_ORDER, {
    variables: { id: props.orderid },
    pollInterval: 5000,
  });

  if (error) {
    console.error("Failed to load product", error);
    addToast(error.message, { appearance: "error", autoDismiss: true });
  }
  if (loading) {
    return null;
  } else {
    if (Order.status === "expired") {
      stopPolling();
    }
    showInvoice = !Order.settled && Order.status === "pending";

    if (showInvoice) {
      makeQR(Order.invoice.payment_request).then((r) => setQR(r));
      startPolling(5000);
    }
  }
  const amount = Order.invoice.amount;

  return (
    <div className="container grid-lg">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/">Home</a>
        </li>
        <li class="breadcrumb-item">Invoice</li>
      </ul>
      <div className="columns">
        <div className="column col-6 col-sm-12 col-mx-auto">
          <div class="card">
            <div class="card-header">
              <div class="card-title h5">Invoice for your order</div>
              <div class="card-subtitle text-gray">{amount} sats</div>
            </div>
            <div class="card-image">
              {showInvoice ? (
                <a href={`lightning:${Order.invoice.payment_request}`}>
                  <img
                    src={qr}
                    alt={Order.invoice.payment_request}
                    class="img-responsive p-centered"
                  />
                </a>
              ) : Order.settled ? (
                <InvoicePaid sats={amount} />
              ) : (
                <RenewInvoice
                  updateInvoice={updateInvoice}
                  invoiceId={Order.invoice.id}
                  loading={mutationLoading}
                />
              )}
            </div>
            <div class="card-body">
              <p>{`Order #: ${props.orderid}`}</p>
              <ul>
                {Order.cart.map((item) => (
                  <li>
                    {`${item.qty}x ${item.item.title}`}
                    <span class="text-right float-right">
                      &euro;{item.item.price * item.qty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div class="card-footer">
              <p class="has-text-weight-semibold">
                {`Total:`}
                <span class="text-right float-right">&euro;{Order.total}</span>
              </p>
              <span class="text-right float-right">{amount} sats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export async function getServerSideProps({ params }) {
// const apolloClient = initializeApollo();
// const _data = await apolloClient.watchQuery({
//   query: GET_ORDER,
//   variables: { id: params.orderid },
//   pollInterval: 5000,
// });
// const data = await _data.result();
// console.log(data);
// Pass data to the page via props
// return {
//   props: {
//     orderid: params.orderid,
// Order: data.data.Order,
// loading: data.loading,
// error: !data.error ? null : data.error,
// Observable: _data,
// startPolling,
// stopPolling: _data.stopPolling,
//     },
//   };
// }

// OrderPage.getInitialProps = ({ query: { orderid } }) => ({ orderid });
OrderPage.getInitialProps = async ({ query, req, res }) => {
  if (req || res) {
    console.log("server", query.orderid);

    const request = async (id) => {
      const r = await fetch(
        `https://sparkstore-backend.herokuapp.com/custom/invoices/${id}`,
        {
          method: "GET",
        }
      );
      const resp = await r.json();
      console.log(resp);
      return resp;
    };
    return await request(req.url.split("/")[2]);
  }
  // console.log(ctx.req.url.split("/")[2]);
  return { orderid: query.orderid };
};

export default OrderPage;
