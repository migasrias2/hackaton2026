// Componentes base partilhados. Dono: Design (Pessoa 4).
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { C, F, R } from '@/theme';

type Bg = 'blue' | 'light' | 'purple';
const BG: Record<Bg, [string, string]> = {
  blue: [C.blueTop, C.bgLight],
  light: [C.bgLight, C.bgLight],
  purple: ['#F3E1F5', '#E2C3E6'],
};

export function Screen({ children, bg = 'blue', back = true, step, footer }: {
  children: ReactNode; bg?: Bg; back?: boolean; step?: string; footer?: ReactNode;
}) {
  return (
    <LinearGradient colors={BG[bg]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.wrap}>
          <View style={s.top}>
            {back ? (
              <Pressable hitSlop={12} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
                <Text style={s.back}>‹ Voltar</Text>
              </Pressable>
            ) : <View />}
            {step ? <Text style={s.step}>{step}</Text> : null}
          </View>
          <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
          {footer ? <View style={s.footer}>{footer}</View> : null}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export const H1 = ({ children, style }: { children: ReactNode; style?: TextStyle }) =>
  <Text style={[s.h1, style]}>{children}</Text>;
export const H2 = ({ children, style }: { children: ReactNode; style?: TextStyle }) =>
  <Text style={[s.h2, style]}>{children}</Text>;
export const Caps = ({ children, style }: { children: ReactNode; style?: TextStyle }) =>
  <Text style={[s.caps, style]}>{children}</Text>;
export const P = ({ children, style, muted }: { children: ReactNode; style?: TextStyle; muted?: boolean }) =>
  <Text style={[s.p, muted && { color: C.muted }, style]}>{children}</Text>;

export function Button({ title, onPress, variant = 'primary', disabled, style }: {
  title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [s.btn, s[variant], disabled && { opacity: 0.4 }, pressed && { opacity: 0.8 }, style]}>
      <Text style={[s.btnText, variant !== 'primary' && { color: C.plum }]}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, color = C.plum }: {
  label: string; selected?: boolean; onPress?: () => void; color?: string;
}) {
  return (
    <Pressable onPress={onPress} style={[s.chip, selected && { backgroundColor: color, borderColor: color }]}>
      <Text style={[s.chipText, selected && { color: C.light }]}>{label}</Text>
    </Pressable>
  );
}

export const Card = ({ children, style }: { children: ReactNode; style?: ViewStyle }) =>
  <View style={[s.card, style]}>{children}</View>;

export const Row = ({ children, style }: { children: ReactNode; style?: ViewStyle }) =>
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, style]}>{children}</View>;

export const Input = (props: TextInputProps) =>
  <TextInput placeholderTextColor={C.muted} {...props} style={[s.input, props.style]} />;

/** Ecrã bloqueado: explica porquê e dá sempre um caminho (sem becos sem saída). */
export function Locked({ title, text, cta, onPress }: { title: string; text: string; cta: string; onPress: () => void }) {
  return (
    <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 28 }}>
      <Text style={{ fontSize: 36 }}>🔒</Text>
      <H2 style={{ textAlign: 'center' }}>{title}</H2>
      <P muted style={{ textAlign: 'center' }}>{text}</P>
      <Button title={cta} onPress={onPress} />
    </Card>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  back: { fontFamily: F.semibold, color: C.dark, fontSize: 15 },
  step: { fontFamily: F.semibold, color: C.plum, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  content: { padding: 20, paddingTop: 4, gap: 14, paddingBottom: 40 },
  footer: { padding: 20, paddingTop: 8, gap: 10 },
  h1: { fontFamily: F.extrabold, fontSize: 30, color: C.dark, letterSpacing: -0.5 },
  h2: { fontFamily: F.bold, fontSize: 20, color: C.dark },
  caps: { fontFamily: F.semibold, fontSize: 12, color: C.dark, letterSpacing: 1.2, textTransform: 'uppercase' },
  p: { fontFamily: F.regular, fontSize: 15, lineHeight: 21, color: C.dark },
  btn: { height: 50, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  primary: { backgroundColor: C.plum },
  secondary: { backgroundColor: C.glass, borderWidth: 1, borderColor: C.plum },
  ghost: { backgroundColor: 'transparent' },
  btnText: { fontFamily: F.bold, color: C.light, fontSize: 15, letterSpacing: 0.5 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: R.sm, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder },
  chipText: { fontFamily: F.semibold, fontSize: 13, color: C.dark, letterSpacing: 0.6, textTransform: 'uppercase' },
  card: { backgroundColor: C.glass, borderRadius: R.md, borderWidth: 1, borderColor: C.glassBorder, padding: 16, gap: 8 },
  input: { height: 50, borderRadius: R.sm, backgroundColor: C.light, paddingHorizontal: 14, fontFamily: F.medium, fontSize: 16, color: C.dark },
});
