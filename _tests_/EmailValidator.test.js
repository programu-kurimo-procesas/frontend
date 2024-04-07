import {emailValidator} from '../src/helpers/emailValidator';

describe('emailValidator', () => {
  it('validates correct email', () => {
    expect(emailValidator('test@example.com')).toBe('');
  });

  it('invalidates incorrect email', () => {
    expect(emailValidator('test@example')).toBe('Ooops! We need a valid email address.');
  });
});