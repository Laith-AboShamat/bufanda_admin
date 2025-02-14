import Collection from "@/lib/models/Collection";
import { connectToDb } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectToDb();

    const {title , description, image} = await req.json()

    const existingCollection = await Collection.findOne({ title })

    if (existingCollection) {
        return new NextResponse("Collection already exists", {status: 400})
    }

    if (!title || !image){
        return new NextResponse("Title and image are required", { status: 400})
    }

    const newColliction = await Collection.create({
        title,
        description,
        image,
    })

    await newColliction.save()

    return NextResponse.json(newColliction, {status: 200})

  } catch (err) {
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDb()

    const collections = await Collection.find().sort({ createdAt: "desc"})
    return NextResponse.json(collections, {status: 200})
  } catch (err) {
    console.log("[collections_GET]",err)
    return new NextResponse("Internal Server Error", {status: 500})
  }
}
