import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SentimentBadge from './SentimentBadge';

// Mock the utils since we just want to test the badge renders the config it gets
vi.mock('../utils/newsUtils', () => ({
  getSentimentConfig: vi.fn((category) => {
    if (category === 'POSITIVE') {
      return {
        label: 'Positive',
        bg: 'bg-green-100',
        color: 'text-green-800',
        dot: 'bg-green-500'
      };
    }
    return {
      label: 'Neutral',
      bg: 'bg-gray-100',
      color: 'text-gray-800',
      dot: 'bg-gray-500'
    };
  })
}));

describe('SentimentBadge', () => {
  it('renders correctly for POSITIVE category', () => {
    render(<SentimentBadge category="POSITIVE" />);
    
    const badge = screen.getByText('Positive');
    expect(badge).toBeInTheDocument();
    
    // Check if the parent span has the mocked classes
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });
});
