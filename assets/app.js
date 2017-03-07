(function() {
  'use strict';

  function createProject(name, slogan, widgetName, params, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', '/api/project');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status === 200) {
        callback(JSON.parse(req.response));
      }
    };
    req.send(JSON.stringify({
      name: name,
      slogan: slogan,
      widgets: [
        {
          name: widgetName,
          params: params,
        },
      ],
    }));
  }

  function addWidget(projectSlug, widgetName, widgetParams, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', '/api/project/' + projectSlug + '/widget');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status === 200) {
        callback(JSON.parse(req.response));
      }
    };
    req.send(JSON.stringify({
      name: widgetName,
      params: widgetParams,
    }));
  }

  var widgetList = document.getElementById('widget-list');
  function renderWidget(widgetName, params) {
    var widgetItem = document.createElement('li');

    var widgetCheckbox = document.createElement('input');
    widgetCheckbox.setAttribute('type', 'checkbox');
    widgetItem.appendChild(widgetCheckbox);

    var widgetWrapper = document.createElement('div');
    widgetWrapper.classList.add('widget-wrapper');
    widgetItem.appendChild(widgetWrapper);

    widgetList.appendChild(widgetItem);

    var render = window.widgets[widgetName].render;
    render(widgetWrapper, params);
  }

  var widgetForm = document.getElementById('widget-form');
  var widgetSelect = widgetForm.querySelector('select');
  var widgetSubmitButton = widgetForm.querySelector('button');

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
        history.replaceState({}, document.title, '/support/' + project.slug);

        setLoadingState(false);
      });
    } else {
      widgetParams = getParams(widgetId);
      if (widgetParams == null) {
        return;
      }

      setLoadingState(true);

      addWidget(window.projectSlug, widgetId, widgetParams, function() {
        setLoadingState(false);
      });
    }

    renderWidget(widgetId, widgetParams);
  });

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
})();
