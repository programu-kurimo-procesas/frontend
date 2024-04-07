import { fetchProducts } from '../src/screens/ProductsScreen';
import BaseUrl from '../src/const/base_url';
describe('fetchProducts', () => {
  it('fetches products and updates state', async () => {
    const mockData = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
    const mockJsonPromise = Promise.resolve(mockData);
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    const setData = jest.fn();
    const setLoading = jest.fn();

    await fetchProducts(setData, setLoading);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(BaseUrl() + 'Product/GetAll');

    expect(setLoading).toHaveBeenCalledTimes(2);
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);

    expect(setData).toHaveBeenCalledTimes(1);
    expect(setData).toHaveBeenCalledWith(mockData);
  });
});