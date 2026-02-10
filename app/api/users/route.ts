import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    const subsCollection = db.collection("subscriptions");
    const subscriptions = await subsCollection.find({}).toArray();
    const subsMap = new Map(subscriptions.map((s) => [s._id.toString(), s]));

    const mapped = users.map((user) => {
      const sub = subsMap.get(user.suscriptionId) ?? null;
      return {
        id: user._id.toString(),
        email: user.email,
        suscription: sub
          ? {
              id: sub._id.toString(),
              name: sub.name,
              link: sub.link,
              email: sub.email,
              password: sub.password,
              status: sub.status,
              blockedAt: sub.blockedAt,
              endedAt: sub.endedAt,
              createdAt: sub.createdAt,
              updatedAt: sub.updatedAt,
            }
          : null,
        phone: user.phone,
        name: user.name,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        endedAt: user.endedAt,
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, suscriptionId, endedAt } = body;

    if (!name || !email || !suscriptionId || !endedAt) {
      return NextResponse.json(
        { error: "Nombre, email, suscripción y fecha de vencimiento son obligatorios" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    const result = await collection.insertOne({
      name,
      email,
      phone: phone || null,
      suscriptionId,
      status: "active",
      createdAt: now,
      updatedAt: now,
      endedAt,
    });

    const sub = await db.collection("subscriptions").findOne({ _id: new ObjectId(suscriptionId) });

    return NextResponse.json({
      id: result.insertedId.toString(),
      name,
      email,
      phone: phone || null,
      suscription: sub
        ? {
            id: sub._id.toString(),
            name: sub.name,
            link: sub.link,
            email: sub.email,
            password: sub.password,
            status: sub.status,
            blockedAt: sub.blockedAt,
            endedAt: sub.endedAt,
            createdAt: sub.createdAt,
            updatedAt: sub.updatedAt,
          }
        : null,
      status: "active",
      createdAt: now,
      updatedAt: now,
      endedAt,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}
