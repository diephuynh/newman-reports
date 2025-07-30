# QA Auto Infina B2C API Testing

This repository contains automated API testing for the B2C application using Newman/Postman collections.

## 🚀 Features

- **Automated API Testing** with Newman/Postman
- **GitHub Pages Integration** for test results display
- **Data File Management** (JSON, HTML, TXT)
- **CI/CD Ready** with npm scripts
- **Comprehensive Reporting** with HTML and JSON outputs

## 📁 Project Structure

```
qa-auto-infina-b2c-api/
├── data/                    # Data files (JSON, HTML, TXT)
│   ├── sample.json
│   ├── sample.html
│   └── sample.txt
├── docs/                    # GitHub Pages files
│   └── index.html
├── scripts/                 # Test scripts and configurations
│   ├── api-test-collection.json
│   ├── environment.json
│   │── run-tests.js
│   │── //automate_reports.sh
│   └── //${COLLECTION}.postman_collection.json
├── tests/                   # Additional test files
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/qa-auto-infina-b2c-api.git
   cd qa-auto-infina-b2c-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your API endpoints:**
   - Edit `scripts/environment.json` to set your actual API base URL
   - Update test credentials in the environment file

## 🧪 Running Tests

### Option 1: Using npm script
```bash
npm test
```

### Option 2: Using Newman directly
```bash
npm run test:newman
```

### Option 3: Manual Newman command
```bash
newman run scripts/api-test-collection.json \
  -e scripts/environment.json \
  --reporters cli,json,html \
  --reporter-json-export test-results/results.json \
  --reporter-html-export test-results/report.html
```

## 📊 Test Results

After running tests, results are available in:
- `test-results/results.json` - Detailed JSON results
- `test-results/report.html` - HTML report
- `docs/index.html` - GitHub Pages dashboard

## 🌐 GitHub Pages Setup

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/docs** folder
6. Click **Save**

### Step 2: Update Data Files

To add new data files:

1. **Add files to the `data/` directory:**
   ```bash
   # Example: Adding a new JSON file
   cp your-data.json data/
   
   # Example: Adding a new HTML file
   cp your-report.html data/
   ```

2. **Copy files to docs for GitHub Pages:**
   ```bash
   npm run docs
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add new data files"
   git push origin main
   ```

### Step 3: Access Your GitHub Pages

Your GitHub Pages will be available at:
`https://yourusername.github.io/qa-auto-infina-b2c-api/`

## 📝 Adding New Test Cases

### 1. Update Postman Collection

Edit `scripts/api-test-collection.json` to add new API endpoints:

```json
{
  "name": "New API Test",
  "request": {
    "method": "GET",
    "url": "{{base_url}}/new-endpoint"
  },
  "response": [],
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test(\"Status code is 200\", function () {",
          "    pm.response.to.have.status(200);",
          "});"
        ]
      }
    }
  ]
}
```

### 2. Update Environment Variables

Add new variables to `scripts/environment.json`:

```json
{
  "key": "new_variable",
  "value": "new_value",
  "type": "default",
  "enabled": true
}
```

## 🔧 Configuration

### Environment Variables

Key variables in `scripts/environment.json`:
- `base_url`: Your API base URL
- `auth_token`: Authentication token (auto-populated)
- `test_user_email`: Test user email
- `test_user_password`: Test user password

### Newman Configuration

Key settings in `scripts/run-tests.js`:
- `iterationCount`: Number of test iterations
- `delayRequest`: Delay between requests (ms)
- `timeout`: Request timeout (ms)

## 📈 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    - run: npm install
    - run: npm test
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
```

## 🐛 Troubleshooting

### Common Issues

1. **Newman not found:**
   ```bash
   npm install -g newman
   ```

2. **Permission errors:**
   ```bash
   sudo npm install -g newman
   ```

3. **Test failures:**
   - Check API endpoint availability
   - Verify environment variables
   - Review test collection syntax

### Debug Mode

Run tests with verbose output:
```bash
newman run scripts/api-test-collection.json -e scripts/environment.json --verbose
```

## 📚 Additional Resources

- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Postman Collection Format](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/exporting-data/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 