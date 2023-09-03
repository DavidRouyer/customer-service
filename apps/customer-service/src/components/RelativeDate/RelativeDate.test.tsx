import { screen } from '@testing-library/react';

import { RelativeDate } from '~/components/RelativeDate/RelativeDate';
import { render } from '~/utils/test-utils';

describe('<RelativeDate />', () => {
  it('should render today', () => {
    render(<RelativeDate dateTime={new Date()} />);

    expect(screen.getByText('today')).toBeInTheDocument();
  });
  it('should render yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    render(<RelativeDate dateTime={yesterday} />);

    expect(screen.getByText('yesterday')).toBeInTheDocument();
  });
  it('should render date on current year', () => {
    const januaryFirst = new Date();
    januaryFirst.setMonth(0);
    januaryFirst.setDate(1);

    render(<RelativeDate dateTime={januaryFirst} />);

    expect(screen.getByText('Sun, Jan 1')).toBeInTheDocument();
  });
  it('should render date on previous year', () => {
    const januaryFirst = new Date('2021-01-01');

    render(<RelativeDate dateTime={januaryFirst} />);

    expect(screen.getByText('Fri, Jan 1, 2021')).toBeInTheDocument();
  });
});
