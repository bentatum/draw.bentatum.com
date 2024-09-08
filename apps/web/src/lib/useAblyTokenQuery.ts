import useSWR from 'swr';

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error fetching token');
    }
    const data = await response.json();
    return data.token;
};

const useAblyToken = () => {
    return useSWR('/api/auth', fetcher, {
        refreshInterval: 60 * 60 * 1000, // Refresh token every hour
        revalidateOnFocus: false,
    });
};

export default useAblyToken;
