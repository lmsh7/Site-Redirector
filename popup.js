let rules = [];

function createRuleElement(rule, index) {
    const ruleElement = document.createElement('div');
    ruleElement.className = 'rule';
    ruleElement.innerHTML = `
        <div class="form-group">
            <label for="sourceUrl-${index}">Source URI Pattern:</label>
            <input type="text" id="sourceUrl-${index}" placeholder="e.g., *://example.com/* or file://*" value="${rule.sourceUrl || ''}">
        </div>
        <div class="form-group">
            <label for="targetUrl-${index}">Target URI:</label>
            <input type="text" id="targetUrl-${index}" placeholder="e.g., https://en.wikipedia.org or file:///C:/example.txt" value="${rule.targetUrl || ''}">
        </div>
        <div class="form-group">
            <label for="probability-${index}">Redirect Probability (%):</label>
            <input type="number" id="probability-${index}" min="0" max="100" value="${rule.probability || 80}">
        </div>
        <button type="button" class="remove-rule" data-index="${index}">Remove Rule</button>
    `;
    return ruleElement;
}

function addRule(rule = {}) {
    const index = rules.length;
    rules.push(rule);
    const ruleElement = createRuleElement(rule, index);
    document.getElementById('rules-container').appendChild(ruleElement);

    ruleElement.querySelector('.remove-rule').addEventListener('click', function() {
        removeRule(this.getAttribute('data-index'));
    });
}

function removeRule(index) {
    rules.splice(index, 1);
    renderRules();
}

function renderRules() {
    const container = document.getElementById('rules-container');
    container.innerHTML = '';
    rules.forEach((rule, index) => {
        container.appendChild(createRuleElement(rule, index));
    });

    document.querySelectorAll('.remove-rule').forEach(button => {
        button.addEventListener('click', function() {
            removeRule(this.getAttribute('data-index'));
        });
    });
}

function save_options(e) {
    e.preventDefault();
    rules = rules.map((rule, index) => ({
        sourceUrl: document.getElementById(`sourceUrl-${index}`).value,
        targetUrl: document.getElementById(`targetUrl-${index}`).value,
        probability: document.getElementById(`probability-${index}`).value
    }));

    chrome.storage.sync.set({ rules: rules }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        status.className = 'success';
        setTimeout(function() {
            status.textContent = '';
            status.className = '';
        }, 3000);
    });
}

function restore_options() {
    chrome.storage.sync.get({ rules: [{ sourceUrl: '*://example.com/*', targetUrl: 'https://en.wikipedia.org/wiki/Main_Page', probability: 80 }] }, function(items) {
        rules = items.rules;
        renderRules();
    });
}

function addTestUrlField() {
    const testUrlField = document.createElement('div');
    testUrlField.innerHTML = `
        <h2>Test URL Matching</h2>
        <input type="text" id="test-url" placeholder="Enter a URL to test">
        <button id="test-url-button">Test</button>
        <div id="test-results"></div>
    `;
    document.body.appendChild(testUrlField);

    document.getElementById('test-url-button').addEventListener('click', testUrlMatching);
}

function testUrlMatching() {
    const testUrl = document.getElementById('test-url').value;
    const resultsDiv = document.getElementById('test-results');
    resultsDiv.innerHTML = 'Testing...';

    if (!testUrl) {
        resultsDiv.innerHTML = 'Please enter a URL to test.';
        return;
    }

    chrome.runtime.sendMessage({action: "testUrlMatch", url: testUrl, rules: rules}, function(response) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resultsDiv.innerHTML = 'An error occurred while testing. Please check the console for details.';
            return;
        }

        if (!response || !response.results) {
            resultsDiv.innerHTML = 'No response received from the background script.';
            return;
        }

        let resultsHtml = '<ul>';
        response.results.forEach((result, index) => {
            resultsHtml += `<li>Rule ${index + 1}: ${result ? 'Match' : 'No match'}</li>`;
        });
        resultsHtml += '</ul>';
        resultsDiv.innerHTML = resultsHtml;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup DOM loaded');
    restore_options();
    document.getElementById('test-url-button').addEventListener('click', testUrlMatching);
});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('options-form').addEventListener('submit', save_options);
document.getElementById('add-rule').addEventListener('click', () => addRule());