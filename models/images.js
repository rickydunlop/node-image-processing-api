import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const Schema = mongoose.Schema;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  renditions: {
    type: Array,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

imageSchema.plugin(AutoIncrement, { inc_field: 'id' });

export default mongoose.model('Image', imageSchema);
