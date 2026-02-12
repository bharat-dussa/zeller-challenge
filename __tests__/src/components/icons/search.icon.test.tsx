import React from 'react';
import { render } from '@testing-library/react-native';
import { SvgXml } from 'react-native-svg';
import SearchIcon from '../../../../src/shared/components/icons/search.icon';
import { colors } from '../../../../src/shared/utils/color.util';

describe('components/icons/SearchIcon', () => {
  beforeEach(() => {
    (SvgXml as jest.Mock).mockClear();
  });

  test('renders svg with default color', () => {
    render(<SearchIcon width={16} height={16} />);

    const props = (SvgXml as jest.Mock).mock.calls[0][0];
    expect(props.width).toBe(16);
    expect(props.height).toBe(16);
    expect(props.color).toBe(colors.primary);
    expect(props.xml).toContain('<svg');
  });

  test('renders svg with custom color', () => {
    render(<SearchIcon color="red" width={20} height={20} />);

    const props = (SvgXml as jest.Mock).mock.calls[0][0];
    expect(props.color).toBe('red');
  });
});
