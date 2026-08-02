import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Animated, ScrollView, View} from 'react-native';
import {MenuButton} from './MenuButton.js';
import {styles} from './styles.js';

function toKey(id) {
  return String(id);
}

function ScrollingButtonMenuInner(props, ref) {
  const {
    items = [],
    onPress,
    selected,
    upperCase = false,
    selectedOpacity = 0.7,
    containerStyle,
    contentContainerStyle,
    scrollStyle,
    textStyle,
    activeTextStyle,
    buttonStyle,
    activeButtonStyle,
    firstButtonStyle,
    lastButtonStyle,
    activeColor,
    activeBackgroundColor: activeBackgroundColorProp,
    unstyled = false,
    autoCenter = true,
    gap = 10,
    scrollEnabled = true,
    showsHorizontalScrollIndicator = false,
    keyboardShouldPersistTaps = 'always',
    bounces = true,
    indicator = false,
    indicatorStyle,
    renderItem,
    testID,
    accessibilityLabel,
  } = props;

  const activeBackgroundColor =
    activeBackgroundColorProp !== undefined
      ? activeBackgroundColorProp
      : unstyled
        ? undefined
        : '#1e1e1e';

  const scrollRef = useRef(null);
  const layoutsRef = useRef({});
  const viewportWidthRef = useRef(0);
  const pendingCenterIdRef = useRef(selected ?? null);
  const indicatorLeft = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const [indicatorReady, setIndicatorReady] = useState(false);

  const selectedKey = selected != null ? toKey(selected) : null;

  const centerOnId = useCallback((id, animated = true) => {
    const layout = layoutsRef.current[toKey(id)];
    const viewportWidth = viewportWidthRef.current;

    if (!layout || viewportWidth <= 0) {
      pendingCenterIdRef.current = id;
      return;
    }

    pendingCenterIdRef.current = null;
    const targetX = layout.x - (viewportWidth / 2 - layout.width / 2);
    scrollRef.current?.scrollTo({
      x: Math.max(0, targetX),
      y: 0,
      animated,
    });
  }, []);

  const animateIndicator = useCallback(
    (id, animated = true) => {
      if (!indicator) {
        return;
      }

      const layout = layoutsRef.current[toKey(id)];
      if (!layout) {
        return;
      }

      setIndicatorReady(true);

      if (!animated) {
        indicatorLeft.setValue(layout.x);
        indicatorWidth.setValue(layout.width);
        return;
      }

      Animated.parallel([
        Animated.spring(indicatorLeft, {
          toValue: layout.x,
          useNativeDriver: false,
          bounciness: 0,
          speed: 20,
        }),
        Animated.spring(indicatorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          bounciness: 0,
          speed: 20,
        }),
      ]).start();
    },
    [indicator, indicatorLeft, indicatorWidth],
  );

  const syncSelectionUI = useCallback(
    (id, animated = true) => {
      if (autoCenter) {
        centerOnId(id, animated);
      }
      animateIndicator(id, animated);
    },
    [animateIndicator, autoCenter, centerOnId],
  );

  useEffect(() => {
    if (selected == null) {
      return;
    }
    syncSelectionUI(selected, true);
  }, [selected, syncSelectionUI]);

  useImperativeHandle(
    ref,
    () => ({
      scrollToId: (id, animated = true) => centerOnId(id, animated),
      scrollToIndex: (index, animated = true) => {
        const item = items[index];
        if (item) {
          centerOnId(item.id, animated);
        }
      },
    }),
    [centerOnId, items],
  );

  const handleViewportLayout = useCallback(
    (event) => {
      viewportWidthRef.current = event.nativeEvent.layout.width;
      const pendingId = pendingCenterIdRef.current ?? selected;
      if (pendingId != null) {
        syncSelectionUI(pendingId, false);
      }
    },
    [selected, syncSelectionUI],
  );

  const handleItemLayout = useCallback(
    (id, event) => {
      const {x, y, width, height} = event.nativeEvent.layout;
      layoutsRef.current[toKey(id)] = {x, y, width, height};

      const shouldSync =
        (pendingCenterIdRef.current != null &&
          toKey(pendingCenterIdRef.current) === toKey(id)) ||
        (selected != null && toKey(selected) === toKey(id));

      if (shouldSync) {
        syncSelectionUI(id, pendingCenterIdRef.current == null);
      }
    },
    [selected, syncSelectionUI],
  );

  const handlePress = useCallback(
    (item) => {
      if (typeof item.onPress === 'function') {
        item.onPress(item);
      } else if (typeof onPress === 'function') {
        onPress(item);
      }

      syncSelectionUI(item.id, true);
    },
    [onPress, syncSelectionUI],
  );

  const lastIndex = items.length - 1;

  const indicatorNode = useMemo(() => {
    if (!indicator || !indicatorReady) {
      return null;
    }

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          indicatorStyle,
          {
            left: indicatorLeft,
            width: indicatorWidth,
          },
        ]}
      />
    );
  }, [
    indicator,
    indicatorLeft,
    indicatorReady,
    indicatorStyle,
    indicatorWidth,
  ]);

  return (
    <View
      style={[styles.container, containerStyle]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        bounces={bounces}
        style={[styles.scroll, scrollStyle]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        onLayout={handleViewportLayout}
      >
        {items.map((item, index) => (
          <MenuButton
            key={toKey(item.id)}
            item={item}
            index={index}
            isFirst={index === 0}
            isLast={index === lastIndex}
            selected={selectedKey === toKey(item.id)}
            upperCase={upperCase}
            selectedOpacity={selectedOpacity}
            unstyled={unstyled}
            gap={gap}
            textStyle={textStyle}
            activeTextStyle={activeTextStyle}
            buttonStyle={buttonStyle}
            activeButtonStyle={activeButtonStyle}
            firstButtonStyle={firstButtonStyle}
            lastButtonStyle={lastButtonStyle}
            activeColor={activeColor}
            activeBackgroundColor={activeBackgroundColor}
            renderItem={renderItem}
            onPress={handlePress}
            onLayout={handleItemLayout}
          />
        ))}
        {indicatorNode}
      </ScrollView>
    </View>
  );
}

const ScrollingButtonMenu = forwardRef(ScrollingButtonMenuInner);
ScrollingButtonMenu.displayName = 'ScrollingButtonMenu';

export {ScrollingButtonMenu};
export default ScrollingButtonMenu;
