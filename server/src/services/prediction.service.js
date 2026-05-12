import axios from 'axios';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
const FASTAPI_TIMEOUT_MS = Number(process.env.FASTAPI_TIMEOUT_MS || 8000);

export async function predictComplaint(complaintText) {
  try {
    const response = await axios.post(
      `${FASTAPI_URL.replace(/\/$/, '')}/predict`,
      { complaint: complaintText },
      { timeout: FASTAPI_TIMEOUT_MS },
    );

    return response.data;
  } catch (error) {
    return {
      complaint: complaintText,
      unavailable: true,
      error: error.response?.data?.detail || error.message || 'Prediction service unavailable',
    };
  }
}
