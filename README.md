# Site Redirector

## Overview

Site Redirector is a powerful and flexible Chrome extension that allows you to set up custom redirection rules for web pages. With this extension, you can automatically redirect from one URL to another based on customizable patterns and probabilities.

## Features

- Set up multiple redirection rules
- Use wildcard patterns for flexible URL matching
- Set a probability for each redirection rule
- Support for local file paths
- Built-in testing tool for URL matching
- Easy-to-use popup interface for managing rules

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

### Adding a Redirection Rule

1. Click on the Site Redirector icon in your Chrome toolbar to open the popup interface.
2. Click the "Add Rule" button to create a new rule.
3. Fill in the following fields:
   - Source URI Pattern: The URL pattern to match (e.g., `*://example.com/*`)
   - Target URI: The URL to redirect to (e.g., `https://wikipedia.org`)
   - Redirect Probability: The likelihood of the redirect occurring (0-100%)
4. Click "Save All Rules" to apply your changes.

### Testing URL Matching

1. Open the popup interface by clicking the extension icon.
2. Scroll down to the "Test URL Matching" section.
3. Enter a URL in the input field.
4. Click "Test" to see which rules (if any) match the entered URL.

### Editing or Removing Rules

- To edit a rule, simply modify the fields in the popup interface and click "Save All Rules".
- To remove a rule, click the "Remove Rule" button next to the rule you want to delete.

## URL Pattern Syntax

- Use `*` to match any number of characters
- Use `?` to match a single character
- Examples:
  - `*://example.com/*` matches any HTTP or HTTPS URL on example.com
  - `file:///*.txt` matches any local .txt file
  - `https://?.example.com` matches https://a.example.com, https://b.example.com, etc.

## Local File Redirection

To redirect to a local file, use the following format for the Target URI:
- Windows: `file:///C:/path/to/file.html`
- macOS/Linux: `file:///path/to/file.html`

## Troubleshooting

If you encounter any issues:
1. Check the console in Chrome DevTools for error messages.
2. Ensure that your URL patterns are correctly formatted.
3. Try disabling and re-enabling the extension.
4. If problems persist, please open an issue on the GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.