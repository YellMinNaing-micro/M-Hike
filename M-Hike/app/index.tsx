import React from "react";
import {
    ImageBackground,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    View,
} from "react-native";
import { Box, Text, Button, ButtonText, VStack, HStack } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function IndexScreen() {
    const router = useRouter();
    const handleLogin = () => router.replace("/login");
    const handleSignUp = () => router.replace("/register");

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar style="light"/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Top 70% - Image */}
                    <ImageBackground
                        source={require("../assets/images/my-image/home.jpg")}
                        style={styles.topSection}
                        resizeMode="cover"
                    >
                        <View style={styles.overlay}/>
                    </ImageBackground>

                    {/* Bottom 30% - Buttons & Text */}
                    <Box flex={2} bg="$white" p="$5" justifyContent="center">
                        <VStack space="lg" alignItems="center">
                            <Text size="2xl" fontWeight="bold" textAlign="center" color="$black">
                                Bring Back Only Memories Let Footprints Be Your Legacy.
                            </Text>
                            <Text size="md" color="$black" textAlign="center">
                                Record your hike details and observations
                            </Text>

                            <HStack w="100%" justifyContent="space-evenly" alignItems="center">
                                <Button
                                    flex={1}
                                    size="lg"
                                    bg="#616161"           // custom gray background
                                    rounded="$full"
                                    mx="$2"
                                    onPress={handleLogin}
                                >
                                    <ButtonText color="$white">Log In</ButtonText>
                                </Button>

                                <Button
                                    flex={1}
                                    size="lg"
                                    bg="#616161"
                                    rounded="$full"
                                    borderColor="#616161"   // gray border
                                    borderWidth={1}
                                    mx="$2"
                                    onPress={handleSignUp}
                                >
                                    <ButtonText color="$white">Sign Up</ButtonText>
                                </Button>
                            </HStack>

                        </VStack>
                    </Box>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        flex: 9, // 70%
        justifyContent: "flex-end",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
});
