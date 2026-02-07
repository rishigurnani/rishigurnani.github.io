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
      element.innerText = Math.round(end); // Ensure the final value is exact
    }
  }
  requestAnimationFrame(update);
}

// Function to update all counters from the API and JSON files
function updateCountersFromAPI() {
  // 1. LinkedIn followers from linkedin/stats.json
  fetch("linkedin/stats.json")
    .then(res => res.json())
    .then(data => {
      const linkedinFollowers = data.followers || 0;
      const linkedinEl = document.getElementById("linkedin-counter");
      if (linkedinEl) {
        animateCounter(linkedinEl, 0, linkedinFollowers, 2000);
      }
    })
    .catch(err => console.error("Error loading LinkedIn stats:", err));

  // 2. GitHub stars: sum stars from profile repos and add polygnn repo stars
  const userReposPromise = fetch("https://api.github.com/users/rishigurnani/repos?per_page=100").then(res => res.json());
  const polygnnRepoPromise = fetch("https://api.github.com/repos/Ramprasad-Group/polygnn").then(res => res.json());

  Promise.all([userReposPromise, polygnnRepoPromise])
    .then(([repos, polygnnRepo]) => {
      // Safety check: if GitHub API rate limits us, these won't be arrays/objects
      if (!Array.isArray(repos)) {
        console.error("GitHub API error or rate limit reached:", repos);
        return;
      }

      let totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      // Check if the polygnn repo is valid and not already in the list
      if (polygnnRepo && polygnnRepo.stargazers_count !== undefined) {
        if (!repos.some(repo => repo.full_name === polygnnRepo.full_name)) {
          totalStars += polygnnRepo.stargazers_count;
        }
      }

      const githubEl = document.getElementById("github-counter");
      if (githubEl && !isNaN(totalStars)) {
        animateCounter(githubEl, 0, totalStars, 2000);
      }
    })
    .catch(err => console.error("Error fetching GitHub data:", err));

  // 3. Citations from google_scholar.json
  fetch("google_scholar.json")
    .then(res => res.json())
    .then(data => {
      const totalCitations = data.total_citations || 0;
      const citationsEl = document.getElementById("citations-counter");
      if (citationsEl) {
        animateCounter(citationsEl, 0, totalCitations, 2000);
      }
    })
    .catch(err => console.error("Error loading Google Scholar stats:", err));

  // 4. YouTube views from yt/youtube-stats.json
  fetch("yt/youtube-stats.json")
    .then(res => res.json())
    .then(data => {
      const totalViews = data.total_views || 0;
      const youtubeEl = document.getElementById("youtube-counter");
      if (youtubeEl) {
        animateCounter(youtubeEl, 0, totalViews, 2000);
      }
    })
    .catch(err => console.error("Error loading YouTube stats:", err));
}

// Wait until the counter elements are in the DOM, then update them
function initializeCounters() {
  const linkedinEl = document.getElementById("linkedin-counter");
  const githubEl = document.getElementById("github-counter");
  const citationsEl = document.getElementById("citations-counter");
  const youtubeEl = document.getElementById("youtube-counter");

  if (!linkedinEl || !githubEl || !citationsEl || !youtubeEl) {
    // If elements aren't there yet (e.g. partials still loading), retry
    setTimeout(initializeCounters, 100);
    return;
  }
  updateCountersFromAPI();
}

document.addEventListener("DOMContentLoaded", function() {
  initializeCounters();
});