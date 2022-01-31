import dbConnect from '../../../../lib/dbConnect';
import { Discord } from '../../../../models/Discord';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.body.token) {
          const discordFound = await Discord.find({
            token: { $regex: String(req.body.token), $options: 'i' },
          });

          res.status(200).json({ success: true, data: discordFound });
        } else {
          const proxies = await Discord.find({});

          res.status(200).json({ success: true, data: proxies });
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

        const newData = await Discord.create({ token });

        res.status(201).json({ success: true, data: newData });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case 'PUT':
      try {
        const foundDiscord = await Discord.findByIdAndUpdate(
          { _id: req.body.id },
          req.body,
          {
            new: true,
          }
        );
        if (!foundDiscord) {
          return res.status(400).json({ success: false, message: 'not found' });
        }
        res.status(200).json({ success: true, data: foundDiscord });
      } catch (error) {
        res.status(400).json({ success: false, message: 'not found' });
      }
      break;

    case 'DELETE':
      try {
        const deletedDiscord = await Discord.deleteOne({ _id: req.body.id });
        if (!deletedDiscord) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: deletedDiscord });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
