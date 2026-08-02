import React, {useMemo, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScrollingButtonMenu, {
  ScrollingTabScenes,
  type MenuItem,
  type ScrollingButtonMenuRef,
} from '@sekizlipenguen/react-native-scroll-menu';

const TAB_ITEMS: MenuItem[] = [
  {id: 'overview', name: 'Overview', testID: 'tab-overview'},
  {id: 'gallery', name: 'Gallery', testID: 'tab-gallery'},
  {id: 'reviews', name: 'Reviews', testID: 'tab-reviews'},
  {id: 'related', name: 'Related', testID: 'tab-related'},
];

const TAB_META: Record<
  string,
  {emoji: string; title: string; body: string; color: string}
> = {
  overview: {
    emoji: '✨',
    title: 'Overview',
    body: 'Swipe the content or tap a chip. Pages fade & scale while you move — store-app style.',
    color: '#1d4ed8',
  },
  gallery: {
    emoji: '🖼️',
    title: 'Gallery',
    body: 'Put images, carousels, or product shots in this scene.',
    color: '#7c3aed',
  },
  reviews: {
    emoji: '💬',
    title: 'Reviews',
    body: 'Lists, ratings, comments — each tab owns its own page.',
    color: '#059669',
  },
  related: {
    emoji: '🔗',
    title: 'Related',
    body: 'Recommendations and deep-links live here.',
    color: '#d97706',
  },
};

const BASIC_ITEMS: MenuItem[] = [
  {id: '1', name: 'Life', testID: 'basic-life'},
  {id: '2', name: 'Time', testID: 'basic-time'},
  {id: '3', name: 'Faith', testID: 'basic-faith'},
  {id: '4', name: 'Cosmos', testID: 'basic-cosmos'},
  {id: '5', name: 'Fall', testID: 'basic-fall'},
  {id: '6', name: 'Ocean', testID: 'basic-ocean'},
  {id: '7', name: 'Forest', testID: 'basic-forest'},
];

function Section({
  title,
  children,
  testID,
}: {
  title: string;
  children: React.ReactNode;
  testID?: string;
}) {
  return (
    <View style={styles.section} testID={testID}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  testID,
}: {
  label: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({pressed}) => [styles.actionBtn, pressed && styles.actionBtnPressed]}>
      <Text style={styles.actionBtnText}>{label}</Text>
    </Pressable>
  );
}

