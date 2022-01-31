import mongoose from 'mongoose';

const ProxySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  port: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

const ProxyModel =
  mongoose.models.proxies || mongoose.model('proxies', ProxySchema);

export { ProxyModel };
