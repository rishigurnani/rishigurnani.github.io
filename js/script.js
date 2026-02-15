// 1. Change navbar background on scroll
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  if (navbar && window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else if (navbar) {
    navbar.classList.remove("scrolled");
  }
});

/**
 * Smart Video Logic: Ensures all fire background videos play 
 * only when they are actually in the viewer's gaze.
 */
function initializeVideoGazeLogic() {
  const fireVideos = document.querySelectorAll(".fire-video");
  if (fireVideos.length === 0) return;

  const observerOptions = { root: null, threshold: 0.1 };
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

  fireVideos.forEach(v => observer.observe(v));
}

/**
 * Fetches publication data and populates the UI.
 * Includes a retry loop to ensure the partial HTML has loaded.
 */
async function initPublicationsAndCharts() {
    const tableBody = document.querySelector("#publication-table-body");
    const chartCanvas = document.getElementById('citationsChart');

    // If elements aren't found yet (partial still loading), wait 100ms and try again
    if (!tableBody || !chartCanvas) {
        setTimeout(initPublicationsAndCharts, 100);
        return;
    }

    try {
        const response = await fetch("google_scholar.json");
        const data = await response.json();

        // 1. Update Sidebar Metrics
        const totalCitEl = document.getElementById("total-citations-val");
        const hIndexEl = document.getElementById("h-index-val");
        if(totalCitEl) totalCitEl.innerText = data.total_citations;
        // Note: h-index isn't in your JSON yet, so we keep the HTML value or add it to JSON later

        // 2. Populate Publication Table (Initial 6 rows)
        renderTableRows(data.publications.slice(0, 6));

        // 3. "Show More" Logic
        const showMoreBtn = document.getElementById("show-more-pub-btn");
        if (showMoreBtn) {
            showMoreBtn.addEventListener("click", () => {
                renderTableRows(data.publications); // Render all
                showMoreBtn.style.display = "none";  // Hide button
            });
        }

        // 4. Initialize the Chart
        renderChart(data.citations_per_year);

    } catch (err) {
        console.error("Error loading publications:", err);
    }
}

function renderTableRows(pubs) {
    const tableBody = document.querySelector("#publication-table-body");
    if (!tableBody) return;
    
    tableBody.innerHTML = pubs.map(pub => `
        <tr>
            <td class="pub-title">
                <a href="${pub.link || '#'}" target="_blank">${pub.title}</a>
                <br><small class="text-muted">${pub.authors}</small>
            </td>
            <td class="text-end font-weight-bold">${pub.citations}</td>
            <td class="text-end">${pub.year === 0 ? 'N/A' : pub.year}</td>
        </tr>
    `).join('');
}

function renderChart(chartData) {
    const ctx = document.getElementById('citationsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(chartData),
            datasets: [{
                label: 'Citations',
                data: Object.values(chartData),
                backgroundColor: '#3f51b533',
                borderColor: '#3f51b5',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// Start sequence
document.addEventListener("DOMContentLoaded", () => {
    initializeVideoGazeLogic();
    initPublicationsAndCharts();
});