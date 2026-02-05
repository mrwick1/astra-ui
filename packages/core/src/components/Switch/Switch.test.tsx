import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Switch from './Switch';

expect.extend(toHaveNoViolations);

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch label="Toggle" />);
    expect(screen.getByRole('switch')).toBeDefined();
  });

  it('toggles on click', async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled value', () => {
    render(<Switch checked={true} />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toHaveProperty('disabled', true);
  });

  it('is accessible with label', async () => {
    const { container } = render(<Switch label="Dark mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is accessible with aria-label', async () => {
    const { container } = render(<Switch aria-label="Toggle dark mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
