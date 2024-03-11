import { useState, useEffect } from 'react';

export function addItemToList(selectedItemId, userId) {
    const fetchData = async () => {
        let data = null;
        try {
            const response = await fetch('http://192.168.0.145/ShoppingList/AddProductToList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'productId': selectedItemId, 'userId': userId }),
            });
            
            data = await response.text();
            console.log(data)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        return data
    };

    return fetchData();
}