
import Background from "../components/Background";
import React from "react";
import { useCallback, useState, useEffect, useRef } from "react";
import { ImageBackground, StyleSheet, View, Dimensions, TouchableOpacity, Text } from "react-native";
import { theme } from '../core/theme';
import { Image, Animated, TouchableWithoutFeedback } from "react-native";
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import useGetStores from '../helpers/getStores';
import { clamp } from "react-native-reanimated";
import BaseUrl from "../const/base_url";
import useGetShelves from "../helpers/getShelves";
import MapButton from "../components/ShelfButton";
import Tooltip from "../components/Tooltip";
import { Modal } from "react-native-paper";
import Button from "../components/Button"
import ShelfButton from "../components/ShelfButton";
export default function MapScreen({ userData }) {

    const [selectedItem, setSelectedItem] = useState();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const shelves = useGetShelves(selectedItem);
    const [showTooltip, setShowTooltip] = useState(0);
    const [selectedShelfPosition, setSelectedShelfPosition] = useState({ x: 0, y: 0 })
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });


    const storeData = useGetStores();

    const [mapData, setMapData] = useState();
    const onPickerValueChange = async () => {
        const fetchData = async () => {
            console.log(selectedItem);
            const response = await fetch(BaseUrl() + 'Store/GetMap/' + selectedItem, {
                method: 'GET',
            });
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
                setMapData(reader.result);

                Image.getSize(reader.result, (width, height) => {
                    setImageSize({ width: width, height: height })
                });

            };
            reader.readAsDataURL(blob);
        };
        await fetchData();
    };

    const scale = React.useRef(new Animated.Value(1)).current;


    const handlePinch = Animated.event([{
        nativeEvent: { scale }
    }])


    const onPanGestureEvent = (event) => {
        // Calculate new image position based on translation
        const newX = imagePosition.x + event.nativeEvent.translationX / 8;
        const newY = imagePosition.y + event.nativeEvent.translationY / 8;

        // Clamp the new position within screen boundaries
        const clampedX = clamp(newX, -(imageSize.width - windowWidth), 0)
        const clampedY = Math.max(0, Math.min(newY, windowHeight - imageSize.height));

        // Update image position state
        setImagePosition({ x: clampedX, y: clampedY });
    };
    const handlePressIn = (event, id) => {
        if (id == undefined) {
            setShowTooltip(0);
            setSelectedShelfPosition({x:0, y:0})
            return;
        }
        const fetchData = async (id) => {

            const response = await fetch(BaseUrl() + 'Product/GetAllByShelfId/' + id, {
                method: 'GET',
            });
            const data = await response.json();
            console.log(data)
            console.log('id: ' + element.id + '\n' + data[0].name);
        };

        fetchData(id);
        setShowTooltip(1);
        

    };


    const panRef = React.useRef(null);
    return (
        <Background>
            <View>
                <Picker
                    selectedValue={selectedItem}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedItem(itemValue);
                        onPickerValueChange();
                    }}
                    style={pickerStyles.picker}
                    itemStyle={pickerStyles.pickerItem}>
                    {storeData.map((item, index) => (
                        <Picker.Item label={item.name} value={item.id} />
                    ))}
                </Picker>
            </View>
            <View>
                <PanGestureHandler
                    ref={panRef}
                    onGestureEvent={onPanGestureEvent}>
                    <Animated.View>
                        <Animated.View
                            onTouchStart={handlePressIn}
                            style={[{
                                transform: [
                                    { translateX: imagePosition.x },
                                    { translateY: imagePosition.y },],
                            },]}>
                            <ImageBackground
                                style={{
                                    width: imageSize.width,
                                    height: imageSize.height,
                                    backgroundColor: theme.colors.background,
                                }}
                                resizeMode="contain"
                                source={{ uri: mapData }}>
                                {shelves && shelves.map((button) => (
                                    <ShelfButton key={button.id} button={button} onPress={(event) => {
                                        handlePressIn(event, button.id);
                                        console.log(button.x1, button.y1)
                                        setSelectedShelfPosition({x: button.x1, y: button.y1})
                                        console.log(selectedShelfPosition)
                                    }} />
                                ))}
                                <Animated.View style={[styles.myView, {
                                    opacity: showTooltip, 
                                    top: parseInt(selectedShelfPosition.y),
                                    left: parseInt(selectedShelfPosition.x),
                                }]}>
                                    <Text>This view's visibility fades</Text>
                                </Animated.View>
                            </ImageBackground>
                        </Animated.View>
                    </Animated.View>
                </PanGestureHandler >
            </View>
        </Background >
    )


};
const pickerStyles = StyleSheet.create({
    picker: {
        width: "100%",
        backgroundColor: '#f0f0f0', // Light gray background
        borderRadius: 8, // Adjust border radius for desired curve
        paddingHorizontal: 10,
        // Add horizontal padding for content spacing
        shadowColor: '#000000', // Add shadow for depth (optional)
        shadowOffset: { width: 0, height: 2 }, // Adjust shadow offset
        shadowOpacity: 0.2, // Set shadow opacity
        shadowRadius: 2, // Control shadow blur
    },
    pickerItem: {
        color: '#333333', // Darker text for better contrast
        fontSize: 16,  // Set your preferred font family (optional)
    },
});
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 3,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        color: '#888',
    },
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        marginLeft: 10,
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    myView: {
        backgroundColor: '#f0f0f0',
        position: 'absolute',

    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        width: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
});