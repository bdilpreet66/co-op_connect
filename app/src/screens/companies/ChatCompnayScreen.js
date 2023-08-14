import React, { useState, useCallback, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import theme from '../../theme/theme';
import commonStyles from '../../theme/commonStyles';
import { getAllMessages } from '../../store/company';
import { getUserData } from '../../store/creds';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';

const ChatCompanyScreen = () => {
    const route = useRoute();
    const { company } = route.params;
    const navigation = useNavigation();

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState("");

    const socket = io('http://192.168.0.76:3001');

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const userData = await getUserData();
                setUser(userData._id)

                const companyChatMessages = await getAllMessages(company, userData._id);
                setChatMessages(companyChatMessages);
            })();
        }, [])
    );


    useEffect(() => {
        // Listen for new messages from the server
        socket.on('receive_message', (data) => {
            // Update chatMessages with the new message
            setChatMessages(prevMessages => [...prevMessages, data]);
        });

        return () => {
            // Clean up the socket connection when the component is unmounted
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = async () => {
        if (message.trim() === "") {
            alert("Please enter a message before sending.");
            return;
        }
  
        try {            
            // Emit the message to the server
            socket.emit('send_message', {
                company: company,
                student: user,
                isStudent: true,
                message: message
            });

            setMessage("");  
        } catch (error) {
            console.error("Error sending the message: ", error);
            alert("There was an error sending your message. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.messageContainer}>
                {chatMessages.map((msg) => (
                    <View key={msg._id} style={msg.isStudent ? styles.senderMsg : styles.receiverMsg}>
                        <Text>{msg.message}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                    style={styles.input}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Ionicons name="send" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    messageContainer: {
        flex: 1,
        padding: 10,
    },
    senderMsg: {
        alignSelf: 'flex-end',
        backgroundColor: '#E1FFC7',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    receiverMsg: {
        alignSelf: 'flex-start',
        backgroundColor: '#EAEAEA',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#EEE',
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    sendButton: {
        marginLeft: 10,
    },
});

export default ChatCompanyScreen;
