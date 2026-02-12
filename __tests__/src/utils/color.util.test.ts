import { colors } from '../../../src/shared/utils/color.util';

describe('utils/color.util', () => {
  test('exports expected color keys', () => {
    expect(colors.primary).toBe('#4DA8DA');
    expect(colors.error).toBe('#FF3B30');
  });
});
