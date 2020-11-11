import { useQuery } from "@apollo/client";
import Link from "next/link";
import { GET_ALL_PRODUCTS } from "../graphql/graphql";
import { initializeApollo } from "../lib/apolloClient";
import ProductCard from "../components/ProductCard";

const Home = (props) => {
  console.log(props);
  const { data: { allProducts } = {}, loading, error } = useQuery(
    GET_ALL_PRODUCTS
  );
  if (error) {
    console.error("Failed to load events", error);
  }
  return (
    <div class="container grid-lg">
      <div className="columns">
        {allProducts.map((product, i) => (
          <ProductCard product={product} key={i} />
        ))}
      </div>
    </div>
  );
  // const [state, setState] = React.useState(0);
  // return (
  //   <main>
  //     <h1>Hello from Preact</h1>
  //     <p>{state}</p>
  //     <button onClick={() => setState(state + 1)}>Increment</button>
  //     <Link href="/about">
  //       <a>About</a>
  //     </Link>
  //   </main>
  // );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GET_ALL_PRODUCTS,
  });
  // console.log(apolloClient.cache.extract());
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}

export default Home;
