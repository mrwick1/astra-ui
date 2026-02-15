import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Tooltip from './Tooltip';

expect.extend(toHaveNoViolations);

describe('Tooltip', () => {
  it('renders the trigger element', () => {
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeDefined();
  });

  it('does not show tooltip content by default', () => {
    render(
      <Tooltip content="Help text">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <button type="button">Hover me</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeDefined();
    });
    expect(screen.getByText('Help text')).toBeDefined();
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <button type="button">Hover me</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeDefined();
    });
    await user.unhover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeNull();
    });
  });

  it('shows tooltip on focus', async () => {
    render(
      <Tooltip content="Help text" delay={0}>
        <button type="button">Focus me</button>
      </Tooltip>
    );
    screen.getByText('Focus me').focus();
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeDefined();
    });
  });

  it('is accessible', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <Tooltip content="Accessible tooltip" delay={0}>
        <button type="button">Accessible trigger</button>
      </Tooltip>
    );
    await user.hover(screen.getByText('Accessible trigger'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeDefined();
    });
    const results = await axe(baseElement, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
