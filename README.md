# lib_ui

A CLI tool for creating versatile and modern UI components.

## Installation

```bash
npm install -g lib_ui
```

## Usage

```bash
lib_ui add <component-name>
```

### Examples

```bash
lib_ui add Header
lib_ui add Button
lib_ui add Card
```

## Troubleshooting

If you get a "command not found" error after installation, you may need to add npm's global bin directory to your PATH:

### For macOS/Linux:
```bash
# Add this to your ~/.zshrc or ~/.bashrc
export PATH="$(npm config get prefix)/bin:$PATH"
```

### For Windows:
The npm global bin directory is usually already in your PATH. If not, you can find it by running:
```bash
npm config get prefix
```

## Development

To install locally for development:
```bash
git clone <repository-url>
cd lib_ui
npm install
npm link
``` 