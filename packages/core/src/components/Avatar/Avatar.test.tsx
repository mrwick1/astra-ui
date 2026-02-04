import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Avatar from './Avatar';

expect.extend(toHaveNoViolations);

describe('Avatar', () => {
  it('renders correctly', () => {
    const { container } = render(<Avatar alt="John Doe" />);
    expect(container.firstChild).toBeDefined();
  });

  it('shows initials when no image is provided', () => {
    render(<Avatar alt="John Doe" />);
    expect(screen.getByText('JD')).toBeDefined();
  });

  it('renders fallback when provided', () => {
    render(<Avatar fallback={<span>FB</span>} />);
    expect(screen.getByText('FB')).toBeDefined();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Avatar ref={ref} alt="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('is accessible', async () => {
    const { container } = render(<Avatar alt="User avatar" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
