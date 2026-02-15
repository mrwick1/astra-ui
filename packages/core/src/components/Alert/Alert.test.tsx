import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Alert } from '.';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

describe('Alert', () => {
  it('renders children content', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Heads up">Details here</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('shows close button when closable', () => {
    render(<Alert closable>Dismissible alert</Alert>);
    expect(screen.getByRole('button', { name: /close alert/i })).toBeInTheDocument();
  });

  it('does not show close button by default', () => {
    render(<Alert>Not dismissible</Alert>);
    expect(screen.queryByRole('button', { name: /close alert/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(
      <Alert closable onClose={onClose}>
        Dismissible
      </Alert>
    );
    await userEvent.click(screen.getByRole('button', { name: /close alert/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has role="alert"', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<Alert title="Info">This is an alert</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
