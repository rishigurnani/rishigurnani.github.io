// js/script.js

// 1. Change navbar background on scroll
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/**
 * Smart Video Logic: Ensures all fire background videos play 
 * only when they are actually in the viewer's gaze.
 */
function initializeVideoGazeLogic() {
  // Select all videos with the class "fire-video"
  const fireVideos = document.querySelectorAll(".fire-video");

  if (fireVideos.length === 0) return;

  const observerOptions = {
    root: null, 
    threshold: 0.1 // Trigger when 10% of the video is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      
      if (entry.isIntersecting) {
        // Video is in view - start it!
        // We use a promise check to prevent "play() request was interrupted" errors
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // Auto-play was prevented (usually by Low Power Mode)
            console.log("Playback prevented for a counter video.");
          });
        }
      } else {
        // Video is out of view - pause it
        video.pause();
      }
    });
  }, observerOptions);

  // Tell the observer to watch every single fire video found
  fireVideos.forEach(v => observer.observe(v));
}

// Ensure this runs after the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeVideoGazeLogic);