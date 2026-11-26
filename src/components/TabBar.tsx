// Barra flutuante tipo "Dynamic Island" (pílula escura em baixo). Dono: Integrador.
import { SymbolView } from 'expo-symbols';
import { Href, router, usePathname } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarVisible } from '@/components/tabs';
import { Pressy } from '@/components/ui';
import { pending } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C } from '@/theme';

type Tab = { href: Href; label: string; icon: string; on: string; web: string; match: string[] };

export const TABS: Tab[] = [
  { href: '/', label: 'Início', icon: 'house', on: 'house.fill', web: '⌂', match: ['/'] },
  { href: '/inbox', label: 'Amigos', icon: 'person.2', on: 'person.2.fill', web: '☺', match: ['/inbox', '/send', '/ask'] },
  { href: '/profile', label: 'All MighT', icon: 'sparkles', on: 'sparkles', web: '✦', match: ['/profile', '/card'] },
  { href: '/discover', label: 'Pessoas', icon: 'person.3', on: 'person.3.fill', web: '◎', match: ['/discover'] },
  { href: '/roles', label: 'Funções', icon: 'briefcase', on: 'briefcase.fill', web: '▤', match: ['/roles'] },
];

const spring = LinearTransition.duration(180).easing(Easing.out(Easing.quad));

export function TabBar() {
  const visible = useTabBarVisible();
  const path = usePathname();
  const nPend = useMight((s) => pending(s.mights).length);
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  return (
    <Animated.View pointerEvents="box-none" entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)}
      style={[st.wrap, { bottom: Math.max(insets.bottom - 6, 12) }]}>
      <Animated.View layout={spring} style={st.pill}>
        {TABS.map((t, i) => {
          const active = t.match.includes(path);
          const plus = i === 2 ? (
            <Pressy key="mood" scaleTo={0.9} instant onPress={() => router.push('/mood')}>
              <View style={st.plus}>
                {Platform.OS === 'ios'
                  ? <SymbolView name="camera.fill" size={19} tintColor={C.onTeal} weight="semibold" fallback={<Text style={st.plusTxt}>+</Text>} />
                  : <Text style={st.plusTxt}>+</Text>}
              </View>
            </Pressy>
          ) : null;
          return [plus, (
            <Pressy key={t.label} scaleTo={0.94} instant onPress={() => { if (!active || path !== t.href) router.navigate(t.href); }}>
              <Animated.View layout={spring} style={[st.item, active && st.itemOn]}>
                <Icon tab={t} active={active} />
                {active ? (
                  <Animated.Text entering={FadeIn.duration(160)} exiting={FadeOut.duration(60)} numberOfLines={1} style={st.label}>
                    {t.label}
                  </Animated.Text>
                ) : null}
                {t.label === 'Amigos' && nPend > 0 && !active ? <View style={st.dot} /> : null}
              </Animated.View>
            </Pressy>
          )];
        })}
      </Animated.View>
    </Animated.View>
  );
}

function Icon({ tab, active }: { tab: Tab; active: boolean }) {
  const color = active ? C.onTeal : '#5E8F92';
  const fallback = <Text style={{ fontSize: 19, color, width: 22, textAlign: 'center' }}>{tab.web}</Text>;
  if (Platform.OS !== 'ios') return fallback;
  return <SymbolView name={(active ? tab.on : tab.icon) as any} size={21} tintColor={color} weight="semibold" fallback={fallback} />;
}

const st = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 2, padding: 6, borderRadius: 999, borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: C.mint100,
    shadowColor: '#04363A', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  item: { height: 48, minWidth: 48, paddingHorizontal: 13, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  itemOn: { backgroundColor: C.teal },
  label: { color: C.onTeal, fontWeight: '600', fontSize: 14, letterSpacing: -0.2 },
  plus: { width: 44, height: 44, marginHorizontal: 2, borderRadius: 22, backgroundColor: C.mint300, alignItems: 'center', justifyContent: 'center' },
  plusTxt: { fontSize: 24, fontWeight: '500', color: C.onTeal, marginTop: -2 },
  dot: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal, borderWidth: 1.5, borderColor: '#FFFFFF' },
});
