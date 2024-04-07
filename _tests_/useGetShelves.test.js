import { renderHook } from '@testing-library/react-hooks';
import useGetShelves from '../src/helpers/getShelves';
import BaseUrl from '../src/const/base_url';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: '1', name: 'Shelf 1' }, { id: '2', name: 'Shelf 2' }]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('useGetShelves makes a GET request and returns the data', async () => {
  const storeId = '123';
  const mapData = {};

  const { result, waitForNextUpdate } = renderHook(() => useGetShelves(storeId, mapData));

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(BaseUrl() + 'Shelf/GetAllByStoreId/' + storeId, {
    method: 'GET',
  });

  await waitForNextUpdate();

  expect(result.current).toEqual([{ id: '1', name: 'Shelf 1' }, { id: '2', name: 'Shelf 2' }]);
});