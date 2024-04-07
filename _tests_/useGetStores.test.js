import { renderHook } from '@testing-library/react-hooks';
import useGetStores from '../src/helpers/getStores';
import BaseUrl from '../src/const/base_url';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: '1', name: 'Store 1' }, { id: '2', name: 'Store 2' }]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('useGetStores makes a GET request and returns the data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useGetStores());

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(BaseUrl() + 'Store/GetAll', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await waitForNextUpdate();

  expect(result.current).toEqual([{ id: '1', name: 'Store 1' }, { id: '2', name: 'Store 2' }]);
});