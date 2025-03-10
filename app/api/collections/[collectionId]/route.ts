import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await connectToDB();

    const collection = await Collection.findById(params.collectionId).populate({
      path: "products",
      model: Product,
    });

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(collection, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { collectionId } = params;

    if (!collectionId) {
      return new NextResponse("Collection ID is required", { status: 400 });
    }

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    const { title, description, image, category } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        title,
        description,
        image,
        category,
      },
      { new: true }
    );

    await updatedCollection.save();

    return NextResponse.json(updatedCollection, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    await Collection.findByIdAndDelete(params.collectionId);

    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );

    return new NextResponse("Collection is deleted", { status: 200 });
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";