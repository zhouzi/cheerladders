const _ = require('lodash');
const router = require('express').Router();
const Project = require('../models/project');

function isValidWidget(widget) {
  if (widget == null) {
    return false;
  }

  return (
       _.isString(widget.name)
    && _.isObject(widget.params)
    && _.every(_.values(widget.params), _.isString)
  );
}

function isValidProject(project) {
  if (project == null) {
    return false;
  }

  return (
       _.isString(project.name)
    && _.isString(project.slogan)
    && _.isArray(project.widgets)
    && _.every(project.widgets, isValidWidget)
  );
}

function getProjectPublicProps(project) {
  return _.pick(project, [
    'slug',
    'name',
    'slogan',
    'token',
    'widgets',
  ]);
}

router.post('/', (req, res) => {
  const project = _.pick(req.body, [
    'name',
    'slogan',
    'widgets',
  ]);

  if (!isValidProject(project)) {
    res.status(400);
    res.json({
      err: 'non-compliant data',
    });
    return;
  }

  new Project(project)
    .save()
    .then(project => res.json(getProjectPublicProps(project)))
    .catch((err) => {
      res.status(500);
      res.json({
        err: err.message,
      });
    });
});

router.post('/:slug/widget', (req, res) => {
  const widget = _.pick(req.body, [
    'name',
    'params',
  ]);

  if (!isValidWidget(widget)) {
    res.status(400);
    res.json({
      err: 'non-compliant data',
    });
    return;
  }

  Project
    .findOne({ slug: req.params.slug, token: req.body.projectToken })
    .then((project) => {
      if (project == null) {
        throw new Error('not found');
      }

      return project;
    })
    .then((project) => {
      project.widgets.push(widget);
      return project.save();
    })
    .then(project => res.json(getProjectPublicProps(project)))
    .catch((err) => {
      res.status(500);
      res.json({
        err: err.message,
      });
    });
});

module.exports = router;
