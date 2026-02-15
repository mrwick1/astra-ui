import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { toast } from './toast';
import ToastContainer from './ToastContainer';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

describe('toast (imperative API)', () => {
  it('emits info toast via subscribe', () => {
    const listener = vi.fn();
    const unsubscribe = toast.subscribe(listener);

    toast.info('Info title', 'Info description');

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'info',
        title: 'Info title',
        description: 'Info description',
      })
    );

    unsubscribe();
  });

  it('emits success toast via subscribe', () => {
    const listener = vi.fn();
    const unsubscribe = toast.subscribe(listener);

    toast.success('Saved');

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success', title: 'Saved' })
    );

    unsubscribe();
  });

  it('emits warning toast via subscribe', () => {
    const listener = vi.fn();
    const unsubscribe = toast.subscribe(listener);

    toast.warning('Careful');

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'warning', title: 'Careful' })
    );

    unsubscribe();
  });

  it('emits error toast via subscribe', () => {
    const listener = vi.fn();
    const unsubscribe = toast.subscribe(listener);

    toast.error('Failed', 'Something went wrong');

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'error',
        title: 'Failed',
        description: 'Something went wrong',
      })
    );

    unsubscribe();
  });

  it('generates unique ids for each toast', () => {
    const toasts: any[] = [];
    const unsubscribe = toast.subscribe((t) => toasts.push(t));

    toast.info('One');
    toast.info('Two');

    expect(toasts[0].id).not.toBe(toasts[1].id);

    unsubscribe();
  });

  it('unsubscribe stops receiving events', () => {
    const listener = vi.fn();
    const unsubscribe = toast.subscribe(listener);

    unsubscribe();
    toast.info('Should not be received');

    expect(listener).not.toHaveBeenCalled();
  });
});

describe('ToastContainer', () => {
  it('renders without error', () => {
    const { container } = render(<ToastContainer />);
    expect(container).toBeDefined();
  });

  it('is accessible', async () => {
    const { baseElement } = render(<ToastContainer />);
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
