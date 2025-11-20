import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { updatePassword } from "../lib/database";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleReset = async () => {

        // --- REQUIRED VALIDATION ---
        if (!username || !email || !password) {
            Alert.alert(" Missing Fields", "Please fill all fields.");
            return;
        }

        // --- EMAIL VALIDATION (@gmail.com only) ---
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            Alert.alert(
                " Invalid Email",
                "Email must be a valid @gmail.com address."
            );
            return;
        }

        // --- PASSWORD VALIDATION ---
        const passwordRegex = /^[A-Z][A-Za-z0-9!@#$%^&*()_\-+=<>?/{}~]{7,}$/;
        const numberRegex = /\d/;

        if (!passwordRegex.test(password) || !numberRegex.test(password)) {
            Alert.alert(
                " Invalid Password",
                "Password must:\n• Start with a capital letter\n• Be at least 8 characters\n• Contain at least one number\n• Special characters allowed (optional)"
            );
            return;
        }

        try {
            const success = await updatePassword(username, email, password);

            if (success) {
                Alert.alert(" Password Reset Successful", "You can now log in.", [
                    { text: "OK", onPress: () => router.push("/login") }
                ]);
            } else {
                Alert.alert(" User Not Found", "Check your username and email.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            Alert.alert(" Error", "Something went wrong. Try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" backgroundColor="#E0F0FF" />

                <View style={styles.card}>
                    <Text style={styles.title}>Reset Password</Text>

                    <View style={styles.subtitleRow}>
                        <Text style={styles.subtitle}>Remember your password? </Text>
                        <TouchableOpacity onPress={() => router.push("/login")}>
                            <Text style={styles.loginLink}>Login here.</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Username */}
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

                    {/* Email */}
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

                    {/* Password */}
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            returnKeyType="done"
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

                    {/* Reset Button */}
                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                        <Text style={styles.resetText}>Reset Password</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5,
    },
    subtitleRow: {
        flexDirection: "row",
        marginBottom: 25,
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
    },
    loginLink: {
        color: "#4F46E5",
        fontWeight: "600",
    },
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
    input: {
        height: 45,
        color: "#111827",
    },
    eyeIcon: {
        position: "absolute",
        right: 10,
        top: 12,
    },
    resetBtn: {
        backgroundColor: "#616161",
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        paddingVertical: 12,
        marginTop: 5,
    },
    resetText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
