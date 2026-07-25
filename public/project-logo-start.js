(() => {
  const track = document.querySelector('.logo-marquee-track');
  if (!track) return;

  const reorderAndPause = () => {
    const cards = Array.from(track.children);
    if (cards.length < 11) return;

    const firstSet = cards.slice(0, 11);
    const priorityIndexes = [0, 1, 2, 4, 5, 9];
    const remainingIndexes = [3, 6, 7, 8, 10];
    const orderedSet = [...priorityIndexes, ...remainingIndexes]
      .map((index) => firstSet[index])
      .filter(Boolean);

    if (orderedSet.length !== firstSet.length) return;

    track.innerHTML = '';
    for (let loop = 0; loop < 3; loop += 1) {
      orderedSet.forEach((card) => {
        track.appendChild(card.cloneNode(true));
      });
    }

    track.style.transform = 'translate3d(0, 0, 0)';
    track.style.animationPlayState = 'paused';

    const startMarquee = () => {
      window.setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 1400);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        startMarquee();
      }, { threshold: 0.35 });

      observer.observe(track);
    } else {
      startMarquee();
    }
  };

  reorderAndPause();
})();

(() => {
  const slug = '/posts/xay-thuong-hieu-xay-duong-mon-trong-tam-tri';
  const path = window.location.pathname.replace(/\/$/, '');
  const title = 'XÂY THƯƠNG HIỆU CHÍNH LÀ XÂY ĐƯỜNG MÒN TRONG TÂM TRÍ';
  const excerpt = 'Xây dựng thương hiệu thực chất là cuộc chiến giành “chỗ đứng” trong tâm trí khách hàng. Có những thương hiệu không cần xuất hiện ồn ào, nhưng chỉ cần nhìn thấy một màu sắc, một câu chữ, một kiểu hình ảnh quen thuộc, ta lập tức nhớ ra họ.';

  const blocks = [
    { type: 'p', text: 'Xây dựng thương hiệu thực chất là cuộc chiến giành “chỗ đứng” trong tâm trí khách hàng. Có những thương hiệu không cần xuất hiện ồn ào, nhưng chỉ cần nhìn thấy một màu sắc, một câu chữ, một kiểu hình ảnh quen thuộc, ta lập tức nhớ ra họ.' },
    { type: 'p', text: 'Trong tâm trí khách hàng, thương hiệu không được xây bằng một lần nhìn thấy, một chiến dịch viral hay một bài viết thật hay. Thương hiệu được hình thành giống như một con đường mòn: ban đầu chỉ là vài dấu vết mờ, sau đó được lặp lại đủ nhiều, đủ nhất quán, đủ cảm xúc để trở thành lối đi quen thuộc trong nhận thức. Mỗi lần khách hàng nhìn thấy logo, màu sắc, thông điệp, giọng nói hay trải nghiệm từ thương hiệu, não bộ lại ghi nhận thêm một tín hiệu nhỏ. Những tín hiệu ấy nếu rời rạc sẽ nhanh chóng biến mất. Nhưng nếu được lặp lại có chủ đích, chúng bắt đầu nối với nhau và tạo thành cảm giác quen thuộc.' },
    { type: 'p', text: 'Vì vậy, xây thương hiệu không chỉ là làm cho đẹp hơn, nói cho hay hơn hay xuất hiện nhiều hơn. Xây thương hiệu là quá trình tạo ra một lối đi đủ rõ trong tâm trí khách hàng, để khi họ có nhu cầu, thương hiệu của bạn trở thành một trong những cái tên được nhớ đến đầu tiên.' },
    { type: 'p', text: 'Nghe có vẻ phức tạp, nhưng tất cả bắt đầu từ cách bộ não tiếp nhận và lưu giữ thông tin.' },
    { type: 'h2', text: '1, Bộ não tiếp nhận thông tin dù chỉ lướt qua' },
    { type: 'p', text: 'Khi bạn lướt qua một logo, một màu sắc hay một câu chữ trong 1- 2 giây, bạn nghĩ mình chẳng ghi nhớ gì nhưng bộ não không vận hành theo kiểu đó. Ngay khi thấy tín hiệu, dù rất nhỏ và rất nhanh, bộ não lập tức xử lý thông tin đó.' },
    { type: 'p', text: 'Đầu tiên, giác quan sẽ hoạt động như một cảm biến ghi nhận màu sắc, hình dạng, con chữ… rồi chuyển tất cả thành tín hiệu điện hoá. Những tín hiệu này được gửi thẳng về trung tâm xử lý. Mọi thứ xảy ra rất nhanh và quan trọng hơn là toàn bộ quá trình này diễn ra dưới mức nhận thức. Tức là dù bạn không hề cảm thấy mình đang tiếp nhận thông tin, không cảm thấy mình đang ghi nhớ, nhưng não vẫn âm thầm lưu lại.' },
    { type: 'p', text: 'Sau khi xử lý, não sẽ tạo ra những ký ức siêu ngắn. Phần thông tin nhạt nhòa sẽ bị bỏ qua còn những thứ nổi bật như màu sắc mạnh, hình dạng khác lạ hoặc nội dung chứa cảm xúc sẽ được giữ lại như những “dấu chấm” nhỏ nằm rải rác trong bản đồ ký ức.' },
    { type: 'h2', text: '2, Lặp lại đủ lâu, những “dấu chấm” trở thành “đường mòn”' },
    { type: 'p', text: 'Những ký ức siêu ngắn nếu không được nhắc lại sẽ dần dần biến mất. Để thông điệp tạo thành ký ức dài hạn, cần lặp lại đủ nhiều để bộ não nhận ra sự quen thuộc. Khi đó những mảnh ký ức rời rạc sẽ nối lại và tạo thành một “con đường”. Càng tiếp nhận thêm thông tin, “con đường” này càng ngày càng rõ hơn.' },
    { type: 'p', text: 'Trong hành vi học có một hiệu ứng gọi là hiệu ứng tiếp xúc lặp lại - Nghĩa là chỉ cần một thông tin xuất hiện nhiều lần, con người sẽ có xu hướng thích nó hơn, tin nó hơn. Bộ não hoạt động theo nguyên tắc tối ưu năng lượng nên khi thấy thứ gì đủ nhiều lần, bộ não sẽ đánh dấu bằng nhãn “an toàn, có thể tin được”. Từ đó hình thành chuỗi phản ứng tự nhiên: Lặp lại → Quen → Cảm giác an toàn → Đưa ra lựa chọn.' },
    { type: 'p', text: 'Đó là lý do nhiều thương hiệu không cần quá hào nhoáng. Họ chỉ cần xuất hiện đều đặn, đúng một thông điệp, đúng tông giọng và cứ thế “găm” vào tiềm thức khách hàng.' },
    { type: 'h2', text: '3, Cảm xúc là “chất keo” giúp ký ức bám sâu hơn' },
    { type: 'p', text: 'Trong khoa học thần kinh, có hai yếu tố quyết định việc thông tin có nằm lại trong ký ức dài hạn hay không, đó là: MỨC ĐỘ LẶP LẠI và CƯỜNG ĐỘ CẢM XÚC. Hai yếu tố này tạo ra cơ chế ghi nhớ mạnh mẽ hơn bất kỳ kỹ thuật marketing nào. Bộ não không ưu tiên thông tin quan trọng nhất mà theo mức độ cảm xúc mà nó cảm nhận được ngay tại thời điểm đó. Chính trung tâm xử lý cảm xúc sẽ quyết định thông tin nào sẽ được chuyển vào ký ức dài hạn, thông tin nào sẽ bị xóa bỏ.' },
    { type: 'p', text: 'Khi ta tiếp xúc với thông tin kèm theo một cảm xúc (tò mò, thích thú, sợ hãi, tức giận…) trung tâm cảm xúc được kích hoạt mạnh và gửi lệnh “ưu tiên lưu trữ” đến vùng mã hoá ký ức. Nhờ đó, những đường dẫn ký ức được hình thành nhanh hơn, mạnh hơn và khó biến mất hơn. Điều này lý giải vì sao thương hiệu cần lặp lại nhưng không thể lặp lại khô khan. Bạn phải khiến khách hàng cảm nhận được điều gì đó mỗi lần họ nhìn thấy bạn.' },
    { type: 'h2', text: '4, Thương hiệu hình thành không đến từ những khoảnh khắc bùng nổ' },
    { type: 'p', text: 'Thương hiệu không hình thành nhờ vài khoảnh khắc viral mà nhờ sự kiên trì và lặp lại có chiến lược:' },
    { type: 'ul', items: ['Nội dung xuất hiện đều.', 'Thông điệp nhất quán.', 'Cảm xúc được kích hoạt đúng cách.', 'Màu sắc, hình ảnh, giọng điệu thống nhất.', 'Trải nghiệm khách hàng được duy trì ổn định.'] },
    { type: 'p', text: 'Tuy nhiên, điều khó nhất của xây thương hiệu không nằm ở việc nghĩ ra một thông điệp hay. Cái khó nằm ở việc đủ kỷ luật để lặp lại thông điệp đó trong một thời gian dài mà không làm nó trở nên nhàm chán. Nhiều thương hiệu thay đổi giọng nói liên tục, hôm nay nói một kiểu, ngày mai chạy theo một xu hướng khác, tháng sau lại đổi định vị vì thấy đối thủ đang làm có vẻ hiệu quả. Kết quả là trong tâm trí khách hàng, thương hiệu không kịp tạo thành một đường mòn nào đủ rõ. Bởi vậy khi làm thương hiệu, bạn hãy nhớ rằng:' },
    { type: 'ul', items: ['Muốn được nhớ đến, thương hiệu cần sự nhất quán.', 'Muốn được tin tưởng, thương hiệu cần sự ổn định.', 'Muốn được lựa chọn, thương hiệu cần xuất hiện đúng lúc với một cảm giác đủ quen.'] },
    { type: 'p', text: 'Làm nội dung cho thương hiệu không phải là mỗi ngày nghĩ một thứ mới hoàn toàn. Làm nội dung đúng hơn là biết giữ lại phần cốt lõi cần được lặp lại, rồi diễn đạt nó bằng nhiều góc nhìn, nhiều câu chuyện, nhiều định dạng khác nhau. Một chiến lược nội dung tốt không chỉ trả lời câu hỏi “tháng này đăng gì?” mà phải trả lời được câu hỏi lớn hơn: “Sau một thời gian đủ dài, khách hàng sẽ nhớ gì về thương hiệu này?”. Nếu câu trả lời còn mơ hồ, rất có thể nội dung đang tạo ra nhiều “tiếng động” nhưng chưa tạo được “đường mòn”.' },
    { type: 'p', text: 'Trong một thị trường quá nhiều tiếng nói, thương hiệu không nhất thiết phải ồn ào nhất mà cần đủ nhất quán, đủ gần gũi và đủ đáng tin để khách hàng có thể nhớ đến một cách tự nhiên. Để làm được điều này, cần có chiến lược nội dung phù hợp với định vị rõ ràng và thông điệp nhất quán theo từng giai đoạn.' },
    { type: 'p', text: 'Có như vậy, thương hiệu mới có thể tạo được một “đường mòn” rõ hơn trong tâm trí khách hàng!.' }
  ];

  const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const renderBlock = (block) => {
    if (block.type === 'h2') return `<h2>${escapeHtml(block.text)}</h2>`;
    if (block.type === 'ul') return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    return `<p>${escapeHtml(block.text)}</p>`;
  };

  const applyArticleUpdate = () => {
    if (path !== slug) return;
    const titleNode = document.querySelector('.article-title');
    const excerptNode = document.querySelector('.article-excerpt');
    const contentNode = document.querySelector('.article-content');

    if (titleNode) titleNode.textContent = title;
    if (excerptNode) excerptNode.textContent = excerpt;
    if (contentNode) contentNode.innerHTML = blocks.map(renderBlock).join('');

    document.title = `${title} - Nội Dung Chạm`;
  };

  const applyCardUpdate = () => {
    document.querySelectorAll(`a[href*="${slug}"]`).forEach((link) => {
      const card = link.closest('article, .post-card, .article-card, .blog-card, .featured-post, .post-list-item, li, section, div') || link.parentElement;
      const titleNode = card?.querySelector('h1, h2, h3, .post-title, .card-title, .article-title') || link;
      if (titleNode) titleNode.textContent = title;

      const textNodes = Array.from(card?.querySelectorAll('p, .post-excerpt, .card-excerpt, .article-excerpt') || []);
      const excerptNode = textNodes.find((node) => !node.closest('.meta, .post-meta, .article-meta'));
      if (excerptNode) excerptNode.textContent = excerpt;
    });
  };

  const applyUpdates = () => {
    applyArticleUpdate();
    applyCardUpdate();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyUpdates, { once: true });
  } else {
    applyUpdates();
  }
  window.addEventListener('load', applyUpdates, { once: true });
})();
