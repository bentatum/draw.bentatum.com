import { API_URL } from "@/config";

const fetcher = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching data');
  }

  return response.json();
};

export default fetcher;
