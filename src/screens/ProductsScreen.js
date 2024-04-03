
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image, Pressable, Modal, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../core/theme';
import { addItemToList } from '../helpers/addToList';
import BaseUrl from '../const/base_url';
const ProductsScreen = ({ userData }) => {
    navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [imageUris, setImageUris] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemImage, setSelectedItemImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [stores, setStores] = useState([]);
    const fetchProducts = () => {
        fetch(BaseUrl() + 'Product/GetAll')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!selectedItem) {
            setStores([]);
            return;
        }
        console.log(selectedItem);
        fetch(BaseUrl() + 'Store/GetAllContainingProduct/' + selectedItem.id)
            .then((response) => {
                console.log(response);
                return response.json()
            }
            )
            .then((json) => setStores(json))
    }, [selectedItem]);

    useEffect(() => {
        const fetchData = async () => {
            const promises = data.map(async (item) => {
                const response = await fetch(BaseUrl() + 'Product/GetImageById', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item.id),
                });
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = () => {
                    setImageUris(prevState => ({
                        ...prevState,
                        [item.id]: reader.result,
                    }));
                };
                reader.readAsDataURL(blob);
            });
            await Promise.all(promises);
        };
        fetchData();
    }, [data]);

    const renderItem = ({ item }) => {
        const imageUri = imageUris[item.id];

        return (
            <Pressable
                onPress={() => {
                    setSelectedItem(item);
                    setSelectedItemImage(imageUri);
                    setModalVisible(true);
                }}
                style={styles.pressable}
            >
                <LinearGradient
                    colors={['white', theme.colors.primary]}
                    end={{ x: 1, y: 5 }}
                    style={styles.item}
                >
                    {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>{item.price} €</Text>
                    </View>
                </LinearGradient>
            </Pressable>
        )
    }
    const sortData = () => {
        const sortedData = [...data].sort((a, b) => a.price - b.price);
        setData(sortedData);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalVisible(false);
    };

    const addItem = async () => {
        let response = await addItemToList(selectedItem.id, userData.id);
        if (response === "Product already in list") {
            alert("Product already in list");
            closeModal();
        } else {
            alert("Product added to list");
            closeModal();
        }
    };

    return (
        <Background>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.itemContainer}>
                            {selectedItemImage && <Image source={{ uri: selectedItemImage }} style={styles.modalImage} />}
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{selectedItem?.name}</Text>
                                <Text style={styles.itemDescription}>{selectedItem?.description}</Text>
                                <Text style={styles.itemPrice}>{selectedItem?.price} €</Text>
                            </View>
                        </View>
                        <Text style={[styles.itemName, { alignSelf: 'flex-start', marginLeft: 15 }]}>Available in:</Text>
                        {stores ?
                            stores.map((store) => {
                                return (
                                    <LinearGradient
                                        colors={['#FFFFFF', theme.colors.primary]}
                                        end={{ x: 1, y: 5 }}
                                        style={storeListStyle.container}
                                    >
                                            <Text style={styles.itemName}>{store.name}</Text>
                                            <TouchableOpacity style={storeListStyle.removeButton} onPress={() => {
                                                navigation.navigate('Map', {
                                                    params: {
                                                        products: [selectedItem],
                                                        storeId: store.id,
                                                        randomParam: Math.floor(Math.random() * 1000) + 1
                                                    }
                                                })
                                                closeModal();
                                            }}>
                                                <LinearGradient
                                                    colors={['#FFFFFF', theme.colors.primary]}
                                                    end={{ x: 1, y: 5 }}
                                                    style={storeListStyle.gradient}
                                                >
                                                    <Text style={storeListStyle.removeButtonText}>{'->'}</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                    </LinearGradient>
                                );
                            }) : <View>Unfortunately, this </View>}
                        <Button mode={'contained'} onPress={addItem} >
                            Add to List
                        </Button>
                    </View>
                </View>
            </Modal>
            <Button style={styles.modalButton} mode={'contained'} onPress={sortData}>
                Sort By Price
            </Button>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                numColumns={2}
            />
        </Background>
    );
};
const storeListStyle = StyleSheet.create({
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 3,
        width: '93%',
    },
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        backgroundColor: '#FFF',
        marginLeft: 10,
    },
    removeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});
const styles = StyleSheet.create({
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        elevation: 10,
        shadowColor: theme.colors.primary,
        shadowOpacity: -1,
        height: 200,
        width: 165,
        borderRadius: 12,
        justifyContent: 'space-between', // Align text vertically
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 5
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    modalImage: {
        width: 80,
        height: 80,
        marginRight: 20,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemDescription: {
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ProductsScreen;
