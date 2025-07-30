const newman = require('newman');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  collection: './scripts/api-test-collection.json',
  environment: './scripts/environment.json',
  reporters: ['cli', 'json', 'html'],
  reporter: {
    json: {
      export: './test-results/results.json'
    },
    html: {
      export: './test-results/report.html'
    }
  },
  iterationCount: 1,
  delayRequest: 1000,
  timeout: 30000
};

// Create test-results directory if it doesn't exist
const resultsDir = './test-results';
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Run Newman tests
newman.run(config, function (err, summary) {
  if (err) {
    console.error('Error running tests:', err);
    process.exit(1);
  }

  console.log('Test execution completed!');
  console.log('Summary:', summary.run.stats);
  
  // Copy test results to docs for GitHub Pages
  const docsDir = './docs';
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Copy HTML report to docs
  if (fs.existsSync('./test-results/report.html')) {
    fs.copyFileSync('./test-results/report.html', './docs/index.html');
    console.log('Test report copied to docs/index.html');
  }

  // Copy JSON results to docs
  if (fs.existsSync('./test-results/results.json')) {
    fs.copyFileSync('./test-results/results.json', './docs/results.json');
    console.log('Test results copied to docs/results.json');
  }

  process.exit(summary.run.failures.length > 0 ? 1 : 0);
}); 




//===========Or Run Local File <automate_reports.sh> ===============
// #!/bin/bash

// # --- CONFIGURATION ---
// GITHUB_REPO_PATH="/Your/github/repo_path"  
// GITHUB_PAGES_URL="https://your_github.github.io/git_pages"
// SLACK_TOKEN="slack_bot_token"
// CHANNEL_ID="slack_channel_id"
// ENVIRONMENT="Staging"

// # --- 1. Generate Timestamp and Run Info ---
// TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
// RUN_TIME=$(date '+%Y-%m-%d %I:%M %p GMT+7')
// START_TIME=$(date +%s)

// # --- 2. Run Newman Collections ---
// #COLLECTIONS=("Infina-B2C_Realstake_API" "Infina-Finavi" "Infina-Kafi" "Infina-PVI")
// COLLECTIONS=("Infina-B2C_Realstake_API")
// REPORT_FILES=()
// CLI_LOG_FILES=()
// FAILURES_SUMMARY=""
// TOTAL_REQUESTS=0
// TOTAL_ASSERTIONS=0
// TOTAL_PASSED=0
// TOTAL_FAILED=0

// for COLLECTION in "${COLLECTIONS[@]}"; do
//   REPORT_NAME="${COLLECTION}_Dashboard_Report_${TIMESTAMP}.html"
//   CLI_OUTPUT="${COLLECTION}_cli_output_${TIMESTAMP}.txt"
  
//   echo "Running collection: ${COLLECTION}"
//   newman run "${COLLECTION}.postman_collection.json" \
//     --delay-request 1000 \
//     --reporters htmlextra,cli \
//     --reporter-htmlextra-export "reports/${REPORT_NAME}" \
//     --verbose > "${CLI_OUTPUT}"
//   REPORT_FILES+=("${REPORT_NAME}")
//   CLI_LOG_FILES+=("${CLI_OUTPUT}")

//   # Extract summary block (from ┌ to └)
//   SUMMARY=$(awk '/^┌/{flag=1} flag; /^└/{flag=0}' "${CLI_OUTPUT}")

//   # Parse test statistics from the table - extract numerical values
//   # More robust parsing that handles the table structure correctly
//   REQUESTS=$(echo "$SUMMARY" | grep 'requests' | sed 's/│/|/g' | awk -F'|' '{print $3}' | tr -d ' ' | grep -o '[0-9]\+')
  
//   # Get the assertions row and extract the executed number (3rd column)
//   ASSERTIONS=$(echo "$SUMMARY" | grep 'assertions' | sed 's/│/|/g' | awk -F'|' '{print $3}' | tr -d ' ' | grep -o '[0-9]\+')
  
//   # Get the assertions row and extract the failed number (4th column)
//   FAILED_ASSERTIONS=$(echo "$SUMMARY" | grep 'assertions' | sed 's/│/|/g' | awk -F'|' '{print $4}' | tr -d ' ' | grep -o '[0-9]\+')
  
//   # Alternative parsing method as backup
//   if [ -z "$REQUESTS" ] || [ -z "$ASSERTIONS" ] || [ -z "$FAILED_ASSERTIONS" ]; then
//     echo "Warning: Primary parsing failed, trying alternative method..."
//     # Try parsing with different approach
//     REQUESTS=$(echo "$SUMMARY" | grep 'requests' | sed 's/[^0-9]/ /g' | awk '{print $1}')
//     ASSERTIONS=$(echo "$SUMMARY" | grep 'assertions' | sed 's/[^0-9]/ /g' | awk '{print $1}')
//     FAILED_ASSERTIONS=$(echo "$SUMMARY" | grep 'assertions' | sed 's/[^0-9]/ /g' | awk '{print $2}')
//   fi
  
//   # If no numbers found, default to 0
//   if [ -z "$REQUESTS" ]; then REQUESTS=0; fi
//   if [ -z "$ASSERTIONS" ]; then ASSERTIONS=0; fi
//   if [ -z "$FAILED_ASSERTIONS" ]; then FAILED_ASSERTIONS=0; fi
  
