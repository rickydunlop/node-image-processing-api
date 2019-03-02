import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const { Schema } = mongoose;
const AutoIncrementWithMongoose = AutoIncrement(mongoose);

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

imageSchema.plugin(AutoIncrementWithMongoose, { inc_field: 'id' });

export default mongoose.model('Image', imageSchema);
