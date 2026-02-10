import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("subscriptions");

    const subscriptions = await collection.find({}).toArray();

    const mapped = subscriptions.map((sub) => ({
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
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Error fetching subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, link, email, password, createdAt, endedAt } = body;

    if (!name || !link || !email || !password || !createdAt || !endedAt) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("subscriptions");

    const result = await collection.insertOne({
      name,
      link,
      email,
      password,
      status: "active",
      createdAt,
      endedAt,
      updatedAt: now,
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      name,
      link,
      email,
      password,
      status: "active",
      createdAt,
      endedAt,
      updatedAt: now,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Error creating subscription" },
      { status: 500 }
    );
  }
}
