import React, { useEffect, useState, } from "react";
import { ImageBackground, StyleSheet, View, Dimensions, Text, Image, Animated, TouchableOpacity } from "react-native";
import { FlatList, PanGestureHandler } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { clamp } from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Background from "../components/Background";
import { theme } from '../core/theme';
import useGetStores from '../helpers/getStores';
import BaseUrl from "../const/base_url";
import useGetShelves from "../helpers/getShelves";
import ShelfButton from "../components/ShelfButton";

export default function MapScreen({ userData }) {
    const route = useRoute();

    const [selectedItem, setSelectedItem] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const [showTooltip, setShowTooltip] = useState(0);
    const [selectedShelfPosition, setSelectedShelfPosition] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 })
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [itemInShelves, setItemInShelves] = useState([]);

    const storeData = useGetStores();
    const [mapData, setMapData] = useState(null);
    const [shelves, setShelves] = useState(null);
    const [passedProducts, setPassedProducts] = useState(null);
    const [passedStoreId, setPassedStoreId] = useState(null);

    const [randomPassId, setRandomPassId] = useState(null);
    useEffect(() => {
        if (route.params) {
            const someData = route.params?.params;
            setPassedProducts(someData.products);
            setPassedStoreId(someData.storeId);
            setRandomPassId(someData.randomParam);
        } else {
            console.log('No data passed in route params');
        }
    }, [route.params]);

    useEffect(() => {
        setSelectedItem(passedStoreId);
    }, [randomPassId]);

    useEffect(() => {
        const fetchDataMap = async () => {

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
        const fetchDataShelf = async () => {
            console.log('fetching started' + selectedItem)
            const response = await fetch(BaseUrl() + 'Shelf/GetAllByStoreId/' + selectedItem, {
                method: 'GET',
            });
            const data = await response.json();
            setShelves(data);
            console.log('data fetched of shelves' + selectedItem)
        };
        if (selectedItem) {
            fetchDataMap();
            setImagePosition({ x: 0, y: 0 });
            fetchDataShelf();
        }

    }, [selectedItem]);

    const moveImage = (x, y) => {

        const clampedX = clamp(x, -(imageSize.width - windowWidth + 50), 0)
        const clampedY = Math.max(0, Math.min(y, windowHeight - imageSize.height));

        setImagePosition({ x: clampedX, y: clampedY });
    }

    const onPanGestureEvent = (event) => {
        const newX = imagePosition.x + event.nativeEvent.translationX / 8;
        const newY = imagePosition.y + event.nativeEvent.translationY / 8;

        moveImage(newX, newY);
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

    function onListItemClick(item) {
        console.log(item);
        console.log(selectedItem, item.id)
        fetch(BaseUrl() + 'Shelf/GetByProductIdAndStoreId/' + item.id + '/' + selectedItem, {
            method: 'GET',
        }).then((response) => response.json())
            .then((data) => {
                if (data.error != null) {
                    alert('Item not found in any shelf');
                    return;
                }
                shelves.forEach(element => {
                    
                    console.log(selectedItem)
                    console.log(data, element.id)
                    if (element.id == parseInt(data)) {
                        moveImage(-parseInt(element.x1) + windowWidth / 2, -parseInt(element.y1));

                        setSelectedShelfPosition({ x1: element.x1, y1: element.y1, x2: element.x2, y2: element.y2 })
                        handlePressIn(null, element.id);

                    }
                });
            })
            .catch((error) => console.error(error));
    }
    const renderItem = ({ item }) => {
        console.log(item)
        return (
            <LinearGradient
                colors={['#FFFFFF', theme.colors.primary]}
                end={{ x: 1, y: 5 }}
                style={itemStyles.container}
            >
                <View style={itemStyles.content}>
                    <TouchableOpacity onPress={() => {
                        onListItemClick(item);
                    }}>
                        <Text style={itemStyles.name}>{item.name}</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    return (
        <Background>
            <View>
                <Picker
                    selectedValue={selectedItem}
                    onValueChange={(itemValue, itemIndex) => {
                        if (itemValue !== null) {
                            setSelectedItem(itemValue);
                        }
                    }}
                    style={pickerStyles.picker}
                    itemStyle={pickerStyles.pickerItem}>
                    <Picker.Item style={{ backgroundColor: '#f0f0f0' }} label="Select a store..." value={null} enabled={false} />
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
            {passedProducts && <FlatList style={{ width: '100%', position: 'absolute', alignSelf: 'center', height: 150, bottom: 10 }}
                data={passedProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={1}
            />
            }
        </Background >
    )


};
const itemStyles = StyleSheet.create({
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