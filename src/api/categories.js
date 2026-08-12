import { axiosClient } from "./axiosClient";

export async function getCategories() {
  try {
    const { data } = await axiosClient.get("/categories");

    console.log("API RESPONSE DATA:", data.data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

export async function getCategoryById(id) {
  try {
    const { data } = await axiosClient.get(`/categories/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

export async function createCategory(payload) {
  try {
    const { data } = await axiosClient.post(`/categories/create`, payload);

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

export async function updateCategory(id, payload) {
  try {
    const { data } = await axiosClient.put(`/categories/update/${id}`, payload);

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    const { data } = await axiosClient.delete(`/categories/delete/${id}`);

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

export async function reorderCategories(orderedIds) {
  try {
    const { data } = await axiosClient.put("/categories/reorder", {
      orderedIds,
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

// Sub-Category Services
export async function getSubCategories() {
  try {
    const { data } = await axiosClient.get(`/subcategories`);

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

export async function getSubCategoriesByCategory(categoryId) {
  try {
    const { data } = await axiosClient.get(
      `/categories/${categoryId}/subcategories`,
    );

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

export async function createSubCategory(payload) {
  try {
    const { data } = await axiosClient.post(`/subcategories/create`, payload);

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

export async function updateSubCategory(subId, payload) {
  try {
    const { data } = await axiosClient.put(
      `/subcategories/update/${subId}`,
      payload,
    );

    console.log("API RESPONSE DATA:", data);
    return data.data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

export async function deleteSubCategory(subId) {
  try {
    const { data } = await axiosClient.delete(`/subcategories/delete/${subId}`);

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
