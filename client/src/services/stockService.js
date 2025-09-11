// client/src/services/stockService.js
import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "/api";
const STOCKS = `${API_ROOT}/stocks`;

const getAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export async function uploadStock(formData, token) {
  const res = await axios.post(`${STOCKS}/upload`, formData, {
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function getStocks(params = {}) {
  // params: { q, type, category, subcategory, page, limit }
  const res = await axios.get(STOCKS, { params });
  // backend returns { success, total, page, limit, stocks } or array
  return res.data;
}

export async function getMyStocks(token) {
  const res = await axios.get(`${STOCKS}/mine`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
}

export async function deleteStock(id, token) {
  const res = await axios.delete(`${STOCKS}/${id}`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
}

export async function updateStock(id, formData, token) {
  // formData may be JSON or FormData (for file replacement pass FormData)
  let headers = getAuthHeaders(token);
  let options = { headers };
  // If formData is FormData object we also need content-type
  if (formData instanceof FormData) {
    options = {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    };
  }
  const res = await axios.put(`${STOCKS}/${id}`, formData, options);
  return res.data;
}

export async function changeStatus(id, status, token) {
  const res = await axios.patch(
    `${STOCKS}/${id}/status`,
    { status },
    {
      headers: getAuthHeaders(token),
    }
  );
  return res.data;
}

export async function getStockById(id) {
  const res = await axios.get(`${STOCKS}/${id}`);
  return res.data;
}
