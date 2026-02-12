import { render, screen } from '@testing-library/react-native';
import { ShowWhen } from '../../../../src/shared/components/show-when.component';
import { Text } from 'react-native';

const mockChildrenFn = jest.fn(() => (
  <Text testID="render-children">Children rendered</Text>
));

describe('components/ShowWhen', () => {
  test('render intially', () => {
    render(
      <ShowWhen
        condition={true}
        children={<Text testID="render-children">Hello</Text>}
      />,
    );
    expect(screen.getByTestId('render-children')).toBeOnTheScreen();
  });

  test('render component when loading is true', () => {
    render(
      <ShowWhen
        condition={true}
        loading
        children={<Text testID="render-children">Hello</Text>}
      />,
    );
    expect(screen.getByTestId('loader-container')).toBeOnTheScreen();
  });

  test('render children when children passed as function', () => {
    const { getByText } = render(
        <ShowWhen condition={true}>
          {mockChildrenFn}
        </ShowWhen>
      );

      expect(mockChildrenFn).toHaveBeenCalled();
      expect(getByText('Children rendered')).toBeTruthy();
  });
});
