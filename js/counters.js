// Smooth, linear counter animation using requestAnimationFrame
function animateCounter(element, start, end, duration) {
  const fps = 60;
  const intervalTime = 1000 / fps;
  const totalFrames = Math.round(duration / intervalTime);
  const increment = (end - start) / totalFrames;
  let current = start;
  let frame = 0;
  
  function update() {
    frame++;
    current += increment;
    if (frame < totalFrames) {
      element.innerText = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      element.innerText = end; // Ensure the final value is exact
    }
  }
  requestAnimationFrame(update);
}

// Function to update all counters from the API and JSON files
function updateCountersFromAPI() {
  // 1. LinkedIn followers
  fetch("linkedin/stats.json")
    .then(res => res.json())
    .then(data => {
      const linkedinEl = document.getElementById("linkedin-counter");
      if (linkedinEl) animateCounter(linkedinEl, 0, data.followers, 2000);
    })
    .catch(err => console.error("Error loading LinkedIn stats:", err));

  // 2. GitHub stars: sum stars from profile repos and handle polygnn gracefully
  fetch("https://api.github.com/users/rishigurnani/repos?per_page=100")
    .then(res => res.json())
    .then(repos => {
      let totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const githubEl = document.getElementById("github-counter");

      // Attempt to fetch polygnn repo stars
      fetch("https://api.github.com/repos/Ramprasad-Group/polygnn")
        .then(res => {
          if (!res.ok) throw new Error("Polygnn repo not found");
          return res.json();
        })
        .then(polygnnRepo => {
          // Add stars if polygnn isn't already in the user's repo list
          if (!repos.some(repo => repo.full_name === polygnnRepo.full_name)) {
            totalStars += polygnnRepo.stargazers_count;
          }
        })
        .catch(err => {
          console.warn("Could not add Polygnn stars, showing base stars only:", err);
        })
        .finally(() => {
          // Finalize counter with whatever stars we successfully gathered
          if (githubEl) {
            animateCounter(githubEl, 0, totalStars, 2000);
          }
        });
    })
    .catch(err => console.error("Error loading GitHub repos:", err));

  // 3. Citations from google_scholar.json
  fetch("google_scholar.json")
    .then(res => res.json())
    .then(data => {
      const citationsEl = document.getElementById("citations-counter");
      if (citationsEl) animateCounter(citationsEl, 0, data.total_citations, 2000);
    })
    .catch(err => console.error("Error loading Google Scholar stats:", err));

  // 4. YouTube views
  fetch("yt/youtube-stats.json")
    .then(res => res.json())
    .then(data => {
      const youtubeEl = document.getElementById("youtube-counter");
      if (youtubeEl) animateCounter(youtubeEl, 0, data.total_views, 2000);
    })
    .catch(err => console.error("Error loading YouTube stats:", err));
}

// Wait until the counter elements are in the DOM, then update them
function initializeCounters() {
  const elements = ["linkedin-counter", "github-counter", "citations-counter", "youtube-counter"];
  const allFound = elements.every(id => document.getElementById(id));
  
  if (!allFound) {
    setTimeout(initializeCounters, 100);
    return;
  }
  updateCountersFromAPI();
}

document.addEventListener("DOMContentLoaded", initializeCounters);