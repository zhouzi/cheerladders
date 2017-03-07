(function() {
  'use strict';

  var loadTwitterWidget = once(function() {
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }(document, "script", "twitter-wjs"));
  });

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
        wrapper.innerHTML = '<a class="twitter-follow-button" href="https://twitter.com/' + params.handle + '" target="_blank">Follow @' + params.handle + '</a>';
        loadTwitterWidget();
      },
    },
    tweet: {
      name: 'Share on Twitter',
      params: {
        content: 'What\'s the tweet\'s content?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a class="twitter-share-button" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(params.content) + '" target="_blank">Tweet</a>';
        loadTwitterWidget();
      },
    },
  };

  function once(fn) {
    var called = false;

    return function() {
      if (!called) {
        called = true;
        return fn.apply(null, arguments);
      }
    };
  }

  if (typeof module === 'undefined') {
    window.widgets = widgets;
  } else {
    module.exports = widgets;
  }
})();
