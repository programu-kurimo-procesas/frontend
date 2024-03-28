import { useState, useEffect } from 'react';
import BaseUrl from "../const/base_url";

const useGetShelves = (storeId) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(BaseUrl() + 'Shelf/GetAllByStoreId/' + storeId, {
                method: 'GET',
            });
            const data = await response.json();
            setData(data);
        };
        if (storeId) {
            fetchData();
        }
    }, [storeId]);


    return data;
};

export default useGetShelves;
