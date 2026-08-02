import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingTop: 20,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    alignItems: 'center',
    position: 'relative',
  },
  item: {
    borderRadius: 18,
    borderColor: '#858585',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  itemFocused: {
    borderWidth: 0,
  },
  itemDisabled: {
    opacity: 0.4,
  },
  label: {
    color: '#5d5d5d',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: 20,
  },
  labelFocused: {
    color: '#fff',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#1e1e1e',
  },
});
