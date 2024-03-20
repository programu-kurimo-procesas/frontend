import { useState, useEffect } from 'react';
import BaseUrl from '../const/base_url'
export function addItemToList(selectedItemId, userId) {
    const fetchData = async () => {
        let data = null;
        try {
            const response = await fetch(BaseUrl() + 'ShoppingList/AddProductToList', {
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