//   PASSED_ASSERTIONS=$((ASSERTIONS - FAILED_ASSERTIONS))

//   # Accumulate totals
//   TOTAL_REQUESTS=$((TOTAL_REQUESTS + REQUESTS))
//   TOTAL_ASSERTIONS=$((TOTAL_ASSERTIONS + ASSERTIONS))
//   TOTAL_PASSED=$((TOTAL_PASSED + PASSED_ASSERTIONS))
//   TOTAL_FAILED=$((TOTAL_FAILED + FAILED_ASSERTIONS))

//   # Debug output
//   echo "Collection: ${COLLECTION}"
//   echo "Requests: ${REQUESTS}, Assertions: ${ASSERTIONS}, Passed: ${PASSED_ASSERTIONS}, Failed: ${FAILED_ASSERTIONS}"
//   echo "Table row for assertions:"
//   echo "$SUMMARY" | grep 'assertions'
//   echo "Parsed values - REQUESTS: '$REQUESTS', ASSERTIONS: '$ASSERTIONS', FAILED_ASSERTIONS: '$FAILED_ASSERTIONS'"

//   # If there are failed assertions, append to failures summary
//   if [ "$FAILED_ASSERTIONS" -gt 0 ]; then
//     STATUS="❌"
//     FAILURES_SUMMARY+="*API Test Report: ${COLLECTION}* ${STATUS}\n\
// \
// \`\`\`\n${SUMMARY}\n\`\`\`\n${STATUS} *${FAILED_ASSERTIONS} failed assertions*\n\n"
//   fi
// done

// # Calculate total duration
// END_TIME=$(date +%s)
// DURATION=$((END_TIME - START_TIME))
// DURATION_FORMATTED=$(printf '%dm %ds' $((DURATION/60)) $((DURATION%60)))

// # --- 3. Copy Reports and Log Files to GitHub Repo ---
// for REPORT in "${REPORT_FILES[@]}"; do
//   cp "reports/${REPORT}" "${GITHUB_REPO_PATH}/"
// done

// # Copy CLI log files to GitHub repo
// echo "Copying CLI log files to GitHub repo..."
// for LOG_FILE in "${CLI_LOG_FILES[@]}"; do
//   echo "Copying: $(basename "$LOG_FILE")"
//   cp "reports/${LOG_FILE}" "${GITHUB_REPO_PATH}/"
// done

// # --- 4. Commit and Push to GitHub Pages ---
// cd "${GITHUB_REPO_PATH}"
// git add *.html *.txt
// git commit -m "Add API Testing Dashboard Reports and CLI Logs for ${TIMESTAMP}"
// git push origin main  # or master, depending on your branch
// cd -  # Return to original directory

// # --- 5. Create Comprehensive Slack Report ---
// SLACK_REPORT="*🔍 Newman API Test Report*\n\
// *Environment:* \`${ENVIRONMENT}\`\n\
// *Triggered By:* \`Run local file <automate_reports.sh>\`\n\
// *Run Time:* \`${RUN_TIME}\`\n\
// *Duration:* \`${DURATION_FORMATTED}\`\n\
// \n\
// *🧪 Test Summary:*\n\
// • Total Requests: ${TOTAL_REQUESTS}\n\
// • Total Assertions: ${TOTAL_ASSERTIONS}\n\
// • ✅ Passed: ${TOTAL_PASSED}\n\
// • ❌ Failed: ${TOTAL_FAILED}\n\
// \n\
// *📦 Collection Testing Dashboard Reports:*\n"

// # Add links to all reports
// for REPORT in "${REPORT_FILES[@]}"; do
//   COLLECTION_NAME=$(echo "$REPORT" | sed 's/_Dashboard_Report_.*//')
//   SLACK_REPORT+="• <${GITHUB_PAGES_URL}/${REPORT}|${COLLECTION_NAME}>\n"
// done

// # Add links to CLI log files
// SLACK_REPORT+="\n*📋 CLI Log Files:*\n"
// for LOG_FILE in "${CLI_LOG_FILES[@]}"; do
//   COLLECTION_NAME=$(basename "$LOG_FILE" | sed 's/_cli_output_.*//')
//   LOG_FILENAME=$(basename "$LOG_FILE")
//   SLACK_REPORT+="• <${GITHUB_PAGES_URL}/${LOG_FILENAME}|${COLLECTION_NAME} CLI Logs>\n"
// done

// # Add failure details if any
// if [ -n "$FAILURES_SUMMARY" ]; then
//   SLACK_REPORT+="\n*🚨 Failure Details:*\n${FAILURES_SUMMARY}"
// fi

// # --- 6. Post Comprehensive Report to Slack ---
// # Escape newlines and quotes for JSON
// SLACK_REPORT_ESCAPED=$(echo "$SLACK_REPORT" | sed ':a;N;$!ba;s/\n/\\n/g' | sed 's/"/\\"/g')

// curl -X POST -H "Authorization: Bearer ${SLACK_TOKEN}" \
//      -H "Content-type: application/json" \
//      --data "{\"channel\": \"${CHANNEL_ID}\", \"text\": \"${SLACK_REPORT_ESCAPED}\"}" \
//      https://slack.com/api/chat.postMessage


// echo "Automation complete! Comprehensive report generated and shared with GitHub links to CLI logs." 