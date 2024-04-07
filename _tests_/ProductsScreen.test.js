import { fetchProducts } from '../src/screens/ProductsScreen'; // Adjust filepath
import fetch from 'jest-fetch-mock';
import BaseUrl from '../src/const/base_url'; // Assuming BaseUrl location

jest.mock('../src/const/base_url', () => () => 'http://192.168.19.199/');

describe('fetchProducts', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('fetches products, sets data, and updates loading state', async () => {
        const setData = jest.fn();
        const setLoading = jest.fn();
        const mockData = [{ id: 1, name: 'Product 1' }];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData)
        });

        await fetchProducts(setData, setLoading);

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/Product/GetAll');
        expect(setData).toHaveBeenCalledWith(mockData);
        expect(setLoading).toHaveBeenCalledTimes(2);
        expect(setLoading).toHaveBeenCalledWith(true); 
        expect(setLoading).toHaveBeenCalledWith(false); 
    });

    it('handles errors and sets loading to false', async () => {
        const setData = jest.fn();
        const setLoading = jest.fn();
        const error = new Error('Network Error');

        fetch.mockRejectedValueOnce(error);

        await fetchProducts(setData, setLoading);

        expect(fetch).toHaveBeenCalledWith('https://api.example.com/Product/GetAll');
        expect(setData).not.toHaveBeenCalled();
        expect(setLoading).toHaveBeenCalledTimes(2); 
        expect(setLoading).toHaveBeenCalledWith(true); 
        expect(setLoading).toHaveBeenCalledWith(false); 
    });
});