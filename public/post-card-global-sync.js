(() => {
  const posts = [
    {
      slug: "/posts/xay-thuong-hieu-xay-duong-mon-trong-tam-tri",
      title: "XÂY THƯƠNG HIỆU CHÍNH LÀ XÂY ĐƯỜNG MÒN TRONG TÂM TRÍ",
      excerpt: "Xây dựng thương hiệu thực chất là cuộc chiến giành “chỗ đứng” trong tâm trí khách hàng. Có những thương hiệu không cần xuất hiện ồn ào nhưng chỉ cần nhìn thấy một câu chữ, một hình ảnh quen thuộc, ta lập tức nhớ ra họ.",
      image: "/media/images/thumb-xay-thuong-hieu-xay-duong-mon-trong-tam-tri.svg"
    },
    {
      slug: "/posts/tiep-thi-trao-quyen",
      title: "TIẾP THỊ TRAO QUYỀN - XU HƯỚNG LÀM NỘI DUNG MỚI TRONG MARKETING",
      excerpt: "Tiếp thị trao quyền không cố gắng kiểm soát toàn bộ quá trình quyết định của khách hàng. Thay vào đó, thương hiệu giúp khách hàng có đủ dữ liệu và góc nhìn để tự đưa ra lựa chọn.",
      image: "/media/images/thumb-tiep-thi-trao-quyen.svg"
    },
    {
      slug: "/posts/lam-nghe-content-tu-con-so-0",
      title: "LÀM NGHỀ CONTENT TỪ CON SỐ 0: NGƯỜI MỚI CẦN CHUẨN BỊ GÌ TRONG THỜI ĐẠI AI?",
      excerpt: "Làm Content trong thời đại AI không chỉ là viết bài. Người làm content cần sở hữu một bộ năng lực để có thể đứng vững và tiến xa trong nghề.",
      image: "/media/images/thumb-lam-nghe-content-tu-con-so-0.svg"
    }
  ];

  const normalize = (value) => (value || "").replace(/\s+/g, " ").trim();
  const setText = (node, text) => {
    if (node && normalize(node.textContent) !== text) node.textContent = text;
  };

  const countPostLinks = (node) => node.querySelectorAll?.('a[href*="/posts/"]').length || 0;

  const findCard = (link, slug) => {
    if (link.matches("a.post-row, a.post-card, a.article-card, a.blog-card")) return link;

    const direct = link.closest("a.post-row, article, .post-card, .article-card, .blog-card, .featured-post, .post-list-item, li, .card, .entry");
    if (direct && direct.querySelector(`a[href*="${slug}"]`)) return direct;

    let node = link;
    for (let depth = 0; node && depth < 8; depth += 1) {
      if (node.nodeType !== 1) break;
      const hasThisPost = node === link || !!node.querySelector?.(`a[href*="${slug}"]`);
      const hasCardShape = !!node.querySelector?.("img,p,h1,h2,h3,.post-title,.card-title,.article-title,.post-excerpt,.card-excerpt,.article-excerpt");
      const tooBroad = countPostLinks(node) > 2;
      if (hasThisPost && hasCardShape && !tooBroad) return node;
      node = node.parentElement;
    }

    return link.parentElement || link;
  };

  const setImage = (card, post) => {
    card.querySelectorAll("picture source").forEach((source) => {
      source.setAttribute("srcset", post.image);
    });

    const img = card.querySelector("img");
    if (img) {
      img.setAttribute("src", post.image);
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.setAttribute("alt", post.title);
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
    }

    card.querySelectorAll("[style]").forEach((node) => {
      const bg = node.style?.backgroundImage || "";
      if (!bg || bg === "none") return;
      node.style.backgroundImage = `url("${post.image}")`;
      node.style.backgroundSize = "cover";
      node.style.backgroundPosition = "center";
    });
  };

  const updateCard = (post) => {
    document.querySelectorAll(`a[href*="${post.slug}"]`).forEach((link) => {
      const card = findCard(link, post.slug);
      if (!card) return;

      const heading = card.querySelector("h1,h2,h3,.post-title,.card-title,.article-title") || (card.matches?.("a") ? card : null);
      const paragraph = Array.from(card.querySelectorAll("p,.post-excerpt,.card-excerpt,.article-excerpt"))
        .find((node) => !node.closest(".meta,.post-meta,.article-meta,.byline,.taxonomy,.category"));

      setText(heading, post.title);
      setText(paragraph, post.excerpt);
      setImage(card, post);
    });
  };

  const updateArticleHeader = (post) => {
    if (location.pathname.replace(/\/$/, "") !== post.slug) return;
    setText(document.querySelector(".article-title"), post.title);
    setText(document.querySelector(".article-excerpt"), post.excerpt);
  };

  const apply = () => {
    posts.forEach((post) => {
      updateArticleHeader(post);
      updateCard(post);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }

  window.addEventListener("load", apply, { once: true });

  let runs = 0;
  const timer = window.setInterval(() => {
    apply();
    runs += 1;
    if (runs > 36) window.clearInterval(timer);
  }, 250);

  const observe = () => {
    if (!document.body) return;
    new MutationObserver(apply).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "style"]
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observe, { once: true });
  } else {
    observe();
  }
})();
