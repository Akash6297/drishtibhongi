let startX = 0;  // Starting point of touch
let currentPage = 0;
const totalPages = 50;
const main = document.getElementById("main-container");
const categoryBar = document.getElementById("categoryBar");

const navLinks = document.querySelectorAll(".nav-scroll a");
const pages = ["trending", "news", "videos", "viral", "updates"];

// Define categories
const pageCategories = {
  trending: ["সবকিছু", "দেশ", "এখন"],
  news: ["সবকিছু", "রাজনীতি", "খেলাধুলা", "প্রযুক্তি"],
  viral: ["সবকিছু", "মিমস", "চ্যালেঞ্জ"],
  updates: ["সবকিছু", "উৎপাদিত", "পার্শে"]
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
    if (category === "সবকিছু" || cat === category) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });
}

// --- Update category bar
function updateCategoryBar() {
const currentId = pages[currentPage];
  if (currentId === "trending") {
    categoryBar.style.display = "none";
    return;
  }
  if (currentId === "videos"){
    categoryBar.style.display = "none";
    return;
  }

  categoryBar.style.display = "flex";
  categoryBar.innerHTML = "";
  const categories = pageCategories[currentId] || [];
  categoryBar.innerHTML = "";

  categories.forEach(cat => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = cat;
    a.addEventListener("click", () => filterPosts(cat));
    categoryBar.appendChild(a);
  });

  filterPosts("সবকিছু");
  updateActiveNav();
}

// --- Touch swipe logic (updated)
function startTouch(e) {
  startX = e.touches[0].clientX; // Get initial touch position
}

function moveTouch(e) {
  if (!startX) return;

  const diffX = startX - e.touches[0].clientX; // Calculate swipe difference

  // If the swipe is significant enough
  if (Math.abs(diffX) > 50) {
    if (diffX > 0 && currentPage < totalPages - 1) { // Swipe left (next page)
      currentPage++;
    } else if (diffX < 0 && currentPage > 0) { // Swipe right (previous page)
      currentPage--;
    }
    
    // Update main container position (transition to the new page)
    main.style.transform = `translateX(-${currentPage * 100}vw)`;
    updateCategoryBar();
    startX = 0; // Reset startX to avoid continuous movement
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

// --- Load page content and update category bar
updateCategoryBar();

// --- Listen to touch events (move and start)
main.addEventListener("touchstart", startTouch);
main.addEventListener("touchmove", moveTouch);

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.visibility = "hidden";
  }, 1000); // Optional delay for smoother experience
});

// --- Handle shorts (video posts)
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
