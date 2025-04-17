import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class ScrollingButtonMenu extends React.Component {

    constructor(props) {
        super(props);

        this.scroll = React.createRef();
        this.dataSourceCords = [];

        this.state = {
            index: '',
        };
    }

    componentDidUpdate(prevProps) {
        const {selected} = this.props;
        if (this.props.selected != this.state.index) {
            this.setState({index: selected}, () => {
                this._scrollTo();
            });
        }
    }

    componentDidMount() {
        const {selected} = this.props;
        this.setState({index: selected}, () => {
            setTimeout(() => {
                this._scrollTo();
            }, 600);
        });
    }

    _scrollTo() {
        const {index} = this.state;
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[index];
        if (elementOffset !== undefined && this.scroll && typeof this.scroll.scrollTo == 'function') {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
        }
    }

    render() {
        const {
            items,
            upperCase,
            selectedOpacity,
            activeBackgroundColor,
            activeColor,
            textStyle,
            activeTextStyle,
            buttonStyle,
            firstButtonStyle,
            lastButtonStyle,
            activeButtonStyle,
            containerStyle,
            contentContainerStyle,
            scrollStyle,
            keyboardShouldPersistTaps,
        } = this.props;
        const {index} = this.state;

        return (
            <View style={[
                styles.scrollArea,
                containerStyle,
            ]}>
                <ScrollView
                    horizontal={true}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={(node) => this.scroll = node}
                    style={[styles.scroll,scrollStyle]}
                    contentContainerStyle={[styles.scrollContainer,contentContainerStyle]}
                    scrollEventThrottle={200}
                    lazy={false}
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                >
                    {
                        items.map((route, i) => (
                            <TouchableOpacity
                                style={[
                                    (!buttonStyle ? styles.tabItem : {}),
                                    (index === route.id ? styles.tabItemFocused : {}),
                                    (index === route.id ? activeButtonStyle : {}),
                                    (buttonStyle ? buttonStyle : false),
                                    (index === route.id && activeBackgroundColor ? {backgroundColor: activeBackgroundColor} : false),
                                    (i == 0 ? firstButtonStyle : {}),
                                    (i == items.length - 1 ? lastButtonStyle : {}),

                                ]}
                                key={(route.id ? route.id : i).toString()}
                                onPress={() => this.setState({index: route.id}, () => setTimeout(() => {
                                    this._scrollTo();
                                    if (typeof route.onPress === 'function') {
                                        return route.onPress(route);
                                    } else {
                                        return this.props.onPress(route);
                                    }
                                }, 50))}
                                onLayout={(event) => {
                                    const layout = event.nativeEvent.layout;
                                    this.dataSourceCords[route.id] = layout;
                                }}
                                activeOpacity={selectedOpacity}
                            >
                                {
                                    route.component
                                        ? route.component
                                        : <Text style={[
                                            styles.tabItemText,
                                            (textStyle ? textStyle : false),
                                            (index == route.id ? styles.tabItemTextFocused : {}),
                                            (index == route.id ? activeTextStyle : {}),
                                            (index == route.id && activeColor ? {color: activeColor} : false),
                                        ]}>
                                            {upperCase ? route.name.toUpperCase() : route.name}
                                        </Text>
                                }
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}

// Not: item objesi artık isteğe bağlı olarak component (React öğesi) alabilir.
// Eğer bu alan sağlanırsa name alanı render edilmez, yerine component gösterilir.
ScrollingButtonMenu.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        component: PropTypes.element,
        onPress: PropTypes.func,
    })).isRequired,
    onPress: PropTypes.func.isRequired,
    upperCase: PropTypes.bool,
    textStyle: PropTypes.object,
    activeTextStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    firstButtonStyle: PropTypes.object,
    lastButtonStyle: PropTypes.object,
    activeButtonStyle: PropTypes.object,
    activeColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    selected: PropTypes.number,
    selectedOpacity: PropTypes.number,
    containerStyle: PropTypes.object,
    contentContainerStyle: PropTypes.object,
    keyboardShouldPersistTaps: PropTypes.string,
};

ScrollingButtonMenu.defaultProps = {
    upperCase: false,
    textStyle: {},
    activeTextStyle: {},
    buttonStyle: {
        borderRadius: 4,
        marginRight: 10,
    },
    activeColor: '',
    activeBackgroundColor: '#1e1e1e',
    selected: '',
    onPress: () => {

    },
    selectedOpacity: 0.7,
    containerStyle: {},
    contentContainerStyle:{},
    scrollStyle:{},
    keyboardShouldPersistTaps: 'always',
    lastButtonStyle: {},
    firstButtonStyle: {},
    activeButtonStyle: {},
};

const styles = StyleSheet.create({
    scrollArea: {
        paddingLeft: 20,
        paddingTop: 20,
    },
    scroll: {},
    scrollContainer: {},
    tabItem: {
        borderRadius: 18,
        borderColor: '#858585',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 6,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 10,
    },
    tabItemText: {
        color: '#5d5d5d',
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'normal',
        textAlign: 'left',
        lineHeight: 20,
    },
    tabItemFocused: {
        borderWidth: 0,
    },
    tabItemTextFocused: {
        color: '#fff',
    },
});
