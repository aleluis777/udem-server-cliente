import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { suscriptionId, endedAt } = body;

    if (!suscriptionId && !endedAt) {
      return NextResponse.json(
        { error: "Debe enviar al menos suscriptionId o endedAt" },
        { status: 400 }
      );
    }

    const updateFields: Record<string, string> = {
      updatedAt: new Date().toISOString(),
    };
    if (suscriptionId) updateFields.suscriptionId = suscriptionId;
    if (endedAt) updateFields.endedAt = endedAt;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const sub = result.suscriptionId
      ? await db.collection("subscriptions").findOne({ _id: new ObjectId(result.suscriptionId) })
      : null;

    return NextResponse.json({
      id: result._id.toString(),
      email: result.email,
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
      phone: result.phone,
      name: result.name,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      endedAt: result.endedAt,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    );
  }
}
