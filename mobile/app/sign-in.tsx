import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function SignInScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#0B1020] px-6">
      <Text className="text-center text-xl font-semibold text-white">Sign in</Text>
      <Text className="mt-3 text-center text-sm leading-5 text-slate-400">
        Authentication will use the same `/api/auth` endpoints as the web app.
      </Text>
      <Link href="/" asChild>
        <Pressable className="mt-10 rounded-2xl border border-white/20 px-6 py-3 active:bg-white/10">
          <Text className="text-center font-semibold text-white">Back to home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
