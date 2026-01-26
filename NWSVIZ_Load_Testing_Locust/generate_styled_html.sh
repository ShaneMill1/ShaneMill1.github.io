#!/bin/bash

PANDOC="$HOME/mambaforge/envs/nwsviz-load-testing/bin/pandoc"

echo "Generating styled HTML reports..."
echo ""

# Executive Report with custom CSS
"$PANDOC" EXECUTIVE_STAKEHOLDER_REPORT.md \
    -o EXECUTIVE_STAKEHOLDER_REPORT.html \
    --standalone \
    --toc \
    --toc-depth=2 \
    --metadata title="EDR API Performance & Scalability Report" \
    --css=<(cat <<'EOF'
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: 1.6;
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    color: #24292e;
}
h1 { color: #0366d6; border-bottom: 3px solid #0366d6; padding-bottom: 10px; }
h2 { color: #0366d6; margin-top: 40px; border-bottom: 2px solid #e1e4e8; padding-bottom: 8px; }
h3 { color: #24292e; margin-top: 24px; }
table { border-collapse: collapse; width: 100%; margin: 20px 0; }
th { background: #0366d6; color: white; padding: 12px; text-align: left; }
td { padding: 10px; border-bottom: 1px solid #e1e4e8; }
tr:hover { background: #f6f8fa; }
code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
blockquote { border-left: 4px solid #0366d6; padding-left: 16px; color: #586069; }
#TOC { background: #f6f8fa; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
#TOC ul { list-style: none; }
#TOC a { color: #0366d6; text-decoration: none; }
#TOC a:hover { text-decoration: underline; }
@media print {
    body { max-width: 100%; margin: 0; }
    h1, h2, h3 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
}
EOF
)

if [ $? -eq 0 ]; then
    echo "✓ Created EXECUTIVE_STAKEHOLDER_REPORT.html"
else
    echo "✗ Failed to create EXECUTIVE_STAKEHOLDER_REPORT.html"
fi

# Comprehensive Report
"$PANDOC" COMPREHENSIVE_PERFORMANCE_REPORT.md \
    -o COMPREHENSIVE_PERFORMANCE_REPORT.html \
    --standalone \
    --toc \
    --toc-depth=2 \
    --metadata title="EDR API Load Testing - Comprehensive Performance Report" \
    --css=<(cat <<'EOF'
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: 1.6;
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    color: #24292e;
}
h1 { color: #0366d6; border-bottom: 3px solid #0366d6; padding-bottom: 10px; }
h2 { color: #0366d6; margin-top: 40px; border-bottom: 2px solid #e1e4e8; padding-bottom: 8px; }
h3 { color: #24292e; margin-top: 24px; }
table { border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 14px; }
th { background: #0366d6; color: white; padding: 12px; text-align: left; }
td { padding: 10px; border-bottom: 1px solid #e1e4e8; }
tr:hover { background: #f6f8fa; }
code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
#TOC { background: #f6f8fa; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
#TOC ul { list-style: none; }
#TOC a { color: #0366d6; text-decoration: none; }
#TOC a:hover { text-decoration: underline; }
@media print {
    body { max-width: 100%; margin: 0; }
    h1, h2, h3 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
}
EOF
)

if [ $? -eq 0 ]; then
    echo "✓ Created COMPREHENSIVE_PERFORMANCE_REPORT.html"
else
    echo "✗ Failed to create COMPREHENSIVE_PERFORMANCE_REPORT.html"
fi

echo ""
echo "HTML reports generated!"
echo "Open in browser and use: File > Print > Save as PDF"
ls -lh *REPORT.html 2>/dev/null
