import React, { useState } from "react";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    View,
} from "react-native";
import {
    Box,
    Text,
    Button,
    ButtonText,
    VStack,
    HStack,
} from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Log In pressed");
    };

    const handleSignUp = () => {
        console.log("Sign Up pressed");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar style="light" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={require("../assets/images/my-image/home.jpg")}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />

                    <Box flex={1} justifyContent="flex-end" p="$5">
                        <VStack space="lg" alignItems="center" mb="$10">
                            <Text
                                size="2xl"
                                fontWeight="bold"
                                textAlign="center"
                                color="$white"
                            >
                                Take Only Memories While Leaving Only Footprints
                            </Text>
                            <Text size="md" color="$coolGray200" textAlign="center">
                                Record your hike details and observations
                            </Text>

                            {/* Buttons Row */}
                            <HStack
                                w="100%"
                                justifyContent="space-evenly"
                                alignItems="center"
                                mt="$5"
                            >
                                <Button
                                    flex={1}
                                    size="lg"
                                    bg="$indigo600"
                                    rounded="$2xl"
                                    mx="$2"
                                    onPress={handleLogin}
                                >
                                    <ButtonText color="$white">Log In</ButtonText>
                                </Button>

                                <Button
                                    flex={1}
                                    size="lg"
                                    bg="$white"
                                    rounded="$2xl"
                                    borderColor="$indigo600"
                                    borderWidth={1}
                                    mx="$2"
                                    onPress={handleSignUp}
                                >
                                    <ButtonText color="$indigo600">Sign Up</ButtonText>
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: "flex-end",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)", // soft dark overlay for readability
    },
});
