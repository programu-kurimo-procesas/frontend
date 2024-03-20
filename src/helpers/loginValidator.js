import { useState, useEffect } from 'react';
import BaseUrl from "../const/base_url";

const useLoginValidator = (login) => {
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(BaseUrl() + 'User/GetUserByEmailAndPass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'email': login.email, 'password': login.password}),
            });
            const data = await response.json();
            
            setUserData(data);
        };
        fetchData();
    }, [login.email, login.password]);

    return userData;
};

export default useLoginValidator;
