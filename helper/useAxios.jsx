import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



// export const baseUrl="http://192.168.83.124:3031"
export const baseUrl='https://mplbackend-5yl2.onrender.com'
// export const baseUrl="http://192.168.29.174:3031"
// export const baseUrl="http://192.168.1.18:3031"

 

const useAxios = (initialConfig = {}, options = {}) => {
    const { manual = true } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {userToken}=useAuth()

    const axiosInstance = axios.create({
        // baseURL: 'https://backend.monishkasolutions.com', // Replace with your base URL
        baseURL: baseUrl, // Replace with your base URL
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json', // Default Content-Type
            Accept: 'application/json', // Default Accept
            Authorization: `Bearer ${userToken}`, // Replace with a dynamic token if needed
            key:'5TIvw5cpc0'
        },
    });

    const fetchData = useCallback(
        async ({ url, method = 'GET', data: bodyData, headers = {} , showloader=true } = {}) => {
            setLoading(true)
            setError(null);

            try {
                const response = await axiosInstance({
                    ...initialConfig,
                    url: url || initialConfig.url,
                    method: method || initialConfig.method,
                    data: bodyData || initialConfig.data,
                    headers: { ...initialConfig.headers, ...headers },
                });
                setData(response.data);
                return response.data;
            } catch (err) {
           
                // console.log(err);
                setError(err.response?.data?.message || err.message || 'An error occurred');
                throw err.response?.data;
            } finally {

                setLoading(false)
            }
        },
        [initialConfig] // Depend only on the initial configuration
    );

    useEffect(() => {
        if (!manual && initialConfig.url) {
            fetchData();
        }
    }, [fetchData, manual]);

    return { data, loading, error, fetchData };
};

export default useAxios;
