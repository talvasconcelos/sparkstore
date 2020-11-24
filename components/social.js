const Social = () => {
  return (
    <ul class="share-buttons" data-source="simplesharingbuttons.com">
      <li>
        <a
          href=""
          title="Share on Facebook"
          target="_blank"
          onClick={(e) => {
            e.preventDefault();
            window.open(
              "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(document.URL) +
                "&quote=" +
                encodeURIComponent(document.URL)
            );
            return false;
          }}
        >
          <img alt="Share on Facebook" src="/simple_icons_black/Facebook.png" />
        </a>
      </li>
      <li>
        <a
          href=""
          target="_blank"
          title="Tweet"
          onclick={(e) => {
            e.preventDefault();
            window.open(
              "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(document.title) +
                " " +
                encodeURIComponent(document.URL)
            );
            return false;
          }}
        >
          <img alt="Tweet" src="/simple_icons_black/Twitter.png" />
        </a>
      </li>
      <li>
        <a
          href=""
          target="_blank"
          title="Submit to Reddit"
          onclick={(e) => {
            e.preventDefault();
            window.open(
              "http://www.reddit.com/submit?url=" +
                encodeURIComponent(document.URL) +
                "&title=" +
                encodeURIComponent(document.title)
            );
            return false;
          }}
        >
          <img alt="Submit to Reddit" src="/simple_icons_black/Reddit.png" />
        </a>
      </li>
    </ul>
  );
};

export default Social;
