import { screen } from '@testing-library/react';

import { RelativeTime } from './relative-time';
import { render } from './test-utils';

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
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    render(<RelativeTime dateTime={sevenMonthsAgo} />);

    expect(screen.getByText('7 months ago')).toBeInTheDocument();
  });
  it('should render relative time on previous year', () => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    render(<RelativeTime dateTime={threeYearsAgo} />);

    expect(screen.getByText('3 years ago')).toBeInTheDocument();
  });
});
