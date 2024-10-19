import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Modal,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        const loadImage = async () => {
            try {
                // Fetch theme preference from AsyncStorage
                const storedTheme = await AsyncStorage.getItem('isDarkMode');
                if (storedTheme !== null) {
                    setIsDarkMode(JSON.parse(storedTheme));
                }

                // Fetch initial data here if necessary
                // For example: const response = await fetch('API_URL');
                // const data = await response.json();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, []);

    const data = [
        { id: '1', title: 'Pizza' },
        { id: '2', title: 'Burger' },
        { id: '3', title: 'Samosa' },
    ];

    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(newTheme)); // Persist theme preference
    };

    const debouncedHandleSearch = debounce((query) => {
        setSearchQuery(query);
        if (query) {
            const results = data.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredResults(results);
        } else {
            setFilteredResults([]);
        }
    }, 300);

    const handleSearch = (query) => {
        debouncedHandleSearch(query);
    };

    const handleSearchPress = (item) => {
        console.log('Searching for:', item.title);
        Keyboard.dismiss();
        setIsSearchVisible(false);
        // Navigate to a detailed view or perform an action here
        // For example: navigation.navigate('DetailView', { item });
    };

    const renderSearchOverlay = () => (
        <Modal
            transparent={true}
            visible={isSearchVisible}
            animationType="slide"
            onRequestClose={() => setIsSearchVisible(false)}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onBlur={() => setIsSearchVisible(false)}
                            accessibilityLabel="Search input" // Accessibility
                        />
                        <TouchableOpacity onPress={() => handleSearchPress({ title: searchQuery })}>
                            <Icon name="search" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                    {filteredResults.length === 0 && searchQuery ? (
                        <Text style={styles.noResultsText}>No results found. Please try a different query.</Text>
                    ) : (
                        <FlatList
                            data={filteredResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.resultItem} onPress={() => handleSearchPress(item)}>
                                    <Text style={styles.resultText}>
                                        {item.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => 
                                            part.toLowerCase() === searchQuery.toLowerCase() ? 
                                                <Text key={index} style={styles.highlightText}>{part}</Text> : part
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            <View style={[styles.navbar, isDarkMode ? styles.darkNavbar : styles.lightNavbar]}>
                {[
                    { name: 'search', label: 'Search', onPress: () => setIsSearchVisible(true) },
                    { name: 'plus-circle', label: 'Post' },
                    { name: 'user', label: 'Profile', onPress: () => navigation.navigate('Profile') }
                ].map(({ name, label, onPress }, index) => (
                    <TouchableOpacity key={index} style={styles.postIconContainer} onPress={onPress} accessibilityLabel={label}>
                        <Icon name={name} size={25} color={isDarkMode ? '#FFD700' : '#333333'} />
                        <Text style={[styles.navText, { color: isDarkMode ? '#FFD700' : '#333333' }]}>{label}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                    <Icon name={isDarkMode ? "sun-o" : "moon-o"} size={25} color={isDarkMode ? '#FFD700' : '#000'} />
                </TouchableOpacity>
            </View>
            {renderSearchOverlay()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#1E1E1E',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6.68,
        elevation: 11,
    },
    postIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeToggle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 10,
    },
    lightNavbar: {
        backgroundColor: '#f0f0f0',
    },
    darkNavbar: {
        backgroundColor: '#333333',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        borderRadius: 25,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    noResultsText: {
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
    resultItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    resultText: {
        fontSize: 16,
        color: '#333',
    },
    highlightText: {
        color: '#0000FF',
        fontWeight: 'bold',
    },
    searchContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'top',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});

export default Home;
