import React, {memo, useCallback} from 'react';
import {Pressable, Text} from 'react-native';
import {styles} from './styles.js';

function MenuButtonComponent({
  item,
  index,
  isFirst,
  isLast,
  selected,
  upperCase,
  selectedOpacity,
  unstyled,
  gap,
  textStyle,
  activeTextStyle,
  buttonStyle,
  activeButtonStyle,
  firstButtonStyle,
  lastButtonStyle,
  activeColor,
  activeBackgroundColor,
  renderItem,
  onPress,
  onLayout,
}) {
  const disabled = Boolean(item.disabled);

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    onPress(item);
  }, [disabled, item, onPress]);

  const handleLayout = useCallback(
    (event) => {
      onLayout(item.id, event);
    },
    [item.id, onLayout],
  );

  const content = renderItem
    ? renderItem({item, index, selected, disabled})
    : item.component ?? (
        <Text
          style={[
            !unstyled && styles.label,
            textStyle,
            selected && !unstyled && styles.labelFocused,
            selected && activeTextStyle,
            selected && activeColor ? {color: activeColor} : null,
          ]}
          numberOfLines={1}
        >
          {upperCase && item.name ? item.name.toUpperCase() : item.name}
        </Text>
      );

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{selected, disabled}}
      accessibilityLabel={item.accessibilityLabel ?? item.name}
      testID={item.testID}
      disabled={disabled}
      onPress={handlePress}
      onLayout={handleLayout}
      style={({pressed}) => [
        !unstyled && styles.item,
        !unstyled && selected && styles.itemFocused,
        selected && activeButtonStyle,
        buttonStyle,
        selected && activeBackgroundColor
          ? {backgroundColor: activeBackgroundColor}
          : null,
        isFirst ? firstButtonStyle : null,
        isLast ? lastButtonStyle : null,
        !isLast ? {marginRight: gap} : null,
        disabled ? styles.itemDisabled : null,
        pressed && !disabled ? {opacity: selectedOpacity} : null,
      ]}
    >
      {content}
    </Pressable>
  );
}

function propsAreEqual(prev, next) {
  return (
    prev.item === next.item &&
    prev.index === next.index &&
    prev.isFirst === next.isFirst &&
    prev.isLast === next.isLast &&
    prev.selected === next.selected &&
    prev.upperCase === next.upperCase &&
    prev.selectedOpacity === next.selectedOpacity &&
    prev.unstyled === next.unstyled &&
    prev.gap === next.gap &&
    prev.textStyle === next.textStyle &&
    prev.activeTextStyle === next.activeTextStyle &&
    prev.buttonStyle === next.buttonStyle &&
    prev.activeButtonStyle === next.activeButtonStyle &&
    prev.firstButtonStyle === next.firstButtonStyle &&
    prev.lastButtonStyle === next.lastButtonStyle &&
    prev.activeColor === next.activeColor &&
    prev.activeBackgroundColor === next.activeBackgroundColor &&
    prev.renderItem === next.renderItem &&
    prev.onPress === next.onPress &&
    prev.onLayout === next.onLayout
  );
}

export const MenuButton = memo(MenuButtonComponent, propsAreEqual);
