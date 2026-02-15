# My Website!

## Notes to self
- To update the citations JSON, visit http://cse.bth.se/~fer/googlescholar-api/googlescholar.php?user=C2Leh-oAAAAJ&hl=en to view the latest stats, then copy, paste, and commit.
- To test the site on a local server, run `python3.9 -m http.server 8000`
- To run repomix and copy the output to clipboard, go to the project root and type `repomix && cat repomix-output.txt | pbcopy`
- To generate the resume PDF, run `cd resume && python3.9 generate_resume.py && cd ../`

## Testing mobile version
Open your website in Chrome using `python3.9 -m http.server 8000`.

Right-click anywhere and select Inspect. In the top-left corner of the Inspector panel, click the Device Toolbar icon (it looks like a tiny phone over a tablet).

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
