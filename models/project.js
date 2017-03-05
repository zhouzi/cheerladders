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
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', Project);
