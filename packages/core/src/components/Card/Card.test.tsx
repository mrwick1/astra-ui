import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import Card from './Card';

expect.extend(toHaveNoViolations);

describe('Card', () => {
  it('renders correctly', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('renders compound sub-components', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Header')).toBeDefined();
    expect(screen.getByText('Body')).toBeDefined();
    expect(screen.getByText('Footer')).toBeDefined();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Card ref={ref}>Test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('is accessible', async () => {
    const { container } = render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
