import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Checkbox from './Checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeDefined();
  });

  it('handles check/uncheck', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Check me" onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled label="Disabled" />);
    expect(screen.getByRole('checkbox')).toHaveProperty('disabled', true);
  });

  it('is accessible', async () => {
    const { container } = render(<Checkbox label="Accept" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
