const path = require('path');
const config = require('./config');

const mongoose = require('mongoose');
const slugGenerator = require('mongoose-slug-generator');
mongoose.plugin(slugGenerator);
mongoose.connect(config.mongoUrl);

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.locals.trackingId = config.trackingId;

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
app.set('view engine', 'pug');

const staticDir = path.join(__dirname, 'assets');
app.use('/assets', express.static(staticDir));

const projectApi = require('./api/project');
app.use('/api/project', projectApi);

const widgets = require('./assets/widgets');
const Project = require('./models/project');
app.get('/', (req, res) => {
  Project
    .find()
    .limit(20)
    .sort({ createdAt: -1 })
    .catch()
    .then(projects => res.render('index', { projects, nWidgets: Object.keys(widgets).length }));
});
app.get('/create', (req, res) => res.render('project'));
app.get('/support/:slug', (req, res) => {
  Project
    .findOne({ slug: req.params.slug })
    .then((project) => {
      if (project == null) {
        throw new Error('not found');
      }

      return project;
    })
    .then(project => res.render('project', { project }))
    .catch(() => res.redirect('/'));
});

app.listen(config.port, () => console.log(`Listening to :${config.port}`));
