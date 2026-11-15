# My Website!

## Notes to self
- To update the citations JSON, visit http://cse.bth.se/~fer/googlescholar-api/googlescholar.php?user=C2Leh-oAAAAJ&hl=en to view the latest stats, then copy, paste, and commit.
    - Edit 11/15/26: I discovered the site above no longer works. Instead, go here and copying the output: `https://serpapi.com/search.json?author_id=C2Leh-oAAAAJ&engine=google_scholar_author&hl=en&api_key=<INSERT API KEY HERE>`
    - Visit https://serpapi.com/dashboard to find the api key. Hint, it starts with `5a`.
- To test the site on a local server, run `python3.9 -m http.server 8000`
- To run repomix and copy the output to clipboard, go to the project root and type `repomix && cat repomix-output.txt | pbcopy`
- (No longer preferred) To generate the resume PDF, run `cd resume && python3.9 generate_resume.py && cd ../`

## Testing mobile version
Open your website in Chrome using `python3.9 -m http.server 8000`.

Right-click anywhere and select `Inspect`. In the top-left corner of the Inspector panel, click the `Device Toolbar` icon (it looks like a tiny phone over a tablet).

At the top of your browser window, a new bar will appear. You can:
Select a specific device (e.g., iPhone 14 Pro or Pixel 7) and change the Orientation (Portrait vs. Landscape).

## Linting
Copy and paste the following commands into terminal
```
npx eslint . --fix
npx stylelint "**/*.css" --fix
npx htmlhint "**/*.html"
autopep8 --in-place --aggressive --aggressive -r .
```
