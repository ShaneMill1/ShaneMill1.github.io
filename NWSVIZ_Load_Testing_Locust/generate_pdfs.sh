#!/bin/bash

# Use pandoc and pdflatex from conda environment
PANDOC="$HOME/mambaforge/envs/nwsviz-load-testing/bin/pandoc"
PDFLATEX="$HOME/mambaforge/envs/nwsviz-load-testing/bin/pdflatex"

# Check if pandoc exists
if [ ! -f "$PANDOC" ]; then
    echo "Error: pandoc not found at $PANDOC"
    exit 1
fi

if [ ! -f "$PDFLATEX" ]; then
    echo "Error: pdflatex not found at $PDFLATEX"
    exit 1
fi

echo "Using pandoc: $PANDOC"
echo "Using pdflatex: $PDFLATEX"
echo ""

# Convert Executive Report
echo "Converting EXECUTIVE_STAKEHOLDER_REPORT.md to PDF..."
PATH="$HOME/mambaforge/envs/nwsviz-load-testing/bin:$PATH" "$PANDOC" EXECUTIVE_STAKEHOLDER_REPORT.md \
    -o EXECUTIVE_STAKEHOLDER_REPORT.pdf \
    --pdf-engine=tectonic \
    -V geometry:margin=1in \
    -V fontsize=11pt \
    --toc \
    --toc-depth=2

if [ $? -eq 0 ]; then
    echo "✓ Created EXECUTIVE_STAKEHOLDER_REPORT.pdf"
else
    echo "✗ Failed to create EXECUTIVE_STAKEHOLDER_REPORT.pdf"
fi

# Convert Comprehensive Report
echo "Converting COMPREHENSIVE_PERFORMANCE_REPORT.md to PDF..."
PATH="$HOME/mambaforge/envs/nwsviz-load-testing/bin:$PATH" "$PANDOC" COMPREHENSIVE_PERFORMANCE_REPORT.md \
    -o COMPREHENSIVE_PERFORMANCE_REPORT.pdf \
    --pdf-engine=tectonic \
    -V geometry:margin=1in \
    -V fontsize=10pt \
    --toc \
    --toc-depth=2 \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Created COMPREHENSIVE_PERFORMANCE_REPORT.pdf"
else
    echo "✗ Failed to create COMPREHENSIVE_PERFORMANCE_REPORT.pdf"
fi

echo ""
echo "PDF generation complete!"
ls -lh *.pdf 2>/dev/null || echo "No PDFs were created. Check pandoc installation."
