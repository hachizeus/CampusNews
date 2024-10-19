import React, { useState } from 'react';
import {View, Text, Button, TextInput, Image, ScrollView, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as mime from 'mime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 


const PostScreen = () => {
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const [uploading, setUploading] = useState(false);

    const selectMedia = async () => {
        try {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
                return Alert.alert('Permission required', 'Please grant access to your media library.');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0];
                setSelectedMedia(asset.uri);
                const fileExtension = asset.uri.split('.').pop().toLowerCase();
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    setMediaType('image');
                } else if (['mp4', 'mov', 'avi', 'mkv'].includes(fileExtension)) {
                    setMediaType('video');
                }
            }
        } catch (error) {
            console.warn('Media selection error:', error);
        }
    };

    const uploadMedia = async () => {
        if (!selectedMedia) {
            return Alert.alert('No media selected', 'Please select an image or video before posting.');
        }
        if (!caption.trim() || !tags.trim() || !location.trim()) {
            return Alert.alert('Incomplete form', 'Please fill in all fields before posting.');
        }
    
        setUploading(true);
    
        try {
            const fileInfo = await FileSystem.getInfoAsync(selectedMedia);
            const mimeType = mime.getType(fileInfo.uri);
            const fileName = fileInfo.uri.split('/').pop();
    
            const formData = new FormData();
            formData.append('media', { uri: selectedMedia, name: fileName, type: mimeType });
            formData.append('caption', caption.trim());
            formData.append('tags', tags.trim());
            formData.append('location', location.trim());
            const fetchData = async () => {
                const token = await AsyncStorage.getItem("@token");
            
                try {
                    const response = await axios.get("http://192.168.1.4:5000/protected-route", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Handle response data
                } catch (error) {
                    // Handle error (e.g., token expired, unauthorized)
                }
            };
            
    
            const response = await fetch("http://192.168.1.4:5000/api/upload", {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Add the token here
                },
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to upload');
            }
    
            Alert.alert('Success', 'Your post has been uploaded!');
            resetForm();
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload error', error.message || 'Something went wrong during the upload.');
        } finally {
            setUploading(false);
        }
    };
    
    const resetForm = () => {
        setSelectedMedia(null);
        setMediaType(null);
        setCaption('');
        setTags('');
        setLocation('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Create a Post</Text>
            <Button title="Select Photo or Video" onPress={selectMedia} accessibilityLabel="Select media from your library" />

            {selectedMedia && (
                <View>
                    {mediaType === 'image' ? (
                        <Image source={{ uri: selectedMedia }} style={styles.media} />
                    ) : (
                        <Video
                            source={{ uri: selectedMedia }}
                            style={styles.media}
                            useNativeControls
                            resizeMode="contain"
                            isLooping
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Add a caption..."
                        value={caption}
                        onChangeText={setCaption}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Add tags (comma separated)..."
                        value={tags}
                        onChangeText={setTags}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Add location..."
                        value={location}
                        onChangeText={setLocation}
                    />
                    {uploading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button title="Post" onPress={uploadMedia} accessibilityLabel="Upload the selected media" />
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    media: {
        width: '100%',
        height: 300,
        marginVertical: 10,
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default PostScreen;
