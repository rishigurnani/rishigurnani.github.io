// js/load-partials.js

const partials = [
  { selector: '#navbar-placeholder', url: 'partials/navbar.html' },
  { selector: '#hero-placeholder', url: 'partials/hero.html' },
  { selector: '#main-content-placeholder', url: 'partials/main-content.html' },
  { selector: '#footer-placeholder', url: 'partials/footer.html' }
];

function fetchGithubStats() {
  // Fetch GitHub user data for rishigurnani
  fetch('https://api.github.com/users/rishigurnani')
    .then(response => response.json())
    .then(userData => {
      // Fetch rishigurnani's repositories
      fetch('https://api.github.com/users/rishigurnani/repos?per_page=100')
        .then(response => response.json())
        .then(reposData => {
          // Fetch the additional repo from Ramprasad-Group/polygnn
          fetch('https://api.github.com/repos/Ramprasad-Group/polygnn')
            .then(response => response.json())
            .then(additionalRepo => {
              // If the additional repo isn't already in reposData, add it
              if (!reposData.some(repo => repo.full_name === additionalRepo.full_name)) {
                reposData.push(additionalRepo);
              }
              // Sort all repositories by star count (highest first)
              reposData.sort((a, b) => b.stargazers_count - a.stargazers_count);
              const popularRepo = reposData[0];
              
              // Build the HTML with GitHub stats
              const statsHtml = `
                <p><strong>Total Public Repos:</strong> ${userData.public_repos}</p>
                <p><strong>Followers:</strong> ${userData.followers}</p>
                <p><strong>Most Popular Repo:</strong> 
                  <a href="${popularRepo.html_url}" target="_blank" style="color:#ffd700;">
                    ${popularRepo.name}
                  </a> (${popularRepo.stargazers_count} ★)
                </p>
              `;
              document.getElementById('github-stats').innerHTML = statsHtml;
            })
            .catch(err => {
              console.error("Error fetching additional repo:", err);
              // Even if the additional repo fails, proceed with rishigurnani's repos.
              reposData.sort((a, b) => b.stargazers_count - a.stargazers_count);
              const popularRepo = reposData[0];
              const statsHtml = `
                <p><strong>Total Public Repos:</strong> ${userData.public_repos}</p>
                <p><strong>Followers:</strong> ${userData.followers}</p>
                <p><strong>Most Popular Repo:</strong> 
                  <a href="${popularRepo.html_url}" target="_blank" style="color:#ffd700;">
                    ${popularRepo.name}
                  </a> (${popularRepo.stargazers_count} ★)
                </p>
              `;
              document.getElementById('github-stats').innerHTML = statsHtml;
            });
        })
        .catch(err => {
          document.getElementById('github-stats').innerHTML = '<p>Error loading repositories.</p>';
          console.error(err);
        });
    })
    .catch(err => {
      document.getElementById('github-stats').innerHTML = '<p>Error loading GitHub data.</p>';
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  let loadedCount = 0;
  const totalPartials = partials.length;

  function checkAllLoaded() {
    loadedCount++;
    if (loadedCount === totalPartials) {
      // Initialize other features
      if (typeof initAnimation === "function") {
        initAnimation();
      }
      if (typeof initCharts === "function") {
        initCharts();
      }
      
      // Initialize Slick slider if the slider element exists
      if ($('.dissertation-slider').length > 0) {
        $('.dissertation-slider').slick({
          autoplay: true,
          autoplaySpeed: 5000, // slide changes every 5 seconds
          dots: true,
          arrows: true,
          adaptiveHeight: true,
          fade: false,
          pauseOnHover: true
        });
      }
      
      // Call the GitHub API function to update the open source slide
      fetchGithubStats();
      
      // Scroll to URL hash if present
      if (window.location.hash) {
        const hashElement = document.querySelector(window.location.hash);
        if (hashElement) {
          hashElement.scrollIntoView({ behavior: "smooth" });
        }
      }
      
      // Update the main swiper
      if (document.querySelector('.main-video-swiper')) {
        var swiper = new Swiper('.main-video-swiper', {
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      
        // Attach click events to each sidebar item to jump to the corresponding slide
        document.querySelectorAll('.sidebar-item').forEach(function(item) {
          item.addEventListener('click', function() {
            var slideIndex = parseInt(this.getAttribute('data-slide'), 10);
            swiper.slideTo(slideIndex);
          });
        });
      }
      
    }
  }   

  partials.forEach(partial => {
    fetch(partial.url)
      .then(response => response.text())
      .then(html => {
        document.querySelector(partial.selector).innerHTML = html;
        checkAllLoaded();
      })
      .catch(error => console.error("Error loading " + partial.url + ":", error));
  });
});
