import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = await client.db('cryptoLabelDb');

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.body.token) {
          const discordFound = await db
            .collection('discords')
            .find({
              token: { $regex: String(req.body.token), $options: 'i' },
            })
            .toArray();

          res.status(200).json({ success: true, data: discordFound });
        } else {
          const discordsFound = await db
            .collection('discords')
            .find({})
            .toArray();

          res.status(200).json({ success: true, data: discordsFound });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case 'POST':
      try {
        const { token } = req.body;

        if (!token) throw 'invalid data';

        const newData = await db.collection('discords').insertOne({ token });

        res.status(201).json({ success: true, data: newData });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case 'PUT':
      try {
        const foundDiscord = await db.collection('discords').findOneAndUpdate(
          { _id: new ObjectId(req.body.id) },
          { $set: { ...req.body.data } },
          {
            new: true,
          }
        );

        if (!foundDiscord) {
          return res.status(404).json({ success: false, message: 'not found' });
        }
        res.status(200).json({ success: true, data: foundDiscord });
      } catch (error) {
        res.status(500).json({ success: false, error });
      }
      break;

    case 'DELETE':
      try {
        const deletedDiscord = await db
          .collection('discords')
          .deleteOne({ _id: new ObjectId(req.body.id) });
        if (!deletedDiscord) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: deletedDiscord });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
