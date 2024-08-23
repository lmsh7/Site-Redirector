let redirectRules = [];

function loadOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      rules: [{ sourceUrl: '*://example.com/*', targetUrl: 'https://en.wikipedia.org/wiki/Main_Page', probability: 80 }]
    }, function (items) {
      redirectRules = items.rules;
      resolve();
    });
  });
}

function shouldRedirect(probability) {
  return Math.random() * 100 < probability;
}

function createUrlMatchPattern(pattern) {
  // 转义特殊字符，但保留 * 和 ?
  pattern = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');

  // 替换通配符
  pattern = pattern.replace(/\*/g, '.*');
  pattern = pattern.replace(/\?/g, '.');

  // 处理协议
  pattern = pattern.replace(/^(\.\*|https?|file|ftp):/, '($1):');

  // 确保模式匹配整个 URL
  if (!pattern.startsWith('^')) {
    pattern = '^' + pattern;
  }
  if (!pattern.endsWith('$')) {
    pattern = pattern + '$';
  }

  console.log('Created URL match pattern:', pattern);
  return new RegExp(pattern, 'i');  // 'i' 标志使匹配不区分大小写
}

function urlMatches(url, pattern) {
  const regex = createUrlMatchPattern(pattern);
  const result = regex.test(url);
  console.log(`Matching URL: ${url} against pattern: ${pattern}. Result: ${result}`);
  return result;
}


function handleLocalFilePath(path) {
  if (path.startsWith('/')) {
    return 'file://' + path;
  }
  if (path.startsWith('file://')) {
    return path;
  }
  if (/^[a-zA-Z]:\\/.test(path)) {
    return 'file:///' + path.replace(/\\/g, '/');
  }
  return path;
}


chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
  await loadOptions();
  console.log('Navigating to:', details.url);
  for (let rule of redirectRules) {
    if (urlMatches(details.url, rule.sourceUrl)) {
      console.log('URL matches rule:', rule);
      if (shouldRedirect(rule.probability)) {
        const targetUrl = handleLocalFilePath(rule.targetUrl);
        console.log('Redirecting to:', targetUrl);
        chrome.tabs.update(details.tabId, { url: targetUrl });
        break;  // Stop after first matching rule
      } else {
        console.log('Not redirecting due to probability check');
      }
    }
  }
});


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === "testUrlMatch") {
      console.log('Received test request:', request);
      const results = request.rules.map(rule => urlMatches(request.url, rule.sourceUrl));
      console.log('Test results:', results);
      sendResponse({ results: results });
    }
    return true;  // 保持消息通道开放以进行异步响应
  }
);

// Listen for changes to the options
chrome.storage.onChanged.addListener(function (changes, namespace) {
  loadOptions();
});