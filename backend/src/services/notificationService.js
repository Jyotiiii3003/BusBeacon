import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { sendFcm } from "./firebase.js";

export async function createNotification({ recipient, message, type = "system", metadata = {} }) {
  const doc = await Notification.create({ recipient, message, type, metadata });
  const user = await User.findById(recipient);
  await sendFcm(user?.fcmTokens, { title: "BusBeacon", body: message }, { type, ...metadata });
  return doc;
}
