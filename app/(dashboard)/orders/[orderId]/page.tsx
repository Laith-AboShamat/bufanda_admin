import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(
    `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
  );
  const { orderDetails, customer } = await res.json();

  const { street, city, phoneNumber } = orderDetails.shippingAddress;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={50}
          className="rounded-lg"
        />
      </div>

      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg font-medium">{orderDetails._id}</p>
              </div>

              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="text-lg font-medium">{customer.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="text-lg font-medium">
                  {street}, {city}
                </p>
              </div>

              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-lg font-medium">{phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-blue-50 text-center">
            <p className="text-sm text-gray-500 items-center">Total Paid</p>
            <p className="text-3xl font-bold text-blue-700">
              ₪{orderDetails.totalAmount}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-[-20px]">Products</h2>
            <DataTable
              columns={columns}
              data={orderDetails.products}
              searchKey="product"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
