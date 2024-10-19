import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const IMAGE_STORAGE_KEY = 'cardImage';
const TOKEN_STORAGE_KEY = 'token';
const DEFAULT_IMAGE_URL = 'https://example.com/default-image.png';
const API_URL = 'http://192.168.1.4:5000/user-image';

const AdminHome = () => {
    const navigation = useNavigation();
    const [cardImage, setCardImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
    const navItems = [
        { name: 'Latest', icon: 'star' },
        { name: 'Business', icon: 'briefcase' },
        { name: 'Events', icon: 'calendar' },
    ];

    useEffect(() => {
        const loadImage = async () => {
            try {
                const storedImage = await AsyncStorage.getItem(IMAGE_STORAGE_KEY);
                if (storedImage) {
                    setCardImage(storedImage);
                } else {
                    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
                    const response = await fetch(API_URL, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (response.ok && data.imageUrl) {
                        setCardImage(data.imageUrl);
                    } else {
                        Alert.alert('Error', 'Failed to fetch image: ' + data.message);
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to load image: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            setCardImage(selectedImageUri);
            await AsyncStorage.setItem(IMAGE_STORAGE_KEY, selectedImageUri);

            const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ imageUrl: selectedImageUri }),
            });

            if (!response.ok) {
                Alert.alert('Error', 'Failed to upload image: ' + await response.text());
            }
        }
    };

    // Function to toggle between light and dark mode
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <View style={[styles.Topnavbar, isDarkMode ? styles.darkNavbar : styles.lightNavbar]}>
        
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                <Icon name="bell" size={25} color="white" /> 
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity
                        style={styles.card}
                        onLongPress={pickImage}
                    >
                        <Image
                            source={{ uri: cardImage || DEFAULT_IMAGE_URL }}
                            style={styles.cardImage}
                        />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Card Title </Text>
                            <Text style={styles.cardDescription}>Description for Card 1.</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity
                        style={styles.card1}
                        onLongPress={pickImage}
                    >
                        <View style={styles.cardContentContainer1}>
                            <Image
                                source={{ uri: cardImage || DEFAULT_IMAGE_URL }}
                                style={styles.cardImage1}
                            />
                            <View style={styles.cardContent1}>
                                <Text style={styles.cardTitle1}>Card Title 1</Text>
                                <Text style={styles.cardDescription1}>Description for Card 1.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity
                        style={styles.card2}
                        onLongPress={pickImage}
                    >
                        <View style={styles.cardContentContainer2}>
                            <Image
                                source={{ uri: cardImage || DEFAULT_IMAGE_URL }}
                                style={styles.cardImage2}
                            />
                            <View style={styles.cardContent2}>
                                <Text style={styles.cardTitle2}>Card Title 2</Text>
                                <Text style={styles.cardDescription2}>Description for Card 2.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity
                        style={styles.card3}
                        onLongPress={pickImage}
                    >
                        <View style={styles.cardContentContainer3}>
                            <Image
                                source={{ uri: cardImage || DEFAULT_IMAGE_URL }}
                                style={styles.cardImage3}
                            />
                            <View style={styles.cardContent3}>
                                <Text style={styles.cardTitle3}>Card Title 3</Text>
                                <Text style={styles.cardDescription3}>Description for Card 3.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity
                        style={styles.card4}
                        onLongPress={pickImage}
                    >
                        <View style={styles.cardContentContainer4}>
                            <Image
                                source={{ uri: cardImage || DEFAULT_IMAGE_URL }}
                                style={styles.cardImage4}
                            />
                            <View style={styles.cardContent4}>
                                <Text style={styles.cardTitle4}>Card Title 4</Text>
                                <Text style={styles.cardDescription4}>Description for Card 4.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}


            </ScrollView>
            <View style={[styles.navbar, isDarkMode ? styles.darkNavbar : styles.lightNavbar]}>
                {navItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(item.name)} // Update this line to navigate appropriately
                        style={styles.navItem}
                    >
                        <Icon name={item.icon} size={20} color={isDarkMode ? '#FFD700' : '#ffffff'} />
                        <Text style={[styles.navText, { color: isDarkMode ? '#FFD700' : '#ffffff' }]}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                    <Icon name={isDarkMode ? "sun-o" : "moon-o"} size={30} color={isDarkMode ? '#FFD700' : '#000'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#1E1E1E',
    },
    scrollContainer: {
        padding: 10,
    },
    card: {
        width: 600,
        height: 900,
        borderRadius: 50,
        overflow: 'hidden',
        marginLeft: 40,
        marginBottom: 10,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover',
    },

    cardContent: {
        flex: 1,

        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 30,
        marginBottom: 40,
    },
    cardDescription: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 30,
        marginBottom: 60,
    },
    card1: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center', // Center items vertically
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 50,
        elevation: 3,
        marginTop: 10,
        width:600,
        marginBottom: 10,
        marginLeft:37,
    },
    cardContentContainer1: {
        flexDirection: 'row',
        alignItems: 'center', // vertically centers the content
    },
    cardContent1: {
        flex: 1, // allows the text to fill the remaining space
    },
    cardImage1: {
        width: 200, // adjust the width as needed
        height: 200, // adjust the height as needed
        borderRadius: 30,
        marginRight: 10, // space between image and text
    },
    loadingIndicator: {
        margin: 20,
    },
    cardTitle1: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardDescription1: {
        fontSize: 14,
        color: '#666',
    },
   
    card2: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center', // Center items vertically
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 50,
        elevation: 3,
        marginTop: 10,
        width:600,
        marginBottom: 10,
        marginLeft:37,
    },
    cardContentContainer2: {
        flexDirection: 'row',
        alignItems: 'center', // vertically centers the content
    },
    cardContent2: {
        flex: 1, // allows the text to fill the remaining space
    },
    cardImage2: {
        width: 200, // adjust the width as needed
        height: 200, // adjust the height as needed
        borderRadius: 30,
        marginRight: 10, // space between image and text
    },
    loadingIndicator: {
        margin: 20,
    },
    cardTitle2: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardDescription2: {
        fontSize: 14,
        color: '#666',
    },
    card3: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center', // Center items vertically
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 50,
        elevation: 3,
        marginTop: 10,
        width:600,
        marginBottom: 10,
        marginLeft:37,
    },
    cardContentContainer3: {
        flexDirection: 'row',
        alignItems: 'center', // vertically centers the content
    },
    cardContent3: {
        flex: 1, // allows the text to fill the remaining space
    },
    cardImage3: {
        width: 200, // adjust the width as needed
        height: 200, // adjust the height as needed
        borderRadius: 30,
        marginRight: 10, // space between image and text
    },
    loadingIndicator: {
        margin: 20,
    },
    cardTitle3: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardDescription3: {
        fontSize: 14,
        color: '#666',
    },
    card4: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center', // Center items vertically
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 50,
        elevation: 3,
        marginTop: 10,
        width:600,
        marginBottom: 10,
        marginLeft:37,
    },
    cardContentContainer4: {
        flexDirection: 'row',
        alignItems: 'center', // vertically centers the content
    },
    cardContent4: {
        flex: 1, // allows the text to fill the remaining space
    },
    cardImage4: {
        width: 200, // adjust the width as needed
        height: 200, // adjust the height as needed
        borderRadius: 30,
        marginRight: 10, // space between image and text
    },
    loadingIndicator: {
        margin: 20,
    },
    cardTitle4: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardDescription4: {
        fontSize: 14,
        color: '#666',
    },
   
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    lightNavbar: {
        backgroundColor: '#007BFF',
    },
    darkNavbar: {
        backgroundColor: '#333333',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navText: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    themeToggle: {
        alignItems: 'center',
    },
    Topnavbar: {
        flexDirection: 'row',
        justifyContent: 'right',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    lightNavbar: {
        backgroundColor: '#007BFF',
    },
    darkNavbar: {
        backgroundColor: '#333333',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navText: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    themeToggle: {
        alignItems: 'center',
    },

});

export default AdminHome;
