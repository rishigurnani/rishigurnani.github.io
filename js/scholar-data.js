// Google Scholar data source.
// Set SCHOLAR_SOURCE to "cse_bth_se" or "serp" to pick the file + parser below.
const SCHOLAR_SOURCE = "serp";

// A parser turns a raw file into { total_citations, publications, citations_per_year }.
// publications: { title, authors, link, citations, year }.
const SCHOLAR_SOURCES = {
  // Already in the normalized shape, so the parser is the identity.
  cse_bth_se: { file: "gscholar/google_scholar_cse_bth_se.json", parse: data => data },
  // SerpApi "google_scholar_author" result: derive the shape from the profile.
  serp: { file: "gscholar/google_scholar_serp.json", parse: parseSerp },
};

function parseSerp(raw) {
  const publications = (raw.articles || []).map(a => ({
    title: a.title,
    authors: a.authors,
    link: a.link,
    citations: (a.cited_by && a.cited_by.value) || 0,
    year: a.year ? parseInt(a.year, 10) : 0,
  }));
  const table = (raw.cited_by && raw.cited_by.table) || [];
  const citationsRow = table.find(t => t.citations) || {};
  const total_citations = (citationsRow.citations && citationsRow.citations.all) || 0;
  const citations_per_year = {};
  ((raw.cited_by && raw.cited_by.graph) || []).forEach(g => {
    citations_per_year[g.year] = g.citations;
  });
  return { total_citations, publications, citations_per_year };
}

// Fetch the configured file and return the normalized scholar data.
function loadScholarData() {
  const src = SCHOLAR_SOURCES[SCHOLAR_SOURCE];
  return fetch(src.file).then(res => res.json()).then(src.parse);
}
