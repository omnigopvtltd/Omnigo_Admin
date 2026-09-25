import {
  mockRevenueSeries, mockRestaurantEarnings, mockRiderEarnings,
  mockWithdrawRequests, mockTransactions,
} from "./mockData";

import { axiosClient } from "./axiosClient";

let withdrawRequests = [...mockWithdrawRequests];
let transactions = [...mockTransactions];

function delay(data, ms = 450) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}


export async function getRevenueOverview({ range = "30d" } = {}) {
 
  try {
    const { data } = await axiosClient.get(`/finance/revenue`, {
      params: { range },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }

}


export async function getRestaurantEarnings({ search, page = 1, limit = 8 } = {}) {
 
   try {
    const { data } = await axiosClient.get(`/finance/restaurant-earnings`, {
      params: { search, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }
}


export async function getRiderEarnings({ search, page = 1, limit = 8 } = {}) {
  
 try {
    const { data } = await axiosClient.get(`/finance/rider-earnings`, {
      params: { search, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }
}


export async function getCommissionSummary({ range = "30d" } = {}) {
 
   try {
    const { data } = await axiosClient.get(`/finance/commission`, {
      params: { range },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }

}


export async function getWithdrawRequests({ status, type, page = 1, limit = 8 } = {}) {
 
 try {
    const { data } = await axiosClient.get(`/finance/withdrawals`, {
      params: { status, type, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }
}


export async function updateWithdrawRequestStatus(id, { status, adminNote }) {
  console.log(status);

 try {
    const { data } = await axiosClient.patch(`/finance/update/withdrawals/${id}`, { status, adminNote });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }

}


export async function getTransactions({ type, source, page = 1, limit = 12 } = {}) {
 
 try {
    const { data } = await axiosClient.get(`/finance/transactions`, {
      params: { type, source, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }

}