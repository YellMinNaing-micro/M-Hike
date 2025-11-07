import React, { useState } from "react";
import {
    Box,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    VStack
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import {
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // for eye icons

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (username === "user" && password === "Password@123") {
        } else {
            console.warn("Invalid credentials!");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar style="dark"/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Box flex={1} justifyContent="center" alignItems="center" p="$5">
                    <VStack space="md" w="90%" alignItems="flex-start">
                        <Text size="3xl" fontWeight="bold" color="$black">
                            Log In
                        </Text>
                        <Text size="md" color="$coolGray500">
                            Enter Explore & Enjoy
                        </Text>

                        <Text size="md" color="$black">
                            User Name
                        </Text>
                        <Input w="100%" size="lg" rounded="$2xl">
                            <InputField
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </Input>

                        <Text size="md" color="$black">
                            Password
                        </Text>
                        <Input w="100%" size="lg" rounded="$2xl">
                            <InputField
                                placeholder="Password"
                                secureTextEntry={!showPassword} // toggle visibility
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </Input>

                        <Button
                            w="100%"
                            size="lg"
                            onPress={handleLogin}
                            rounded="$2xl"
                        >
                            <ButtonText color="$white">Log In</ButtonText>
                        </Button>
                    </VStack>

                    <VStack p="$8" space="md" w="90%" alignItems="center">
                        <TouchableOpacity>
                            <Text size="sm" color="$blue600">
                                Don't have an account?{" "}
                                <Text alignItems="center" fontWeight="bold">
                                    Sign Up
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </VStack>
                </Box>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        position: "absolute",
        right: 15,
        top: "50%",
        transform: [{translateY: -12}], // half of icon size (24 / 2)
    },
});
