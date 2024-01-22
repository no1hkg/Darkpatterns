document.addEventListener('DOMContentLoaded', function() {
    var detectButton = document.getElementById('detectButton');
    var resultDiv = document.getElementById('result');
  
    detectButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var url = tabs[0].url;
        detectDarkPatterns(url);
      });
    });
  
    function detectDarkPatterns(url) {
      var apiUrl = 'http://127.0.0.1:5000/detect_dark_patterns';
  
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      })
      .then(response => response.json())
      .then(data => {
        displayResult(data.detected_patterns);
      })
      .catch(error => {
        console.error('Error detecting dark patterns:', error);
      });
    }
  
    function displayResult(detectedPatterns) {
      resultDiv.innerHTML = '';
  
      if (detectedPatterns.length > 0) {
        resultDiv.innerHTML = '<h2>Detected Dark Patterns:</h2>';
        detectedPatterns.forEach(pattern => {
          var patternDiv = document.createElement('div');
          patternDiv.innerHTML = `<p>Text: ${pattern[0]}, Pattern Category: ${pattern[1]}</p>`;
          resultDiv.appendChild(patternDiv);
        });
      } else {
        resultDiv.innerHTML = '<p>No dark patterns detected.</p>';
      }
    }
  });
  