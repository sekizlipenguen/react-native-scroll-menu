import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import ScrollingButtonMenu from './ScrollingButtonMenu.js';

function toKey(id) {
  return String(id);
}

function findIndexById(items, id) {
  if (id == null) {
    return 0;
  }
  const index = items.findIndex(item => toKey(item.id) === toKey(id));
  return index >= 0 ? index : 0;
}

/**
 * Tab menu + scene content.
 * Tap a chip to switch pages; optionally swipe between scenes.
 * Scene height auto-sizes to content unless `height` is passed.
 */
function ScrollingTabScenesInner(props, ref) {
  const {
    items = [],
    selected: selectedProp,
    defaultSelected,
    onChange,
    onPress: menuOnPress,
    renderScene,
    scenes,
    height,
    swipeEnabled = true,
    animation = 'slide',
    sceneContainerStyle,
    style,
    testID,
    menuTestID,
    contentTestID,
    ...menuProps
  } = props;

  const fixedHeight = typeof height === 'number' && height > 0 ? height : null;
  const autoHeight = fixedHeight == null;

  const {width: windowWidth} = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(windowWidth);
  const pageWidth = containerWidth > 0 ? containerWidth : windowWidth;

  const isControlled = selectedProp !== undefined;
  const [internalSelected, setInternalSelected] = useState(
    selectedProp ?? defaultSelected ?? items[0]?.id,
  );
  const selected = isControlled ? selectedProp : internalSelected;
  const selectedIndex = findIndexById(items, selected);
  const selectedKey = selected != null ? toKey(selected) : null;

  const pagerRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const lastEmittedKey = useRef(selectedKey);
  const skipExternalSync = useRef(false);
  const heightsRef = useRef({});
  const [heightsVersion, setHeightsVersion] = useState(0);

  const emitChange = useCallback(
    (item, index) => {
      const key = toKey(item.id);
      if (lastEmittedKey.current === key) {
        return false;
      }
      lastEmittedKey.current = key;

      if (!isControlled) {
        setInternalSelected(item.id);
      }
      if (typeof onChange === 'function') {
        onChange(item, index);
      }
      return true;
    },
    [isControlled, onChange],
  );

  const playFadeScale = useCallback(() => {
    if (animation === 'slide') {
      return;
    }

    fade.setValue(0.35);
    scale.setValue(animation === 'scale' ? 0.96 : 1);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animation, fade, scale]);

  const scrollPagerTo = useCallback(
    (index, animated) => {
      pagerRef.current?.scrollTo({
        x: index * pageWidth,
        y: 0,
        animated,
      });
      if (!animated) {
        scrollX.setValue(index * pageWidth);
      }
    },
    [pageWidth, scrollX],
  );

  const goToIndex = useCallback(
    (index, animated = true) => {
      const item = items[index];
      if (!item) {
        return;
      }

      if (emitChange(item, index)) {
        skipExternalSync.current = true;
      }
      playFadeScale();

      if (animation === 'slide' || swipeEnabled) {
        scrollPagerTo(index, animated);
      }
    },
    [
      animation,
      emitChange,
      items,
      playFadeScale,
      scrollPagerTo,
      swipeEnabled,
    ],
  );

  const handleSceneLayout = useCallback(
    (id, event) => {
      if (!autoHeight) {
        return;
      }
      const next = Math.ceil(event.nativeEvent.layout.height);
      if (next <= 0) {
        return;
      }
      const key = toKey(id);
      if (heightsRef.current[key] === next) {
        return;
      }
      heightsRef.current[key] = next;
      setHeightsVersion(value => value + 1);
    },
    [autoHeight],
  );

  const activeAutoHeight = useMemo(() => {
    if (!autoHeight || !selectedKey) {
      return 0;
    }
    // heightsVersion keeps this in sync with heightsRef mutations.
    void heightsVersion;
    return heightsRef.current[selectedKey] || 0;
  }, [autoHeight, heightsVersion, selectedKey]);

  useEffect(() => {
    if (!autoHeight || activeAutoHeight <= 0) {
      return;
    }
    Animated.timing(heightAnim, {
      toValue: activeAutoHeight,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [activeAutoHeight, autoHeight, heightAnim]);

  // Realign pages after layout width changes only.
  useEffect(() => {
    if (animation === 'slide' || swipeEnabled) {
      scrollPagerTo(selectedIndex, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageWidth]);

  // Sync when parent updates `selected` from outside.
  useEffect(() => {
    if (skipExternalSync.current) {
      skipExternalSync.current = false;
      lastEmittedKey.current = selectedKey;
      return;
    }

    lastEmittedKey.current = selectedKey;
    playFadeScale();
    if (animation === 'slide' || swipeEnabled) {
      scrollPagerTo(selectedIndex, true);
    }
  }, [
    animation,
    playFadeScale,
    scrollPagerTo,
    selectedIndex,
    selectedKey,
    swipeEnabled,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      goToId: (id, animated = true) => {
        goToIndex(findIndexById(items, id), animated);
      },
      goToIndex: (index, animated = true) => {
        goToIndex(index, animated);
      },
    }),
    [goToIndex, items],
  );

  const handleMenuPress = useCallback(
    item => {
      goToIndex(findIndexById(items, item.id), true);
      if (typeof menuOnPress === 'function') {
        menuOnPress(item);
      }
    },
    [goToIndex, items, menuOnPress],
  );

  const handleMomentumEnd = useCallback(
    event => {
      const x = event.nativeEvent.contentOffset.x;
      const index = Math.max(
        0,
        Math.min(items.length - 1, Math.round(x / pageWidth)),
      );
      const item = items[index];
      if (!item) {
        return;
      }
      if (emitChange(item, index)) {
        skipExternalSync.current = true;
      }
      playFadeScale();
    },
    [emitChange, items, pageWidth, playFadeScale],
  );

  const sceneNode = useCallback(
    (item, index) => {
      if (!item) {
        return null;
      }
      if (typeof renderScene === 'function') {
        return renderScene({
          item,
          index,
          selected: toKey(item.id) === selectedKey,
        });
      }
      if (scenes && scenes[item.id] != null) {
        return scenes[item.id];
      }
      return null;
    },
    [renderScene, scenes, selectedKey],
  );

  const overlayStyle = useMemo(() => {
    if (animation === 'slide') {
      return null;
    }
    return {
      opacity: fade,
      transform: [{scale}],
    };
  }, [animation, fade, scale]);

  const showPager = animation === 'slide' || swipeEnabled;

  const sceneBoxStyle = [
    styles.sceneBox,
    fixedHeight != null ? {height: fixedHeight} : null,
    autoHeight && activeAutoHeight > 0 ? {height: heightAnim} : null,
    sceneContainerStyle,
  ];

  return (
    <View
      style={[styles.root, style]}
      testID={testID}
      onLayout={event => {
        const next = event.nativeEvent.layout.width;
        if (next > 0 && Math.abs(next - containerWidth) > 1) {
          setContainerWidth(next);
        }
      }}>
      <ScrollingButtonMenu
        {...menuProps}
        items={items}
        selected={selected}
        onPress={handleMenuPress}
        testID={menuTestID}
      />

      <Animated.View style={sceneBoxStyle} testID={contentTestID}>
        {showPager ? (
          <Animated.ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            bounces={false}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            scrollEnabled={swipeEnabled}
            scrollEventThrottle={16}
            style={autoHeight ? styles.pagerAuto : styles.pagerFixed}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
            onMomentumScrollEnd={handleMomentumEnd}>
            {items.map((item, index) => {
              const inputRange = [
                (index - 1) * pageWidth,
                index * pageWidth,
                (index + 1) * pageWidth,
              ];
              const pageOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.45, 1, 0.45],
                extrapolate: 'clamp',
              });
              const pageScale = scrollX.interpolate({
                inputRange,
                outputRange: [0.94, 1, 0.94],
                extrapolate: 'clamp',
              });
              const pageTranslate = scrollX.interpolate({
                inputRange,
                outputRange: [18, 0, -18],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={toKey(item.id)}
                  style={[
                    autoHeight ? styles.pageAuto : styles.pageFixed,
                    {
                      width: pageWidth,
                      opacity: pageOpacity,
                      transform: [
                        {scale: pageScale},
                        {translateY: pageTranslate},
                      ],
                    },
                  ]}>
                  <View
                    onLayout={event => handleSceneLayout(item.id, event)}
                    style={autoHeight ? undefined : styles.pageFill}>
                    {sceneNode(item, index)}
                  </View>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        ) : (
          <Animated.View style={[styles.fadeHost, overlayStyle]}>
            <View
              onLayout={event =>
                handleSceneLayout(items[selectedIndex]?.id, event)
              }>
              {sceneNode(items[selectedIndex], selectedIndex)}
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  sceneBox: {
    overflow: 'hidden',
  },
  pagerFixed: {
    flex: 1,
  },
  pagerAuto: {
    // Height comes from measured scene content.
  },
  pageFixed: {
    flex: 1,
  },
  pageAuto: {
    justifyContent: 'flex-start',
  },
  pageFill: {
    flex: 1,
  },
  fadeHost: {
    width: '100%',
  },
});

const ScrollingTabScenes = forwardRef(ScrollingTabScenesInner);
ScrollingTabScenes.displayName = 'ScrollingTabScenes';

export {ScrollingTabScenes};
export default ScrollingTabScenes;
