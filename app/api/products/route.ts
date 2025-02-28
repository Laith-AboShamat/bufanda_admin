import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const {
      title,
      description,
      media,
      category,
      collections, // This field is optional
      tags,
      sizes,
      colors,
      price,
      expense,
      material,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense || !material) {
      return new NextResponse("Not enough data to update the product", {
        status: 400,
      });
    }

    // Only update collections if the `collections` field is provided and different
    if (collections && JSON.stringify(collections) !== JSON.stringify(product.collections)) {
      const addedCollections = collections.filter(
        (collectionId: string) => !product.collections.includes(collectionId)
      );
      const removedCollections = product.collections.filter(
        (collectionId: string) => !collections.includes(collectionId)
      );

      // Update collections
      await Promise.all([
        ...addedCollections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $push: { products: product._id },
          })
        ),
        ...removedCollections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $pull: { products: product._id },
          })
        ),
      ]);
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections: collections || product.collections,
        tags,
        sizes,
        colors,
        price,
        expense,
        material,
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
  }
};

export const dynamic = "force-dynamic";