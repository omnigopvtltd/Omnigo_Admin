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
// export async function getCustomers({ status, search } = {}) {
//   // Real version:
//   // const { data } = await axiosClient.get("/orders", { params: { status, search } });
//   // return data;
  
//    const { data } = await axiosClient.get("/auth/users", {
//         params: {
//             status,
//             search
//         }
//     });
// console.log(data);

//     return data;
  
//   // let results = mockOrders;

//   // if (status && status !== "all") {
//   //   results = results.filter((o) => o.status === status);
//   // }

//   // if (search) {
//   //   const q = search.toLowerCase();
//   //   results = results.filter(
//   //     (o) =>
//   //       o.id.toLowerCase().includes(q) ||
//   //       o.customer.toLowerCase().includes(q) ||
//   //       o.restaurant.toLowerCase().includes(q)
//   //   );
//   // }

//   // return delay(results);
// }

// export async function updateCustomerStatus(id, status) {
//   // Real version: const { data } = await axiosClient.patch(`/restaurants/${id}/status`, { status }); return data.restaurant;
  
//   try {
//     const { data } = await axiosClient.patch(`/users/update/${id}/status`, {
//       status,
//       headers: {
//         "Content-Type" : "application/json",
//         Authorization:
//           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTBmNTcwYWNhMDFkYThhZDE5YmY1MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzgzNjkwNjEwLCJleHAiOjE3ODQyOTU0MTB9.qFBxDutfTMQqVrqaPeOgaXCrohxWrPOgTZFceC8VbZU",
//       },
//     });
    
//     // console.log("API RESPONSE DATA:", data); // Check if data is coming
//     return data;
    
//   } catch (error) {
//     // console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
//     throw error; // Tan-Query (useQuery) ko error batana zaroori hai
//   }
//   //======= mock data ======== 
//   // restaurants = restaurants.map((r) => (r._id === id ? { ...r, status } : r));
//   // return delay(restaurants.find((r) => r._id === id));
// }

export async function getCustomers({ status, search } = {}) {
  const { data } = await axiosClient.get("/auth/users", {
    params: { status, search }
  });
  return data.users; // Return only the users array from response
}

export async function updateCustomerStatus(id, isBlocked) {
  try {
    const { data } = await axiosClient.patch(`/auth/users/update/${id}/status`, {
      isBlocked, // Send 'isBlocked' matching what the backend expects
    }, {
      headers: {
        "Content-Type": "application/json",
        // Note: Make sure to replace this static token with your state-managed auth token in production!
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
}