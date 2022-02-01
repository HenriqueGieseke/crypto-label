import dbConnect from '../../../../lib/dbConnect';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = await client.db('scrapers');

  const { method } = req;
  const { collection, ids } = req.query;

  switch (method) {
    case 'GET':
      try {
        const allCollections = await db.listCollections().toArray();
        const collectionNames = allCollections.map((col) => col.name);

        const checkCollection = collectionNames.includes(collection);

        if (checkCollection) {
          const idsArray = ids.split(',');
          const idArraysNumber = idsArray.map(Number);

          const data = await db
            .collection(collection)
            .find({ id: { $in: idArraysNumber } })
            .toArray();

          if (data.length === 0) {
            res
              .status(404)
              .json({ success: false, error: 'document not found' });
          } else {
            console.log({ data });

            res.status(200).json({ success: true, data });
          }
        } else {
          res
            .status(404)
            .json({ success: false, error: 'collection not found' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
