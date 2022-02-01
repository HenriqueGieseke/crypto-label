import { MongoClient } from 'mongodb';
import dbConnect from '../../../../lib/dbConnect';
import { ProxyModel } from '../../../../models/Proxies';

export default async function handler(req, res) {
  await dbConnect();

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = await client.db('cryptoLabelDb');

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.body.address || req.body.username || req.body.port) {
          const proxies = await db
            .collection('proxies')
            .find({
              $or: [
                {
                  address: { $regex: String(req.body.address), $options: 'i' },
                },
                { port: { $regex: String(req.body.port), $options: 'i' } },
                {
                  username: {
                    $regex: String(req.body.username),
                    $options: 'i',
                  },
                },
              ],
            })
            .toArray();
          res.status(200).json({ success: true, data: proxies });
        } else {
          const proxies = await db.collection('proxies').find({}).toArray();
          res.status(200).send({ success: true, data: proxies });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case 'POST':
      try {
        const { address, port, username, password } = req.body;

        if (!address && !port) throw 'invalid data';
        const newData = await ProxyModel.create({
          address,
          port,
          username,
          password,
        });

        res.status(201).json({ success: true, data: newData });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case 'PUT':
      try {
        const foundProxy = await ProxyModel.findByIdAndUpdate(
          { _id: req.body.id },
          req.body,
          {
            new: true,
          }
        );
        if (!foundProxy) {
          return res.status(400).json({ success: false, message: 'not found' });
        }
        res.status(200).json({ success: true, data: foundProxy });
      } catch (error) {
        res.status(400).json({ success: false, message: 'not found' });
      }
      break;

    case 'DELETE':
      try {
        const deletedProxy = await ProxyModel.deleteOne({ _id: req.body.id });
        if (!deletedProxy) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: deletedProxy });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
