// Componentes base partilhados (estilo minimalista tipo iOS). Dono: Design (Pessoa 4).
import * as Haptics from 'expo-haptics';
import { router, usePathname } from 'expo-router';
import { Children, ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TAB_ROOTS, TAB_SPACE, useTabBarVisible } from '@/components/tabs';
import { C, R, SHADOW } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const tap = () => { if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {}); };

/** Toque discreto: ligeira redução de escala e opacidade + vibração leve. */
export function Pressy({ children, onPress, style, disabled, scaleTo = 0.98, instant }: {
  children: ReactNode; onPress?: () => void; style?: any; disabled?: boolean; scaleTo?: number; instant?: boolean;
}) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }], opacity: 1 - (1 - sc.value) * 8 }));
  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => { sc.value = withTiming(scaleTo, { duration: 70 }); tap(); if (instant) onPress?.(); }}
      onPressOut={() => { sc.value = withTiming(1, { duration: 140 }); }}
      onPress={instant ? undefined : onPress}
      style={[style, anim]}>
      {children}
    </AnimatedPressable>
  );
}

/** Texto em maiúsculas → frase normal, mantendo a marca (MighT, All MighT, PNG, LinkedIn). */
function nice(t: string) {
  if (t !== t.toUpperCase()) return t;
  let s = t.toLowerCase();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s
    .replace(/\ball might\b/gi, 'All MighT')
    .replace(/\bmight(s?)\b/gi, 'MighT$1')
    .replace(/\bpng\b/gi, 'PNG')
    .replace(/\blinkedin\b/gi, 'LinkedIn');
}

const enter = (i: number) => FadeIn.delay(Math.min(i, 6) * 25).duration(260).easing(Easing.out(Easing.quad));

export function Screen({ children, back = true, step, footer }: {
  children: ReactNode; bg?: string; back?: boolean; step?: string; footer?: ReactNode;
}) {
  const bar = useTabBarVisible();
  const path = usePathname();
  if (bar && TAB_ROOTS.includes(path)) back = false;
  const pad = bar ? TAB_SPACE : 0;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.wrap}>
          <View style={s.top}>
            {back ? (
              <Pressable hitSlop={14} onPress={() => { tap(); router.canGoBack() ? router.back() : router.replace('/'); }}>
                <Text style={s.back}>‹ Voltar</Text>
              </Pressable>
            ) : <View />}
            {step ? <Text style={s.step}>{step}</Text> : null}
          </View>
          <ScrollView contentContainerStyle={[s.content, !footer && { paddingBottom: 40 + pad }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {Children.toArray(children).map((child, i) => (
              <Animated.View key={i} entering={enter(i)}>{child}</Animated.View>
            ))}
          </ScrollView>
          {footer ? <Animated.View entering={enter(3)} style={[s.footer, { paddingBottom: 12 + pad }]}>{footer}</Animated.View> : null}
        </View>
      </SafeAreaView>
    </View>
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
    <Pressy onPress={onPress} disabled={disabled} scaleTo={variant === 'ghost' ? 0.99 : 0.98}
      style={[s.btn, s[variant], disabled && { opacity: 0.35 }, style]}>
      <Text style={[s.btnText, variant !== 'primary' && { color: C.tealInk }]}>{nice(title)}</Text>
    </Pressy>
  );
}

export function Chip({ label, selected, onPress, color }: {
  label: string; selected?: boolean; onPress?: () => void; color?: string;
}) {
  const on = selected
    ? color ? { backgroundColor: color, borderColor: color } : { backgroundColor: C.mint100, borderColor: C.mint300 }
    : null;
  return (
    <Pressy onPress={onPress} style={[s.chip, on]}>
      <Text style={[s.chipText, selected && { color: color ? C.light : C.onTeal }]}>{label}</Text>
    </Pressy>
  );
}

export const Card = ({ children, style }: { children: ReactNode; style?: ViewStyle }) =>
  <View style={[s.card, style]}>{children}</View>;

export const Row = ({ children, style }: { children: ReactNode; style?: ViewStyle }) =>
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, style]}>{children}</View>;

export const Input = (props: TextInputProps) =>
  <TextInput placeholderTextColor={C.muted} selectionColor={C.teal} {...props} style={[s.input, props.style]} />;

/** Ecrã bloqueado: explica porquê e dá sempre um caminho (sem becos sem saída). */
export function Locked({ title, text, cta, onPress }: { title: string; text: string; cta: string; onPress: () => void }) {
  return (
    <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 32 }}>
      <View style={s.lock}><Text style={{ fontSize: 26 }}>🔒</Text></View>
      <H2 style={{ textAlign: 'center' }}>{title}</H2>
      <P muted style={{ textAlign: 'center' }}>{text}</P>
      <Button title={cta} onPress={onPress} style={{ alignSelf: 'stretch' }} />
    </Card>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, minHeight: 44 },
  back: { fontWeight: '400', color: C.tealInk, fontSize: 17 },
  step: { fontWeight: '500', color: C.muted, fontSize: 13 },
  content: { padding: 20, paddingTop: 4, gap: 16, paddingBottom: 40 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, gap: 6 },
  h1: { fontWeight: '700', fontSize: 34, color: C.dark, letterSpacing: -0.8, lineHeight: 40 },
  h2: { fontWeight: '600', fontSize: 20, color: C.dark, letterSpacing: -0.3 },
  caps: { fontWeight: '500', fontSize: 13, color: C.muted, letterSpacing: 0.2, textTransform: 'uppercase', marginTop: 6, marginLeft: 4 },
  p: { fontWeight: '400', fontSize: 16, lineHeight: 22, color: C.dark, letterSpacing: -0.2 },
  btn: { height: 52, borderRadius: R.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  primary: { backgroundColor: C.teal },
  secondary: { backgroundColor: C.surface, ...SHADOW },
  ghost: { backgroundColor: 'transparent', height: 44 },
  btnText: { fontWeight: '600', color: C.onTeal, fontSize: 17, letterSpacing: -0.2 },
  chip: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.separator },
  chipText: { fontWeight: '500', fontSize: 15, color: C.dark, letterSpacing: -0.1 },
  card: { backgroundColor: C.surface, borderRadius: 22, borderCurve: 'continuous', padding: 18, gap: 8, ...SHADOW },
  input: { height: 50, borderRadius: 14, borderCurve: 'continuous', backgroundColor: C.surface, borderWidth: 1, borderColor: C.separator, paddingHorizontal: 16, fontSize: 17, color: C.dark },
  lock: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.mint100, alignItems: 'center', justifyContent: 'center' },
});
