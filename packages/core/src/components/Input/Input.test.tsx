import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Input from './Input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts user input', async () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    await userEvent.type(input, 'hello');
    expect(input).toHaveProperty('value', 'hello');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toHaveProperty('disabled', true);
  });

  it('sets aria-invalid when error is true', () => {
    render(<Input error placeholder="Error" />);
    expect(screen.getByPlaceholderText('Error').getAttribute('aria-invalid')).toBe('true');
  });

  it('is accessible', async () => {
    const { container } = render(
      <label>
        Email
        <Input placeholder="email@example.com" />
      </label>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
