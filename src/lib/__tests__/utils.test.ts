import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn - className merger', () => {
    it('sloučí více className stringů', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('odebrání duplicitních tříd', () => {
      expect(cn('px-4', 'px-2')).toBe('px-2');
    });

    it('zpracuje podmíněné třídy', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });

    it('zpracuje undefined a null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });

    it('sloučí tailwind conflicting classes správně', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('zachová non-conflicting classes', () => {
      expect(cn('bg-red-500', 'text-white', 'p-4')).toContain('bg-red-500');
      expect(cn('bg-red-500', 'text-white', 'p-4')).toContain('text-white');
      expect(cn('bg-red-500', 'text-white', 'p-4')).toContain('p-4');
    });
  });
});
