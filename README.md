![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)
[![npm](https://img.shields.io/npm/v/@sekizlipenguen/react-native-scroll-menu.svg?style=flat-square)](https://www.npmjs.com/package/@sekizlipenguen/react-native-scroll-menu)
[![npm](https://img.shields.io/npm/dm/@sekizlipenguen/react-native-scroll-menu.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/@sekizlipenguen/react-native-scroll-menu)

# @sekizlipenguen/react-native-scroll-menu

A lightweight and customizable horizontal scrolling menu component for React Native. Designed for simplicity and flexibility, this package helps you create smooth and interactive menus for your mobile applications.

**Note:** This package is now part of the `@sekizlipenguen` scope to improve maintainability and provide better support for future updates.

---

## Installation

Install the package using npm or yarn:

```bash
npm install @sekizlipenguen/react-native-scroll-menu
```

```bash
yarn add @sekizlipenguen/react-native-scroll-menu
```

---

## Example

|                           Example                           |
|:----------------------------------------------------------:|
| ![](assets/1.gif)                                          |
| ![](assets/2.gif)                                          |

---

## Usage

Here’s a simple example of how to use the `@sekizlipenguen/react-native-scroll-menu`:

### Class Component Example

```javascript
import React, { Component } from 'react';
import { View } from 'react-native';

// Import the component
import ScrollingButtonMenu from '@sekizlipenguen/react-native-scroll-menu';

export default class Example extends Component {
  render() {
    return (
      <ScrollingButtonMenu
        items={[
          { id: "1", name: 'Life' },
          { id: "2", name: 'Time' },
          { id: "3", name: 'Faith' },
          { id: "4", name: 'Cosmos' },
          { id: "5", name: 'Fall' },
        ]}
        onPress={(e) => console.log(e)}
        selected={"1"}
      />
    );
  }
}
```

### Functional Component with Hook Example

```javascript
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Import the component
import ScrollingButtonMenu from '@sekizlipenguen/react-native-scroll-menu';

const ExampleWithHook = () => {
  const [selectedItem, setSelectedItem] = useState("1");

  const handlePress = (item) => {
    console.log(item);
    setSelectedItem(item.id);
  };

  return (
    <View>
      <ScrollingButtonMenu
        items={[
          { id: "1", name: 'Life' },
          { id: "2", name: 'Time' },
          { id: "3", name: 'Faith' },
          { id: "4", name: 'Cosmos' },
          { id: "5", name: 'Fall' },
        ]}
        onPress={handlePress}
        selected={selectedItem}
      />
      <Text>Selected Item: {selectedItem}</Text>
    </View>
  );
};

export default ExampleWithHook;
```

---

## Props

| Key                         | Type           | Description                                                 |
|-----------------------------|----------------|-------------------------------------------------------------|
| `items`                     | Array          | Array for button menu (required).                           |
| `onPress`                   | Function(menu) | Function triggered on button press (required).              |
| `upperCase`                 | Boolean        | Convert text to uppercase. Default: `false`.                |
| `selectedOpacity`           | Number         | Opacity when button is pressed. Default: `0.7`.             |
| `containerStyle`            | Object         | Style for the container.                                    |
| `contentContainerStyle`     | Object         | Style for the content container.                           |
| `scrollStyle`               | Object         | Style for the scroll view.                                  |
| `textStyle`                 | Object         | Style for the text.                                         |
| `buttonStyle`               | Object         | Style for the button.                                       |
| `activeButtonStyle`         | Object         | Style for the active button.                                |
| `firstButtonStyle`          | Object         | Style for the first button.                                 |
| `lastButtonStyle`           | Object         | Style for the last button.                                  |
| `activeTextStyle`           | Object         | Style for the active text.                                  |
| `activeColor`               | String         | Active button text color. Default: `"#ffffff"`.             |
| `activeBackgroundColor`     | String         | Active button background color. Default: `"#ffffff"`.       |
| `selected`                  | String or Number | Selected item id. Default: `1`.                            |
| `keyboardShouldPersistTaps` | String         | Default: `"always"`.                                        |

---

## Thank You!

We appreciate your support and feedback! If you encounter any issues, feel free to [open an issue](https://github.com/sekizlipenguen/react-native-scroll-menu/issues).

