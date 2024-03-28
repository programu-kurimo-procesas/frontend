import { useState, useEffect } from 'react';
import BaseUrl from "../const/base_url";

const useGetStores = () => {
    const [storeData, setStoreData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(BaseUrl() + 'Store/GetAll', {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            
            setStoreData(data);
        };
        fetchData();
    }, []);

    return storeData;
};

export default useGetStores;
