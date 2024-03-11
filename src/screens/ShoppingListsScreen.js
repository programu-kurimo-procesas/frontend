import { LinearGradient } from "expo-linear-gradient";
import Background from "../components/Background";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { FlatList } from "react-native";
import { theme } from '../core/theme';
import { Modal } from "react-native";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
export default function ShoppingListsScreen({ userData }) {
    console.log('Shopping list screen\n' + userData.id);
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const fetchProducts = () => {
        fetch('http://192.168.0.145/ShoppingList/GetAllProductsById/' + userData.id)
            .then((response) => response.json())
            .then((json) => setProducts(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProducts();
        });

        return unsubscribe;
    }, [navigation]);

    const onClose = () => {
        setModalVisible(false);
        setSelectedItem(null);
        fetchProducts();
    }
    const deleteFromList = async () => {
        try {
            const response = await fetch('http://192.168.0.145/ShoppingList/RemoveProductFromList', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: selectedItem.id,
                    userId: userData.id,
                }),
            });
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        }
    }
    const onConfirm = async() => {
        await deleteFromList();

        fetchProducts();


        setModalVisible(false);
        setSelectedItem(null);

    }

    const renderItem = ({ item }) => {
        console.log(item)
        return (
            <LinearGradient
                colors={['#FFFFFF', theme.colors.primary]}
                end={{ x: 1, y: 5 }}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{item.price} €</Text>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => {
                    setModalVisible(true);
                    setSelectedItem(item);

                }}>
                    <LinearGradient
                        colors={['#FFFFFF', theme.colors.primary]}
                        end={{ x: 1, y: 5 }}
                        style={styles.gradient}
                    >
                        <Text style={styles.removeButtonText}>-</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        );
    }
    console.log(products)
    return (
        <Background>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Delete Confirmation</Text>
                        <Text style={styles.message}>Are you sure you want to delete this item?</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <Button style={{ marginRight: 5, flex: 1 }} mode="contained" onPress={onConfirm}>
                                Confirm
                            </Button>
                            <Button style={{ marginLeft: 5, flex: 1 }} mode="outlined" onPress={onClose}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
            <FlatList style={{ width: '100%' }}
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={1}
            />
        </Background>
    )
};
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