// app/login.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getUserByCredentials, logAllUsers } from "./database";

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!username || !email || !password) {
            Alert.alert("⚠️ Missing Fields", "Please fill out all fields.");
            return;
        }

        try {
            await logAllUsers();
            const user = await getUserByCredentials(username, email, password);

            if (user) {
                Alert.alert("✅ Login Successful", `Welcome, ${user.username}!`, [
                    { text: "OK", onPress: () => router.push("/register") }, // navigate to your home screen
                ]);

                // optional: clear input fields
                setUsername("");
                setEmail("");
                setPassword("");
            } else {
                Alert.alert("❌ Invalid Credentials", "Username, email, or password is incorrect.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("❌ Error", "Something went wrong while logging in.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar style="dark" backgroundColor="#E0F0FF" />

                <View style={styles.card}>
                    <Text style={styles.title}>Log In</Text>
                    <View style={styles.subtitleRow}>
                        <Text style={styles.subtitle}>Not a member yet? </Text>
                        <TouchableOpacity onPress={() => router.push("/register")}>
                            <Text style={styles.signup}>Sign up now</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="User Name"
                            placeholderTextColor="#6B7280"
                            value={username}
                            onChangeText={setUsername}
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

                    <View style={styles.forgotContainer}>
                        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                            <Text style={styles.forgot}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <Text style={styles.loginText}>Log In</Text>
                    </TouchableOpacity>

                    <Text style={styles.loginWith}>Login with:</Text>

                    <View style={styles.socialRow}>
                        <TouchableOpacity>
                            <Ionicons name="logo-google" size={28} color="#EA4335" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerText}>
                        By continuing to this app you agree to AllMindy Terms of Use and Privacy Policy
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
    forgotContainer: {
        width: "100%",
        alignItems: "flex-end",
        marginBottom: 15,
    },
    forgot: {
        color: "#4F46E5",
        fontSize: 13,
    },
    loginBtn: {
        backgroundColor: "#4F46E5",
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 15,
    },
    loginText: { color: "#fff", fontWeight: "600", fontSize: 16 },
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
    subtitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
});
