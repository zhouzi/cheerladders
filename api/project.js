const router = require('express').Router();
const Project = require('../models/project');

router.post('/', (req, res) => {
  new Project(req.body)
    .save()
    .then(project => res.json(project))
    .catch((err) => {
      res.status(500);
      res.json({
        err: err.message,
      });
    });
});

router.post('/:slug/widget', (req, res) => {
  Project
    .findOne({ slug: req.params.slug })
    .then((project) => {
      if (project == null) {
        throw new Error('not found');
      }

      return project;
    })
    .then((project) => {
      project.widgets.push(req.body);
      return project.save();
    })
    .then(project => res.json(project))
    .catch((err) => {
      res.status(500);
      res.json({
        err: err.message,
      });
    });
});

module.exports = router;
