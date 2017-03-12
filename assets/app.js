(function() {
  'use strict';

  function request(url, method, body, callback) {
    var req = new XMLHttpRequest();
    req.open(method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status === 200) {
        callback(JSON.parse(req.response));
      }
    };
    req.send(body);
  }

  function createProject(name, slogan, widgetName, params, callback) {
    request('/api/project', 'POST', JSON.stringify({
      name: name,
      slogan: slogan,
      widgets: [
        {
          name: widgetName,
          params: params,
        },
      ],
    }), callback);
  }

  function addWidget(projectSlug, projectToken, widgetName, widgetParams, callback) {
    request('/api/project/' + projectSlug + '/widget', 'POST', JSON.stringify({
      name: widgetName,
      params: widgetParams,
      projectToken: projectToken,
    }), callback);
  }

  function isValidToken(projectSlug, token, callback) {
    request('/api/project/' + projectSlug + '?token=' + token, 'GET', null, callback);
  }

  var widgetList = document.getElementById('widget-list');
  function renderWidget(widgetName, params) {
    var widgetItem = document.createElement('li');

    var widgetWrapper = document.createElement('div');
    widgetWrapper.classList.add('widget-wrapper');
    widgetItem.appendChild(widgetWrapper);

    var render = window.widgets[widgetName].render;
    var result = render(widgetWrapper, params);

    if (result !== false) {
      widgetList.appendChild(widgetItem);
    }
  }

  var widgetForm = document.getElementById('widget-form');
  var widgetSelect = widgetForm.querySelector('select');
  var widgetSubmitButton = widgetForm.querySelector('button');
  var shareLink = document.getElementById('share-link');

  function setLoadingState(isLoading) {
    if (isLoading) {
      widgetSubmitButton.setAttribute('disabled', 'disabled');
      widgetSubmitButton.textContent = 'Adding...';
    } else {
      widgetSubmitButton.removeAttribute('disabled');
      widgetSubmitButton.textContent = 'Add';
    }
  }

  function getParams(widgetId) {
    var widget = window.widgets[widgetId];
    var params = {};
    for (var key in widget.params) {
      if (!widget.params.hasOwnProperty(key)) {
        continue;
      }

      var value = prompt(widget.params[key]);

      // if user pressed "cancel"
      if (value == null) {
        return null;
      }

      params[key] = value;
    }

    return params;
  }

  widgetForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var widgetId = widgetSelect.value;
    if (!widgetId) {
      return;
    }

    var widgetParams;

    var nameElement = document.getElementById('project-name');
    var sloganElement = document.getElementById('project-slogan');
    if (nameElement && sloganElement) {
      var name = nameElement.textContent;
      var slogan = sloganElement.textContent;

      if (!confirm('Are you sure you want to create a new page named "' + name + '" with the slogan "' + slogan + '"?')) {
        return;
      }

      widgetParams = getParams(widgetId);
      if (widgetParams == null) {
        return;
      }

      nameElement.parentElement.textContent = name;
      sloganElement.parentElement.textContent = slogan;

      setLoadingState(true);

      createProject(nameElement.textContent, sloganElement.textContent, widgetId, widgetParams, function(project) {
        window.projectSlug = project.slug;
        window.localStorage.setItem(project.slug, project.token);

        history.replaceState({}, document.title, '/support/' + project.slug);

        renderWidget(widgetId, widgetParams);
        updateShareLinkUrl();

        setLoadingState(false);
      });
    } else {
      widgetParams = getParams(widgetId);
      if (widgetParams == null) {
        return;
      }

      setLoadingState(true);

      addWidget(window.projectSlug, window.localStorage.getItem(window.projectSlug), widgetId, widgetParams, function() {
        renderWidget(widgetId, widgetParams);
        setLoadingState(false);
      });
    }
  });

  function updateShareLinkUrl() {
    var shareUrl = '/support/' + window.projectSlug + '?token=' + window.localStorage.getItem(window.projectSlug);
    var shareAnchor = shareLink.querySelector('a');

    shareAnchor.setAttribute('href', shareUrl);

    // this is a "hack" to prepend the current environment's domain
    shareAnchor.textContent = shareAnchor.href;

    shareLink.style.display = '';
  }

  for (var id in window.widgets) {
    if (!window.widgets.hasOwnProperty(id)) {
      continue;
    }

    var option = document.createElement('option');
    option.value = id;
    option.textContent = window.widgets[id].name;

    widgetSelect.appendChild(option);
  }

  if (window.projectWidgets) {
    window.projectWidgets.forEach(function(widget) {
      renderWidget(widget.name, widget.params);
    });
  }

  var token = location.search.match(/token=([A-Za-z0-9_-]+)/);
  if (token != null) {
    history.replaceState({}, document.title, '/support/' + window.projectSlug);
    window.localStorage.setItem(window.projectSlug, token[1]);
  }

  var projectToken = window.localStorage.getItem(window.projectSlug);
  if (projectToken != null) {
    isValidToken(window.projectSlug, projectToken, function() {
      document.getElementById('widget-form-container').style.display = '';
      updateShareLinkUrl();
    });
  }
})();
