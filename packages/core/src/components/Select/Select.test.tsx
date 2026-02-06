import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Select from './Select';

expect.extend(toHaveNoViolations);

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Select', () => {
  it('renders with placeholder', () => {
    render(<Select options={options} placeholder="Pick a fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeDefined();
  });

  it('opens dropdown on click', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeDefined();
    expect(screen.getByText('Banana')).toBeDefined();
  });

  it('selects an option', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Banana'));
    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('shows selected value', () => {
    render(<Select options={options} value="cherry" />);
    expect(screen.getByText('Cherry')).toBeDefined();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toHaveProperty('disabled', true);
  });

  it('is accessible', async () => {
    const { container } = render(
      <Select options={options} aria-label="Select a fruit" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
