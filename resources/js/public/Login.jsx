import { Head, useForm } from "@inertiajs/react";
import { IconLogin } from "@tabler/icons-react";
import LogoImg from "../assets/images/logo.jpg";
import TextInput from "@/components/input/RenderTextInput";
import Button from "@/components/common/Button";
import { doDecrypt } from "@/utils/encrypt";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm("Login", {
        login: "",
        password: "",
        remember: false,
    });
    const globalError =
        errors?.signature || errors?.message || errors?.auth || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post("/login");
        } catch (err) {
            console.log("Login error:", err);
            // Clear password field on error as well
        }
    };


    return (
        <>
            <Head title="Admin Login" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        {/* Logo & Title */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={LogoImg}
                                    alt="Logo"
                                    className="h-20 w-20 rounded-full border-2 border-gray-200"
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Admin Login
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Sign in to access your dashboard
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {globalError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {globalError}
                                </div>
                            )}

                            {/* Login Input (Email/No HP/Username) */}
                            <TextInput
                                label="Email / No HP / Username"
                                type="text"
                                value={data.login}
                                onChange={(val) => setData("login", val)}
                                error={errors.login}
                                placeholder="Email, No HP, atau Username"
                                required
                            />

                            {/* Password Input */}
                            <TextInput
                                label="Password"
                                type="password"
                                value={data.password}
                                onChange={(val) => setData("password", val)}
                                error={errors.password}
                                placeholder="••••••••"
                                required
                            />

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                loading={processing}
                                fullWidth
                                icon={IconLogin}
                                size="md"
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-blue-600 font-medium hover:text-blue-700"
                                >
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-xs">
                            © 2025 Themes App Indonesia. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
