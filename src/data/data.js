const qs = require('qs');

function form(testURL) {
    return qs.stringify({
      op: 'checkfiles',
      list: testURL, 
      process: 'Check URLs',
    });
  }
  
  module.exports = form;
  