# Peek OpenAI Token Extension

Chrome extension to quickly grab your OpenAI session token for use with [Peek](https://apps.apple.com/gb/app/peek-ai-api-monitoring/id6447682119).

![Peek Token Extension](peek.webp)

## Installation

1. Download the latest release from [Releases](../../releases)
2. Unzip the file
3. Open Chrome and go to `chrome://extensions`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder

## Usage

1. Go to [OpenAI](https://platform.openai.com/usage)
2. Wait for full page to load
3. Click the Peek extension icon
4. Your token will be copied to clipboard

## Security

- This extension only accesses platform.openai.com
- Token is copied to clipboard, securely stored in session storage
- Code is open source and can be reviewed
