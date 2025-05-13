let startX = 0;
let currentPage = 0;
const totalPages = 5;
const main = document.getElementById("main-container");
const categoryBar = document.getElementById("categoryBar");

const navLinks = document.querySelectorAll(".nav-scroll a");
const pages = ["trending", "news", "videos", "viral", "updates"];

// Define categories
const pageCategories = {
  trending: ["All", "Hot", "Now"],
  news: ["All", "Politics", "Sports", "Technology"],
  videos: ["All", "Music", "Comedy", "Education"],
  viral: ["All", "Memes", "Challenges"],
  updates: ["All", "Product", "Patch"]
};

// --- Highlight current nav link
function updateActiveNav() {
  navLinks.forEach((link, index) => {
    if (index === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// --- Filter posts by selected category
function filterPosts(category) {
  const pageId = pages[currentPage];
  const section = document.getElementById(pageId);
  const posts = section.querySelectorAll(".post");

  posts.forEach(post => {
    const cat = post.getAttribute("data-category");
    if (category === "All" || cat === category) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });
}

// --- Update category bar
function updateCategoryBar() {
  const currentId = pages[currentPage];
  const categories = pageCategories[currentId] || [];
  categoryBar.innerHTML = "";

  categories.forEach(cat => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = cat;
    a.addEventListener("click", () => filterPosts(cat));
    categoryBar.appendChild(a);
  });

  filterPosts("All");
  updateActiveNav();
}

// --- Touch swipe logic
function startTouch(e) {
  startX = e.touches[0].clientX;
}

function moveTouch(e) {
  if (!startX) return;

  const diffX = startX - e.touches[0].clientX;

  if (Math.abs(diffX) > 50) {
    if (diffX > 0 && currentPage < totalPages - 1) {
      currentPage++;
    } else if (diffX < 0 && currentPage > 0) {
      currentPage--;
    }
    main.style.transform = `translateX(-${currentPage * 100}vw)`;
    updateCategoryBar();
    startX = 0;
  }
}

// --- Nav link click
navLinks.forEach((a, index) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = index;
    main.style.transform = `translateX(-${index * 100}vw)`;
    updateCategoryBar();
  });
});

updateCategoryBar();

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      loader.style.opacity = 0;
      loader.style.visibility = "hidden";
    }, 1000); // Optional delay for smoother experience
  });


  //shorts

  document.querySelectorAll('.shorts-post').forEach((post) => {
    const videoId = post.getAttribute('data-video-id');
    const iframe = post.querySelector('.shorts-video');
    iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&mute=0&playsinline=1`;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframeWin = entry.target.querySelector('iframe').contentWindow;
          if (entry.isIntersecting) {
            iframeWin.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } else {
            iframeWin.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        });
      },
      { threshold: 0.7 }
    );
  
    observer.observe(post);
  });
  
      const shorts = document.querySelectorAll('.short');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (entry.isIntersecting) {
              iframe.src = entry.target.dataset.video + "?autoplay=1&mute=0&playsinline=1";
            } else {
              iframe.src = "";
            }
          });
        },
        { threshold: 0.9 }
      );
      
      shorts.forEach(short => observer.observe(short));
  
