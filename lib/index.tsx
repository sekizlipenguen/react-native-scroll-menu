declare module "react-native-scroll-menu" {
  import {StyleProp, TextStyle, ViewStyle} from "react-native"

  type routeProps = {
    id: string;
    name: string;
  };

  export type NavigationTabsProps = {
    id: string;
    name?: string;
    component?: React.ReactNode;
    onPress?: (route: routeProps) => void;
  };

  type ScrollingButtonMenuProps = {
    items: Array<NavigationTabsProps>;
    upperCase?: boolean;
    textStyle?: StyleProp<TextStyle>;
    activeTextStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    firstButtonStyle?: StyleProp<ViewStyle>;
    lastButtonStyle?: StyleProp<ViewStyle>;
    activeButtonStyle?: StyleProp<ViewStyle>;
    activeColor?: string;
    activeBackgroundColor?: string;
    selected: string;
    selectedOpacity?: number;
    containerStyle?: object;
    contentContainerStyle?: object;
    scrollStyle?: object;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  };
  export const ScrollingButtonMenu: React.FC<ScrollingButtonMenuProps>
}
