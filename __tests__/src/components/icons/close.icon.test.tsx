import React from 'react';
import { render } from '@testing-library/react-native';
import { SvgXml } from 'react-native-svg';
import CloseIcon from '../../../../src/shared/components/icons/close.icon';
import { colors } from '../../../../src/shared/utils/color.util';

describe('components/icons/CloseIcon', () => {
  beforeEach(() => {
    (SvgXml as jest.Mock).mockClear();
  });

  test('renders svg with default color', () => {
    render(<CloseIcon width={16} height={16} />);

    const props = (SvgXml as jest.Mock).mock.calls[0][0];
    expect(props.width).toBe(16);
    expect(props.height).toBe(16);
    expect(props.color).toBe(colors.primary);
    expect(props.xml).toContain('<svg');
  });

  test('renders svg with custom color', () => {
    render(<CloseIcon color="black" width={20} height={20} />);

    const props = (SvgXml as jest.Mock).mock.calls[0][0];
    expect(props.color).toBe('black');
  });
});
