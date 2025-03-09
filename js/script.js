// js/script.js

// Change navbar background on scroll
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Initialize the Swiper carousel for the main video area
  var swiper = new Swiper(".main-video-swiper", {
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Attach click events to each sidebar item to jump to the corresponding slide
  document.querySelectorAll(".sidebar-item").forEach(function(item) {
    item.addEventListener("click", function() {
      var slideIndex = parseInt(this.getAttribute("data-slide"), 10);
      swiper.slideTo(slideIndex);
    });
  });
});
