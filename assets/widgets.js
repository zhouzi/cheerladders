(function() {
  'use strict';

  var widgets = {
    website: {
      name: 'Visit our website',
      params: {
        url: 'What is the project\'s official website url?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a href="' + params.url + '" target="_blank">Visit our website</a>';
      },
    },
    followTwitter: {
      name: 'Follow on Twitter',
      params: {
        handle: 'What is your Twitter handle?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a href="https://twitter.com/' + params.handle + '" target="_blank">Follow us on Twitter</a>';
      },
    },
    tweet: {
      name: 'Share on Twitter',
      params: {
        content: 'What\'s the tweet\'s content?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a href="https://twitter.com/intent/tweet?source=webclient&text=' + encodeURIComponent(params.content) + '" target="_blank">Tweet</a>';
      },
    },
  };

  if (typeof module === 'undefined') {
    window.widgets = widgets;
  } else {
    module.exports = widgets;
  }
})();
