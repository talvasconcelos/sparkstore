const Footer = () => {
  return (
    <footer class="hero bg-dark">
      <div className="hero-body container grid-md text-center">
        <h2>SparkStore</h2>
        <p class="text-gray">
          brought to you by <a href="http://sparkpay.pt">Sparkpay</a>
        </p>
        <div class="divider"></div>
        <div className="columns" style="margin: 1rem 0;">
          <div
            class="col-sm-12 col-4 my-2 text-left"
            style="padding-right: 2rem;"
          >
            <h3>SparkStore</h3>
            <p class="text-gray">
              Cool stuff on the Lightning Network and Bitcoin.
            </p>
          </div>
          <div
            class="col-sm-12 col-4 my-2 text-left"
            style="padding-right: 2rem;"
          >
            <h3>Links</h3>
            <ul class="nav">
              <li class="nav-item">
                <a href="http://sparkpay.pt">Sparkpay</a>
              </li>
              <li class="nav-item">
                <a href="https://blog.sparkpay.pt">Blog</a>
              </li>
              <li class="nav-item">
                <a href="https://pos.sparkpay.pt">PoS</a>
              </li>
            </ul>
          </div>
          <div
            class="col-sm-12 col-4 my-2 text-left"
            style="padding-right: 2rem;"
          >
            <h3>Contacts</h3>
            <ul class="nav">
              <li class="nav-item">
                <a href="mailto:geral@sparkpay.pt">Email</a>
              </li>
              <li class="nav-item">
                <a href="https://www.instagram.com/sparkpay.pt/">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="copyright text-gray">
        <p>
          &copy; 2020 Sparkpay. Made by{" "}
          <a href="https://twitter.com/talvasconcelos">talvasconcelos</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

// <div className="container grid-md">

// </div>
