import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, shippingAddress } = await req.json();


    if (!cartItems || !customer || !shippingAddress) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }


    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.phoneNumber
    ) {
      return new NextResponse("Please provide a complete shipping address", { status: 400 });
    }

    await connectToDB();

    const orderItems = cartItems.map((cartItem: any) => ({
      product: cartItem.item._id,
      color: cartItem.color || "N/A",
      size: cartItem.size || "N/A",
      quantity: cartItem.quantity,
    }));


    const totalAmount = cartItems.reduce(
      (acc: number, cartItem: any) => acc + cartItem.item.price * cartItem.quantity,
      0
    );

    const newOrder = new Order({
      customerClerkId: customer.clerkId,
      products: orderItems,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        phoneNumber: shippingAddress.phoneNumber,
      },
      shippingRate: "N/A",
      totalAmount,
      status: "Pending",
    });


    await newOrder.save();


    let customerRecord = await Customer.findOne({ clerkId: customer.clerkId });

    if (customerRecord) {
      customerRecord.orders.push(newOrder._id);
    } else {
      customerRecord = new Customer({
        clerkId: customer.clerkId,
        name: customer.name,
        email: customer.email,
        orders: [newOrder._id],
      });
    }

    await customerRecord.save();


    return NextResponse.json({ orderId: newOrder._id }, { headers: corsHeaders });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}