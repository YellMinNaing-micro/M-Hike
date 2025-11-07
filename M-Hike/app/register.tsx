// app/signup.tsx
import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = () => {
        console.log("Signing up...");
        router.push("/login")
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar style="dark" backgroundColor="#E0F0FF" />

                <View style={styles.card}>
                    <Text style={styles.title}>Sign Up</Text>

                    <View style={styles.subtitleRow}>
                        <Text style={styles.subtitle}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/login")}>
                            <Text style={styles.signup}>Log in</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="User Name"
                            placeholderTextColor="#6B7280"
                            value={username}
                            onChangeText={setUsername}
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#6B7280"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            returnKeyType="next"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>

                    <Text style={styles.loginWith}>Sign up with:</Text>

                    <View style={styles.socialRow}>
                        <TouchableOpacity>
                            <Ionicons name="logo-google" size={28} color="#EA4335" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerText}>
                        By signing up you agree to AllMindy Terms of Use and Privacy Policy
                    </Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F0FF",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingVertical: 30,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        alignItems: "center",
    },
    title: { fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 5 },
    subtitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    subtitle: { fontSize: 14, color: "#6B7280" },
    signup: { color: "#4F46E5", fontWeight: "600" },
    inputBox: {
        width: "100%",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        position: "relative",
    },
    input: { height: 45, color: "#111827" },
    eyeIcon: {
        position: "absolute",
        right: 10,
        top: 12,
    },
    signupBtn: {
        backgroundColor: "#4F46E5",
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 15,
    },
    signupText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    loginWith: { color: "#6B7280", marginBottom: 10 },
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginBottom: 20,
    },
    footerText: {
        textAlign: "center",
        fontSize: 11,
        color: "#9CA3AF",
        width: "90%",
    },
});
