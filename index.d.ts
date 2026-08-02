import {ReactNode, Ref} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export type MenuItemId = string | number;

export type MenuItem = {
  id: MenuItemId;
  name?: string;
  /** When set, rendered instead of `name`. */
  component?: ReactNode;
  /** Overrides the menu-level `onPress` for this item. */
  onPress?: (item: MenuItem) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

export type ScrollingButtonMenuRef = {
  scrollToId: (id: MenuItemId, animated?: boolean) => void;
  scrollToIndex: (index: number, animated?: boolean) => void;
};

export type RenderItemInfo = {
  item: MenuItem;
  index: number;
  selected: boolean;
  disabled: boolean;
};

export type ScrollingButtonMenuProps = {
  items: MenuItem[];
  onPress?: (item: MenuItem) => void;
  /** Selected item id (controlled). */
  selected?: MenuItemId;
  upperCase?: boolean;
  selectedOpacity?: number;

  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  activeButtonStyle?: StyleProp<ViewStyle>;
  firstButtonStyle?: StyleProp<ViewStyle>;
  lastButtonStyle?: StyleProp<ViewStyle>;
  activeColor?: string;
  activeBackgroundColor?: string;

  /**
   * Skip built-in chip styles so only your `buttonStyle` / active styles apply.
   * Replaces the old `buttonStyle={{}}` workaround.
   */
  unstyled?: boolean;

  /** Center the selected item in the viewport. Default: true. */
  autoCenter?: boolean;
  /** Horizontal gap between items. Default: 10. */
  gap?: number;
  scrollEnabled?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  bounces?: boolean;

  /** Sliding underline under the active item. */
  indicator?: boolean;
  indicatorStyle?: StyleProp<ViewStyle>;

  /** Fully custom item content; falls back to name/component when omitted. */
  renderItem?: (info: RenderItemInfo) => ReactNode;

  testID?: string;
  accessibilityLabel?: string;
  ref?: Ref<ScrollingButtonMenuRef>;
};

// Return JSX.Element (host JSX namespace) for RN/tsconfig compatibility.
export declare const ScrollingButtonMenu: (
  props: ScrollingButtonMenuProps,
) => JSX.Element;
export default ScrollingButtonMenu;

export type RenderSceneInfo = {
  item: MenuItem;
  index: number;
  selected: boolean;
};

export type ScrollingTabScenesRef = {
  goToId: (id: MenuItemId, animated?: boolean) => void;
  goToIndex: (index: number, animated?: boolean) => void;
};

export type ScrollingTabScenesProps = Omit<
  ScrollingButtonMenuProps,
  'selected' | 'onPress' | 'testID' | 'ref'
> & {
  items: MenuItem[];
  selected?: MenuItemId;
  defaultSelected?: MenuItemId;
  onChange?: (item: MenuItem, index: number) => void;
  onPress?: (item: MenuItem) => void;
  /** Preferred: render each scene from the active item. */
  renderScene?: (info: RenderSceneInfo) => ReactNode;
  /** Alternative map: `{ [item.id]: ReactNode }`. */
  scenes?: Record<string | number, ReactNode>;
  /**
   * Optional fixed scene height.
   * When omitted, height auto-sizes to the active scene content.
   */
  height?: number;
  /** Allow horizontal swipe between scenes. Default: true. */
  swipeEnabled?: boolean;
  /**
   * `slide` = pager + parallax (default)
   * `fade` / `scale` = cross-fade (no swipe unless swipeEnabled)
   */
  animation?: 'slide' | 'fade' | 'scale';
  sceneContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  menuTestID?: string;
  contentTestID?: string;
  ref?: Ref<ScrollingTabScenesRef>;
};

export declare const ScrollingTabScenes: (
  props: ScrollingTabScenesProps,
) => JSX.Element;
