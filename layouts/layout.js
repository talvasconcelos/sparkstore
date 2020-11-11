import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = (props) => (
  <>
    <Head />
    <Navbar />
    {props.children}
    <Footer />
  </>
);

export default Layout;
