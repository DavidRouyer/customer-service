import { render, screen } from '@testing-library/react';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';

describe('<RelativeTime />', () => {
  it('should render now', () => {
    render(<RelativeTime dateTime={new Date()} />);

    expect(screen.getByText('now')).toBeInTheDocument();
  });
  it('should render yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    render(<RelativeTime dateTime={yesterday} />);

    expect(screen.getByText('yesterday')).toBeInTheDocument();
  });
  it('should render relative time on current year', () => {
    const januaryFirst = new Date();
    januaryFirst.setMonth(0);
    januaryFirst.setDate(1);

    render(<RelativeTime dateTime={januaryFirst} />);

    expect(screen.getByText('7 months ago')).toBeInTheDocument();
  });
  it('should render relative time on previous year', () => {
    const januaryFirst = new Date('2021-01-01');

    render(<RelativeTime dateTime={januaryFirst} />);

    expect(screen.getByText('3 years ago')).toBeInTheDocument();
  });
});
