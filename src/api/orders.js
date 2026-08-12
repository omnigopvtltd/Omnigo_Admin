// import { mockOrders } from "./mockData";
import { axiosClient } from "./axiosClient";

function delay(data, ms = 450) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * GET /orders?status=&search=
 * Filtering happens server-side in the real API; replicated here so the
 * mock behaves the same way the Orders page will once it's wired up.
 */
export async function getOrders({ status, search } = {}) {
  // Real version:
  // const { data } = await axiosClient.get("/orders", { params: { status, search } });
  // return data;
  console.log(status, search);
  
   const { data } = await axiosClient.get("/orders/all-orders", {
        params: {
            status,
            search
        }
    });
console.log(data.orders);

    return data.orders;
  
  // let results = mockOrders;

  // if (status && status !== "all") {
  //   results = results.filter((o) => o.status === status);
  // }

  // if (search) {
  //   const q = search.toLowerCase();
  //   results = results.filter(
  //     (o) =>
  //       o.id.toLowerCase().includes(q) ||
  //       o.customer.toLowerCase().includes(q) ||
  //       o.restaurant.toLowerCase().includes(q)
  //   );
  // }

  // return delay(results);
}
