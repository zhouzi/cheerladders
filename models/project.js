const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Project = new Schema({
  slug: {
    type: String,
    slug: 'name',
    unique: true,
    slug_padding_size: 1,
  },
  name: String,
  slogan: String,
  widgets: Array,
  token: String,
}, {
  timestamps: true,
});

Project.pre('save', function(next) {
  this.token = shortid.generate();
  next();
});

module.exports = mongoose.model('Project', Project);
