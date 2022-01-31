import mongoose from 'mongoose';

const DiscordSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const Discord =
  mongoose.models.discords || mongoose.model('discords', DiscordSchema);

export { Discord };
