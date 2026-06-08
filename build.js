const fs = require('fs');
const path = require('path');

const inputHtmlPath = path.join(__dirname, 'index.html');
const inputCssPath = path.join(__dirname, 'style.css');
const inputJsPath = path.join(__dirname, 'script.js');
const outputHtmlPath = path.join(__dirname, 'output.html');

try {
    const htmlContent = fs.readFileSync(inputHtmlPath, 'utf8');
    const cssContent = fs.readFileSync(inputCssPath, 'utf8');
    const jsContent = fs.readFileSync(inputJsPath, 'utf8');

    // Inline CSS
    let finalHtml = htmlContent.replace(
        '    <!-- Styles will be inlined here by build.js -->',
        `<style>
${cssContent}
    </style>`
    );

    // Inline JavaScript
    finalHtml = finalHtml.replace(
        '    <!-- Scripts and talk data will be inlined here by build.js -->',
        `<script>
${jsContent}
    </script>`
    );

    fs.writeFileSync(outputHtmlPath, finalHtml, 'utf8');
    console.log(`Successfully compiled into a single file: ${outputHtmlPath}`);
} catch (error) {
    console.error('Error during compilation:', error);
}
