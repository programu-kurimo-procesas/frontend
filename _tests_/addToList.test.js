import { addItemToList } from '../src/helpers/addToList';
import BaseUrl from '../src/const/base_url';

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('Mocked response'),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('addItemToList makes a POST request with the correct parameters', async () => {
  const selectedItemId = '123';
  const userId = '456';

  const response = await addItemToList(selectedItemId, userId);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(BaseUrl() + 'ShoppingList/AddProductToList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'productId': selectedItemId, 'userId': userId }),
  });
  expect(response).toBe('Mocked response');
});