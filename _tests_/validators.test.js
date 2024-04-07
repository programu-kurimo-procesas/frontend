import { nameValidator } from '../src/helpers/nameValidator';
import { passwordValidator } from '../src/helpers/passwordValidator';
import { useState, useEffect } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useLoginValidator from '../src/helpers/loginValidator';
import BaseUrl from '../src/const/base_url';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ id: '1', name: 'User 1' }),
    })
);

beforeEach(() => {
    fetch.mockClear();
});

test('useLoginValidator makes a POST request and returns the data', async () => {
    const login = { email: 'test@example.com', password: 'password' };

    const { result, waitForNextUpdate } = renderHook(() => useLoginValidator(login));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(BaseUrl() + 'User/GetUserByEmailAndPass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({ id: '1', name: 'User 1' });
});

test('nameValidator returns an error message when the name is empty', () => {
    const result = nameValidator('');
    expect(result).toBe("Name can't be empty.");
});

test('nameValidator returns an empty string when the name is not empty', () => {
    const result = nameValidator('John Doe');
    expect(result).toBe('');
});


test('passwordValidator returns an error message when the password is empty', () => {
    const result = passwordValidator('');
    expect(result).toBe("Password can't be empty.");
});

test('passwordValidator returns an error message when the password is less than 5 characters long', () => {
    const result = passwordValidator('1234');
    expect(result).toBe('Password must be at least 5 characters long.');
});

test('passwordValidator returns an empty string when the password is at least 5 characters long', () => {
    const result = passwordValidator('12345');
    expect(result).toBe('');
});