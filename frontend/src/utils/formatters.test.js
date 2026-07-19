import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatWeight } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats numbers as INR currency by default', () => {
      // Using replace to normalize non-breaking spaces that Intl might output
      expect(formatCurrency(1000).replace(/\s/g, ' ')).toMatch(/₹\s?1,000/);
    });
    
    it('returns "-" for null or undefined', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
    });
  });

  describe('formatPercentage', () => {
    it('formats positive numbers with a + sign and default 1 decimal', () => {
      expect(formatPercentage(5.5)).toBe('+5.5%');
    });

    it('formats negative numbers correctly', () => {
      expect(formatPercentage(-2.3)).toBe('-2.3%');
    });

    it('returns "-" for null', () => {
      expect(formatPercentage(null)).toBe('-');
    });
  });

  describe('formatWeight', () => {
    it('formats weight in Kg if less than 100', () => {
      expect(formatWeight(50)).toBe('50 Kg');
    });

    it('formats weight in Quintals if between 100 and 999', () => {
      expect(formatWeight(150)).toBe('1.5 Quintals');
    });

    it('formats weight in Tonnes if 1000 or more', () => {
      expect(formatWeight(1500)).toBe('1.5 Tonnes');
    });

    it('returns "-" for null', () => {
      expect(formatWeight(null)).toBe('-');
    });
  });
});
