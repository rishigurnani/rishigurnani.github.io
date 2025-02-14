#!/usr/bin/env python3
import markdown
from bs4 import BeautifulSoup
from weasyprint import HTML

def group_resume_sections(html):
    """
    Groups consecutive elements starting from an <h2> heading into a container
    with "page-break-inside: avoid" so that each major section isn't split across pages.
    """
    soup = BeautifulSoup(html, 'html.parser')
    container = soup.body if soup.body else soup
    new_container = soup.new_tag('div')
    current_section = None

    for child in list(container.contents):
        if child.name == 'h2':
            # Start a new section container with black borders.
            current_section = soup.new_tag('div', **{"class": "page-section"})
            current_section['style'] = "page-break-inside: avoid; margin-bottom: 20px;"
            new_container.append(current_section)
            # Move the <h2> element into the new section.
            current_section.append(child.extract())
        else:
            if current_section is not None:
                current_section.append(child.extract())
            else:
                new_container.append(child.extract())
    return str(new_container)

def main():
    # Read the Markdown file.
    with open("resume.md", "r", encoding="utf-8") as f:
        md_content = f.read()

    # Convert Markdown to HTML.
    html_content = markdown.markdown(md_content, extensions=['extra'])
    
    # Group resume sections so that each major section stays together.
    grouped_html = group_resume_sections(html_content)

    # Build the final HTML document with inline CSS.
    # All dividing lines (headings, borders) are black.
    # Links use a vibrant accent color (#e63946) that changes on hover.
    final_html = f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Resume</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      body {{
        background: #ffffff;
        font-family: 'Montserrat', sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 40px;
      }}
      h1 {{
        font-size: 32pt;
        margin-bottom: 20px;
        text-transform: uppercase;
        color: #222;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
      }}
      h2 {{
        font-size: 18pt;
        margin-bottom: 10px;
        text-transform: uppercase;
        color: #222;
        border-bottom: 2px solid #000;
        padding-bottom: 5px;
      }}
      h3 {{
        font-size: 14pt;
        margin-bottom: 8px;
        color: #222;
      }}
      p {{
        margin: 0 0 10px 0;
      }}
      ul, ol {{
        margin: 0 0 10px 20px;
        padding-left: 20px;
      }}
      li {{
        margin-bottom: 5px;
      }}
      .page-section {{
        page-break-inside: avoid;
        margin-bottom: 20px;
      }}
      /* Sexy links: vibrant accent color that isn’t black */
      a {{
        color: #e63946;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: color 0.3s ease, border-bottom 0.3s ease;
      }}
      a:hover {{
        color: #b5172e;
        border-bottom: 1px solid #b5172e;
      }}
      mark {{
        background-color: #ffeb3b;
        color: #333;
        padding: 0 2px;
      }}
      pre, code {{
        font-family: 'Courier New', monospace;
        background-color: #f1f1f1;
        padding: 2px 4px;
        border-radius: 4px;
      }}
      pre {{
        padding: 10px;
        overflow: auto;
      }}
    </style>
  </head>
  <body>
    {grouped_html}
  </body>
</html>
"""

    # Convert the HTML to a PDF using WeasyPrint.
    HTML(string=final_html).write_pdf("resume.pdf")
    print("Generated resume.pdf successfully.")

if __name__ == "__main__":
    main()
