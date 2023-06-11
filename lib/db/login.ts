import type { LoginRequest } from "types/loginRequests";
import clientPromise from "./connect";
import { env } from "~/env.mjs";

export async function storeLoginRequest(loginReq: LoginRequest) {
  const client = await clientPromise;
  const db = client.db();
  const collectionName = env.MONGO_DB_LOGIN_COLLECTION;
  const expiryTime = env.LOGIN_EXPIRY;

  const currentTime = new Date();
  loginReq.issuesAt = Math.floor(currentTime.getTime() / 1000);
  loginReq.expiresAt = Math.floor(
    new Date(currentTime.getTime() + expiryTime * 60 * 1000).getTime() / 1000
  );
  loginReq.loggedIn = false;

  try {
    console.log("Inserting new login request", collectionName, loginReq);
    const collection = db.collection(collectionName);
    const res = await collection.insertOne(loginReq);

    return { data: res.insertedId };
  } catch (e) {
    return { error: e };
  }
}

export async function getLoginRequest(token: string) {
  const client = await clientPromise;
  const db = client.db();
  const collectionName = env.MONGO_DB_LOGIN_COLLECTION;
  const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
  console.log("currentTime", currentTime);

  try {
    console.log(`Quering ${collectionName} for tempPassOf: ${token}`);
    const collection = db.collection(collectionName);
    const res = await collection.findOne<LoginRequest>({
      tempPass: token,
      expiresAt: {
        $gt: currentTime,
      },
      loggedIn: false,
    });

    if (!res) {
      return {
        error: {
          message: "no login found",
        },
      };
    }

    return { data: res };
  } catch (e) {
    return { error: e };
  }
}

export async function updateUserLogin(user: LoginRequest) {
  const client = await clientPromise;
  const db = client.db();
  const collectionName = env.MONGO_DB_LOGIN_COLLECTION;
  const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
  console.log("currentTime", currentTime);

  try {
    console.log(`Updating document in ${collectionName}`, user);
    const collection = db.collection(collectionName);
    const res = await collection.findOneAndUpdate(
      {
        tempPass: user.tempPass,
        expiresAt: {
          $gt: currentTime,
        },
      },
      { $set: { loggedIn: true } }
    );
    return { data: res };
  } catch (e) {
    return { error: e };
  }
}
