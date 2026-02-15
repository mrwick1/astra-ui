import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Modal from './Modal';

expect.extend(toHaveNoViolations);

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Header>Title</Modal.Header>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <Modal.Body>Hidden</Modal.Body>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const overlay = document.querySelector('[aria-hidden="true"]');
    if (overlay) {
      await userEvent.click(overlay);
    }
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders all compound sub-components', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Header>Header</Modal.Header>
        <Modal.Body>Body</Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>
    );
    expect(screen.getByText('Header')).toBeDefined();
    expect(screen.getByText('Body')).toBeDefined();
    expect(screen.getByText('Footer')).toBeDefined();
  });

  it('has aria-modal attribute', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  });

  it('is accessible', async () => {
    const { baseElement } = render(
      <Modal open={true} onClose={() => {}} aria-label="Accessible Modal">
        <Modal.Header>Accessible Modal</Modal.Header>
        <Modal.Body>This modal should pass accessibility checks.</Modal.Body>
        <Modal.Footer>
          <button type="button">Close</button>
        </Modal.Footer>
      </Modal>
    );
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
