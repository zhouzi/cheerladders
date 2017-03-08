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

  var loadGithubWidget = once(function() {
    document.head.appendChild(createScript('https://buttons.github.io/buttons.js'));
  });

  var loadFacebookWidget = once(function() {
    var fbRoot = document.createElement('div');
    fbRoot.setAttribute('id', 'fb-root');
    document.body.appendChild(fbRoot);

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
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
      name: 'Tweet',
      params: {
        content: 'What\'s the tweet\'s content?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a class="twitter-share-button" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(params.content) + '" target="_blank">Tweet</a>';
        loadTwitterWidget();
      },
    },
    productHunt: {
      name: 'Upvote on ProductHunt',
      params: {
        url: 'What\'s the url of the ProductHunt page?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a href="' + params.url + '" target="_blank">Upvote on ProductHunt</a>';
      },
    },
    medium: {
      name: 'Recommend on Medium',
      params: {
        url: 'What\'s the post\'s url on Medium?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a href="' + params.url + '" target="_blank">Recommend on Medium</a>';
      },
    },
    chromeWebStore: {
      name: 'Download Chrome extension',
      params: {
        itemId: 'What\'s the Chrome extension id? You can find it at the end of the Web Store\'s url.',
      },
      render: function(wrapper, params) {
        if (typeof chrome === 'undefined') {
          return false;
        }

        var url = 'https://chrome.google.com/webstore/detail/' + params.itemId;
        wrapper.innerHTML = '<a href="' + url + '" target="_blank">Download Chrome extension</a>';
      },
    },
    githubStar: {
      name: 'Star on GitHub',
      params: {
        user: 'What\'s the user name?',
        repo: 'What\'s the repository name?',
      },
      render: function(wrapper, params) {
        loadGithubWidget();
        wrapper.innerHTML = '<a class="github-button" href="https://github.com/' + params.user + '/' + params.repo + '" data-icon="octicon-star" data-style="mega" aria-label="Star ' + params.user + '/' + params.repo + ' on GitHub">Star</a>';
      },
    },
    facebookLike: {
      name: 'Like on Facebook',
      params: {
        url: 'What\'s the url of the page to like on Facebook?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<a href="' + params.url + '" target="_blank" class="fb-like" data-href="' + params.url + '" data-layout="button" data-action="like" data-size="small" data-show-faces="false" data-share="false">Like on Facebook</a>';
        loadFacebookWidget();
      },
    },
    facebookShare: {
      name: 'Share on Facebook',
      params: {
        url: 'What\'s the url of the page to share on Facebook?',
      },
      render: function(wrapper, params) {
        wrapper.innerHTML = '<div class="fb-share-button" data-href="' + params.url + '" data-layout="button" data-size="small" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(params.url) + '&amp;src=sdkpreparse">Share on Facebook</a></div>';
        loadFacebookWidget();
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

  function createScript(url) {
    var script = document.createElement('script');

    script.setAttribute('async', 'async');
    script.setAttribute('defer', 'defer');
    script.setAttribute('src', url);

    return script;
  }

  if (typeof module === 'undefined') {
    window.widgets = widgets;
  } else {
    module.exports = widgets;
  }
})();