function App(): React.JSX.Element {
  const menuRef = useRef<ScrollingButtonMenuRef>(null);

  const [tabSelected, setTabSelected] = useState<string | number>('overview');
  const [basicSelected, setBasicSelected] = useState<string | number>('1');
  const [upperSelected, setUpperSelected] = useState<string | number>('a');
  const [disabledSelected, setDisabledSelected] = useState<string | number>('home');
  const [componentSelected, setComponentSelected] = useState<string | number>('c1');
  const [indicatorSelected, setIndicatorSelected] = useState<string | number>('i1');
  const [unstyledSelected, setUnstyledSelected] = useState<string | number>('u1');
  const [renderSelected, setRenderSelected] = useState<string | number>('r1');
  const [lastEvent, setLastEvent] = useState('—');

  const disabledItems = useMemo<MenuItem[]>(
    () => [
      {id: 'home', name: 'Home', testID: 'disabled-home'},
      {id: 'soon', name: 'Soon', disabled: true, testID: 'disabled-soon'},
      {id: 'profile', name: 'Profile', testID: 'disabled-profile'},
      {
        id: 'custom',
        name: 'Custom Press',
        testID: 'disabled-custom',
        onPress: item => {
          setLastEvent(`item.onPress → ${item.id}`);
          setDisabledSelected(item.id);
        },
      },
    ],
    [],
  );

  const componentItems = useMemo<MenuItem[]>(
    () => [
      {id: 'c1', name: 'Text only', testID: 'component-c1'},
      {
        id: 'c2',
        testID: 'component-c2',
        component: (
          <View style={styles.customChip} testID="component-c2-inner">
            <Text style={styles.customChipEmoji}>★</Text>
            <Text style={styles.customChipText}>Star</Text>
          </View>
        ),
      },
      {id: 'c3', name: 'Again', testID: 'component-c3'},
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.safe} testID="scroll-menu-example">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} testID="app-title">
          Scroll Menu Playground
        </Text>
        <Text style={styles.subtitle} testID="last-event">
          Last event: {lastEvent}
        </Text>

        <Section title="0) Tab menu + content scenes" testID="section-tabs">
          <Text style={styles.hint}>
            Tap a chip or swipe the card below. This is ScrollingTabScenes.
          </Text>
          <ScrollingTabScenes
            testID="tab-scenes"
            menuTestID="menu-tabs"
            contentTestID="tab-content"
            items={TAB_ITEMS}
            selected={tabSelected}
            onChange={(item, index) => {
              setTabSelected(item.id);
              setLastEvent(`tab → ${item.id} (#${index})`);
            }}
            animation="slide"
            swipeEnabled
            indicator
            gap={12}
            activeBackgroundColor="#111827"
            activeColor="#fff"
            indicatorStyle={styles.tabIndicator}
            containerStyle={styles.menuContainer}
            renderScene={({item}) => {
              const meta = TAB_META[String(item.id)] ?? TAB_META.overview;
              return (
                <View
                  style={[styles.sceneCard, {backgroundColor: meta.color}]}
                  testID={`scene-${item.id}`}>
                  <Text style={styles.sceneEmoji}>{meta.emoji}</Text>
                  <Text style={styles.sceneTitle}>{meta.title}</Text>
                  <Text style={styles.sceneBody}>{meta.body}</Text>
                </View>
              );
            }}
          />
        </Section>

        <Section title="1) Basic + autoCenter" testID="section-basic">
          <ScrollingButtonMenu
            testID="menu-basic"
            items={BASIC_ITEMS}
            selected={basicSelected}
            onPress={item => {
              setBasicSelected(item.id);
              setLastEvent(`basic → ${item.id}`);
            }}
            containerStyle={styles.menuContainer}
          />
          <Text style={styles.meta} testID="basic-selected">
            selected: {String(basicSelected)}
          </Text>
          <View style={styles.row}>
            <ActionButton
              testID="btn-scroll-to-fall"
              label="ref.scrollToId(Fall)"
              onPress={() => {
                menuRef.current?.scrollToId('5');
                setLastEvent('ref.scrollToId(5)');
              }}
            />
            <ActionButton
              testID="btn-scroll-to-index-0"
              label="ref.scrollToIndex(0)"
              onPress={() => {
                menuRef.current?.scrollToIndex(0);
                setLastEvent('ref.scrollToIndex(0)');
              }}
            />
          </View>
          {/* Dedicated ref target menu */}
          <ScrollingButtonMenu
            ref={menuRef}
            testID="menu-ref"
            items={BASIC_ITEMS}
            selected={basicSelected}
            onPress={item => {
              setBasicSelected(item.id);
              setLastEvent(`ref-menu → ${item.id}`);
            }}
            gap={14}
            containerStyle={styles.menuContainer}
            firstButtonStyle={styles.firstBtn}
            lastButtonStyle={styles.lastBtn}
          />
        </Section>

        <Section title="2) upperCase" testID="section-upper">
          <ScrollingButtonMenu
            testID="menu-upper"
            upperCase
            items={[
              {id: 'a', name: 'alpha', testID: 'upper-a'},
              {id: 'b', name: 'beta', testID: 'upper-b'},
              {id: 'c', name: 'gamma', testID: 'upper-c'},
            ]}
            selected={upperSelected}
            onPress={item => {
              setUpperSelected(item.id);
              setLastEvent(`upper → ${item.id}`);
            }}
            containerStyle={styles.menuContainer}
          />
        </Section>

        <Section title="3) disabled + per-item onPress" testID="section-disabled">
          <ScrollingButtonMenu
            testID="menu-disabled"
            items={disabledItems}
            selected={disabledSelected}
            onPress={item => {
              setDisabledSelected(item.id);
              setLastEvent(`disabled-menu → ${item.id}`);
            }}
            containerStyle={styles.menuContainer}
          />
        </Section>

        <Section title="4) custom component item" testID="section-component">
          <ScrollingButtonMenu
            testID="menu-component"
            items={componentItems}
            selected={componentSelected}
            onPress={item => {
              setComponentSelected(item.id);
              setLastEvent(`component → ${item.id}`);
            }}
            containerStyle={styles.menuContainer}
          />
        </Section>

        <Section title="5) indicator + gap" testID="section-indicator">
          <ScrollingButtonMenu
            testID="menu-indicator"
            indicator
            gap={18}
            indicatorStyle={styles.indicator}
            items={[
              {id: 'i1', name: 'Overview', testID: 'ind-i1'},
              {id: 'i2', name: 'Details', testID: 'ind-i2'},
              {id: 'i3', name: 'Reviews', testID: 'ind-i3'},
              {id: 'i4', name: 'Related', testID: 'ind-i4'},
            ]}
            selected={indicatorSelected}
            activeBackgroundColor="#2563eb"
            activeColor="#fff"
            onPress={item => {
              setIndicatorSelected(item.id);
              setLastEvent(`indicator → ${item.id}`);
            }}
            containerStyle={styles.menuContainer}
          />
        </Section>

        <Section title="6) unstyled" testID="section-unstyled">
          <ScrollingButtonMenu
            testID="menu-unstyled"
            unstyled
            items={[
              {id: 'u1', name: 'One', testID: 'unstyled-u1'},
              {id: 'u2', name: 'Two', testID: 'unstyled-u2'},
              {id: 'u3', name: 'Three', testID: 'unstyled-u3'},
            ]}
            selected={unstyledSelected}
            buttonStyle={styles.unstyledBtn}
            activeButtonStyle={styles.unstyledBtnActive}
            textStyle={styles.unstyledText}
            activeTextStyle={styles.unstyledTextActive}
            onPress={item => {
              setUnstyledSelected(item.id);
              setLastEvent(`unstyled → ${item.id}`);
            }}
            containerStyle={styles.menuContainer}
          />
        </Section>

        <Section title="7) renderItem" testID="section-render">
          <ScrollingButtonMenu
            testID="menu-render"
            items={[
              {id: 'r1', name: 'Red', testID: 'render-r1'},
              {id: 'r2', name: 'Green', testID: 'render-r2'},
              {id: 'r3', name: 'Blue', testID: 'render-r3'},
            ]}
            selected={renderSelected}
            unstyled
            gap={8}
            onPress={item => {
              setRenderSelected(item.id);
              setLastEvent(`renderItem → ${item.id}`);
            }}
            renderItem={({item, selected}) => (
              <View
                style={[
                  styles.renderChip,
                  selected && styles.renderChipSelected,
                  item.id === 'r1' && {borderColor: '#ef4444'},
                  item.id === 'r2' && {borderColor: '#22c55e'},
                  item.id === 'r3' && {borderColor: '#3b82f6'},
                ]}>
                <Text style={styles.renderChipText}>{item.name}</Text>
              </View>
            )}
            containerStyle={styles.menuContainer}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  content: {
    paddingBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  tabIndicator: {
    backgroundColor: '#111827',
    height: 3,
  },
  sceneCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 20,
    padding: 20,
  },
  sceneEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },
  sceneTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  sceneBody: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.92)',
  },
  section: {
    marginTop: 18,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  menuContainer: {
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  meta: {
    paddingHorizontal: 20,
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  actionBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnPressed: {
    opacity: 0.75,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  firstBtn: {
    borderColor: '#f59e0b',
  },
  lastBtn: {
    borderColor: '#10b981',
  },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customChipEmoji: {
    fontSize: 14,
    color: '#f59e0b',
  },
  customChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  indicator: {
    backgroundColor: '#2563eb',
    height: 3,
    borderRadius: 2,
  },
  unstyledBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  unstyledBtnActive: {
    backgroundColor: '#111827',
  },
  unstyledText: {
    color: '#374151',
    fontWeight: '600',
  },
  unstyledTextActive: {
    color: '#fff',
  },
  renderChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  renderChipSelected: {
    backgroundColor: '#f3f4f6',
  },
  renderChipText: {
    fontWeight: '700',
    color: '#111827',
  },
});

export default App;
