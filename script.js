function initDarkMode() {
  const darkModeToggle = document.querySelector('.nav-icons a[href="#"]');
  const moonIcon = darkModeToggle.querySelector("i");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    if (savedTheme === "dark-mode") {
      moonIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  darkModeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      moonIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark-mode");
    } else {
      moonIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light-mode");
    }
  });
}
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function initSearch() {
  const searchInput = document.querySelector(".search-container input");
  const searchButton = document.querySelector(".search-container button");
  const blogCards = document.querySelectorAll(".blog-card");

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    blogCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const content = card.querySelector("p").textContent.toLowerCase();
      const category = card
        .querySelector(".post-category")
        .textContent.toLowerCase();

      if (
        title.includes(searchTerm) ||
        content.includes(searchTerm) ||
        category.includes(searchTerm)
      ) {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.3s ease";
      } else {
        card.style.display = "none";
      }
    });

    const visibleCards = document.querySelectorAll(
      '.blog-card[style*="display: block"], .blog-card:not([style*="display: none"])'
    );
    if (visibleCards.length === 0 && searchTerm !== "") {
      showNoResults();
    } else {
      hideNoResults();
    }
  }

  function showNoResults() {
    let noResultsMsg = document.querySelector(".no-results");
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.className = "no-results";
      noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
      document.querySelector(".blog-posts").appendChild(noResultsMsg);
    }
  }

  function hideNoResults() {
    const noResultsMsg = document.querySelector(".no-results");
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      blogCards.forEach((card) => {
        card.style.display = "block";
      });
      hideNoResults();
    }
  });
}

function initLazyLoading() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const blogCards = document.querySelectorAll(".blog-card");
  blogCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
}

function calculateReadingTime() {
  const blogCards = document.querySelectorAll(".blog-card");

  blogCards.forEach((card) => {
    const content = card.querySelector("p").textContent;
    const words = content.split(" ").length;
    const readingTime = Math.ceil(words / 200);

    const readingTimeElement = document.createElement("span");
    readingTimeElement.className = "reading-time";
    readingTimeElement.textContent = `${readingTime} min read`;
    readingTimeElement.style.cssText = `
            color: #999;
            font-size: 12px;
            margin-left: 10px;
        `;

    const meta = card.querySelector(".blog-meta");
    meta.appendChild(readingTimeElement);
  });
}

function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #6c5ce7, #a855f7);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });
}

function initBackToTop() {
  const backToTopBtn = document.createElement("button");
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.className = "back-to-top";
  backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6c5ce7, #a855f7);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

  document.body.appendChild(backToTopBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = "1";
      backToTopBtn.style.visibility = "visible";
    } else {
      backToTopBtn.style.opacity = "0";
      backToTopBtn.style.visibility = "hidden";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initCardInteractions() {
  const blogCards = document.querySelectorAll(".blog-card");

  blogCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3").textContent;
      console.log(`Opening article: ${title}`);
    });

    const bookmarkBtn = document.createElement("button");
    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
    bookmarkBtn.className = "bookmark-btn";
    bookmarkBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 50px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        `;

    card.querySelector(".blog-card-image").appendChild(bookmarkBtn);

    bookmarkBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const icon = bookmarkBtn.querySelector("i");

      if (icon.classList.contains("far")) {
        icon.classList.replace("far", "fas");
        bookmarkBtn.style.backgroundColor = "rgba(108, 92, 231, 0.8)";
      } else {
        icon.classList.replace("fas", "far");
        bookmarkBtn.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      }
    });
  });
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function initNewsletterSignup() {
  const newsletterForm = document.querySelector("#newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;

      showToast("Thanks for subscribing!", "success");
      newsletterForm.reset();
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initSmoothScroll();
  initSearch();
  initLazyLoading();
  calculateReadingTime();
  initScrollProgress();
  initBackToTop();
  initCardInteractions();
  initNewsletterSignup();
});

const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .dark-mode {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
    }
    
    .dark-mode .blog-card {
        background-color: #2d2d2d !important;
        color: #ffffff !important;
    }
    
    .dark-mode .content-section {
        background-color: #1a1a1a !important;
    }
    
    .dark-mode .blog-card h3 {
        color: #ffffff !important;
    }
    
    .dark-mode .blog-card p {
        color: #cccccc !important;
    }
`;
document.head.appendChild(style);
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".blog-card");

  // List of links for each card (in order)
  const links = [
    "https://nikk-ui-templateiki.blogspot.com/2021/11/the-unexamined-life-is-not-worth-living.html",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    "https://nikk-ui-templateiki.blogspot.com/2021/11/life-is-fragile-were-not-guaranteed.html",
    "https://nikk-ui-templateiki.blogspot.com/2021/11/table-of-contents-help-google-to.html",
    "https://nikk-ui-templateiki.blogspot.com/2021/11/content-with-more-words-can-cover-wider.html",
    "https://nikk-ui-templateiki.blogspot.com/2021/11/how-do-i-rank-higher-on-google-search.html"
  ];

  cards.forEach((card, index) => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      window.open(links[index], "_blank");
    });
  });
});
