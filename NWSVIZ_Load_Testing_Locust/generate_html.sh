#!/bin/bash

PANDOC="$HOME/mambaforge/envs/nwsviz-load-testing/bin/pandoc"

echo "Generating HTML reports..."
echo ""

"$PANDOC" EXECUTIVE_STAKEHOLDER_REPORT.md \
    -o EXECUTIVE_STAKEHOLDER_REPORT.html \
    --standalone \
    --toc \
    --toc-depth=2 \
    --metadata title="EDR API Performance & Scalability Report"

if [ $? -eq 0 ]; then
    echo "✓ Created EXECUTIVE_STAKEHOLDER_REPORT.html"
else
    echo "✗ Failed to create EXECUTIVE_STAKEHOLDER_REPORT.html"
fi

"$PANDOC" COMPREHENSIVE_PERFORMANCE_REPORT.md \
    -o COMPREHENSIVE_PERFORMANCE_REPORT.html \
    --standalone \
    --toc \
    --toc-depth=2 \
    --metadata title="EDR API Load Testing - Comprehensive Performance Report"

if [ $? -eq 0 ]; then
    echo "✓ Created COMPREHENSIVE_PERFORMANCE_REPORT.html"
else
    echo "✗ Failed to create COMPREHENSIVE_PERFORMANCE_REPORT.html"
fi

echo ""
echo "HTML reports generated. Open in browser and use Print > Save as PDF"
ls -lh *.html 2>/dev/null | grep -E "(EXECUTIVE|COMPREHENSIVE)"
