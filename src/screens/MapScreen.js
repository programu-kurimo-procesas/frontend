import React, { useEffect, useState, } from "react";
import { ImageBackground, StyleSheet, View, Dimensions, Text, Image, Animated } from "react-native";
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { clamp } from "react-native-reanimated";

import Background from "../components/Background";
import { theme } from '../core/theme';
import useGetStores from '../helpers/getStores';
import BaseUrl from "../const/base_url";
import useGetShelves from "../helpers/getShelves";
import ShelfButton from "../components/ShelfButton";
export default function MapScreen({ userData }) {
    console.log("mapscreen")
    const [selectedItem, setSelectedItem] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const [showTooltip, setShowTooltip] = useState(0);
    const [selectedShelfPosition, setSelectedShelfPosition] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 })
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [itemInShelves, setItemInShelves] = useState([]);

    const storeData = useGetStores();
    const shelves = useGetShelves(selectedItem);
    const [mapData, setMapData] = useState(null);


    const onPickerValueChange = async () => {
        const fetchData = async () => {

            console.log("this is the picker change event");
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
        setImagePosition({ x: 0, y: 0 });
    };



    const onPanGestureEvent = (event) => {
        const newX = imagePosition.x + event.nativeEvent.translationX / 8;
        const newY = imagePosition.y + event.nativeEvent.translationY / 8;

        const clampedX = clamp(newX, -(imageSize.width - windowWidth + 50), 0)
        const clampedY = Math.max(0, Math.min(newY, windowHeight - imageSize.height));

        setImagePosition({ x: clampedX, y: clampedY });
    };

    const handlePressIn = (event, id) => {
        if (id == undefined) {
            setShowTooltip(0);
            setSelectedShelfPosition({ x1: 0, y1: 0, x2: 0, y2: 0 })
            setItemInShelves([]);
            return;
        }
        const fetchData = async (id) => {

            const response = await fetch(BaseUrl() + 'Product/GetAllByShelfId/' + id, {
                method: 'GET',
            });
            const data = await response.json();
            setItemInShelves(data);
            setShowTooltip(1);
        };
        fetchData(id);
    };
    return (
        <Background>
            <View>
                <Picker
                    selectedValue={selectedItem}
                    onValueChange={(itemValue, itemIndex) => {
                        if (itemValue !== null) {
                            setSelectedItem(itemValue);
                            onPickerValueChange();
                        }
                    }}
                    style={pickerStyles.picker}
                    itemStyle={pickerStyles.pickerItem}>
                    <Picker.Item style={{backgroundColor: '#f0f0f0'}}label="Select a store..." value={null} enabled={false} />
                    {storeData.map((item, index) => (
                        <Picker.Item label={item.name} value={item.id} />
                    ))}
                </Picker>
            </View>
            <View>
                <PanGestureHandler
                    onGestureEvent={onPanGestureEvent}>
                    <Animated.View>
                        <Animated.View
                            onTouchStart={handlePressIn}
                            style={[{
                                transform: [
                                    { translateX: imagePosition.x },
                                    { translateY: imagePosition.y },],
                            },]}>
                            {mapData && <ImageBackground
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
                                        setSelectedShelfPosition({ x1: button.x1, y1: button.y1, x2: button.x2, y2: button.y2 })
                                    }} />
                                ))}
                                <Animated.View style={[styles.myView, {
                                    opacity: showTooltip,
                                    bottom: imageSize.height - parseInt(selectedShelfPosition.y1) + 9,
                                    left: parseInt(selectedShelfPosition.x1) - 33,
                                }]}>
                                    {
                                        itemInShelves.length > 0
                                            ? itemInShelves.map((item) => (
                                                <Text>
                                                    {item.name}
                                                </Text>
                                            ))
                                            : <Text>No items found in selected shelf</Text>
                                    }
                                </Animated.View>
                                <View

                                    style={[styles.triangle, {
                                        bottom: imageSize.height - parseInt(selectedShelfPosition.y1),
                                        left: parseInt(selectedShelfPosition.x1) + (parseInt(selectedShelfPosition.x2) - parseInt(selectedShelfPosition.x1)) / 2 - 5,
                                        opacity: showTooltip,
                                    }]}
                                ></View>
                            </ImageBackground>
                            }
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
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    pickerItem: {
        color: '#333333',
        fontSize: 16,
    },
});

const styles = StyleSheet.create({
    myView: {
        backgroundColor: theme.colors.primaryLight,
        position: 'absolute',
        width: 100,
    },
    triangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderRightWidth: 5,
        borderBottomWidth: 0,
        borderLeftWidth: 5,
        borderTopColor: theme.colors.primaryLight,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
});