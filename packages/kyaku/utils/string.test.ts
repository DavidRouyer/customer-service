import { getInitials } from './string';

describe('getInitials', () => {
  it('should get correct initials with first name', () => {
    expect(getInitials('John')).toEqual('J');
  });
  it('should get correct initials with first name and last name', () => {
    expect(getInitials('John Doe')).toEqual('JD');
  });
  it('should get correct initials with first name and multiple last names', () => {
    expect(getInitials('John Doe Smith')).toEqual('JS');
  });
});
