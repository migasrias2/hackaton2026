// Início: boas-vindas (sem MighT) ou saudação + figura + "o que pensam de ti". Dono: Integrador.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Figure, Logo } from '@/components/might';
import { Button, Card, H1, P, Pressy, Screen, tap } from '@/components/ui';
import { label } from '@/data/tags';
import { Dim, DIM_INFO, DIMS } from '@/data/types';
import { received } from '@/lib/logic';
import { figureFor } from '@/lib/figure';
import { useMight } from '@/store/useMight';
import { C, DIM_COLOR } from '@/theme';

export default function Home() {
  const me = useMight((s) => s.me);
  const reset = useMight((s) => s.reset);
  const startTimer = useMight((s) => s.startTimer);

  if (!me.self) {
    return (
      <Screen back={false}>
        <View style={{ alignItems: 'center', gap: 16, paddingTop: 20 }}>
          <Logo width={140} />
          <Animated.View entering={FadeIn.duration(800)}><Figure size={240} /></Animated.View>
          <H1 style={{ textAlign: 'center' }}>Vê-te pelos olhos{'\n'}dos outros.</H1>
          <P style={{ textAlign: 'center' }} muted>
            Três palavras de quem te conhece constroem a tua figura. Descobre o teu potencial e as funções que encaixam em ti.
          </P>
        </View>
        <Button title="CRIAR O MEU MIGHT" onPress={() => { startTimer(); router.push('/create'); }} />
        <P muted style={{ textAlign: 'center', fontSize: 13 }}>Demora menos de 2 minutos.</P>
      </Screen>
    );
  }

  return (
    <Screen back={false}>
      <View style={{ gap: 2, paddingTop: 8 }}>
        <Text style={st.hello}>{greeting()},</Text>
        <H1>{me.name || 'Olá'}</H1>
      </View>
      <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center' }}>
        <Pressy scaleTo={0.98} onPress={() => router.navigate('/profile')}>
          <Figure figure={figureFor(me.self)} size={210} />
        </Pressy>
      </Animated.View>
      <OthersThink />
      <Pressable onPress={reset}><Text style={st.reset}>Recomeçar demo</Text></Pressable>
    </Screen>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 6 ? 'Boa noite' : h < 13 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite';
}

/** "O que pensam de ti": barras por tag, agrupadas por Cabeça · Braço · Mão (MighTs recebidos, exceto recusados). */
function OthersThink() {
  const mights = useMight((s) => s.mights);
  const got = received(mights).filter((m) => m.status !== 'recusado');
  const [sel, setSel] = useState<{ dim: Dim; id: string } | null>(null);

  if (!got.length) {
    return (
      <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 24 }}>
        <Text style={st.cardTitle}>O que pensam de ti</Text>
        <P muted style={{ textAlign: 'center' }}>Ainda ninguém te deu um MighT. Pede a quem te conhece.</P>
        <Button title="Pede MighT" variant="secondary" onPress={() => router.push('/ask')} style={{ alignSelf: 'stretch' }} />
      </Card>
    );
  }

  const groups = DIMS.map((dim) => {
    const count: Record<string, number> = {};
    got.forEach((m) => { count[m.tags[dim]] = (count[m.tags[dim]] ?? 0) + 1; });
    const bars = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return { dim, bars };
  });
  const max = Math.max(...groups.flatMap((g) => g.bars.map((b) => b[1])));
  const cur = sel ?? (() => {
    const best = groups.flatMap((g) => g.bars.map(([id, n]) => ({ dim: g.dim, id, n }))).sort((a, b) => b.n - a.n)[0];
    return { dim: best.dim, id: best.id };
  })();
  const curN = groups.find((g) => g.dim === cur.dim)?.bars.find((b) => b[0] === cur.id)?.[1] ?? 0;

  return (
    <Card style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={st.cardTitle}>O que pensam de ti</Text>
        <Text style={st.cardSub}>{got.length} MighT{got.length > 1 ? 's' : ''}</Text>
      </View>
      <View>
        <Text style={st.selWord}>{label(cur.id)}</Text>
        <Text style={st.cardSub}>{DIM_INFO[cur.dim].part} · {curN} de {got.length} pessoa{got.length > 1 ? 's' : ''}</Text>
      </View>
      <View style={st.chart}>
        {groups.map((g) => (
          <View key={g.dim} style={st.group}>
            <View style={st.bars}>
              {g.bars.map(([id, n]) => {
                const on = cur.dim === g.dim && cur.id === id;
                return (
                  <Pressable key={id} onPressIn={() => { tap(); setSel({ dim: g.dim, id }); }} hitSlop={4} style={st.barHit}>
                    <GrowBar h={12 + (n / max) * 96} color={DIM_COLOR[g.dim]} dim={!on} />
                  </Pressable>
                );
              })}
            </View>
            <Text style={st.groupLabel}>{DIM_INFO[g.dim].part}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

function GrowBar({ h, color, dim }: { h: number; color: string; dim: boolean }) {
  const v = useSharedValue(0);
  useEffect(() => { v.value = withTiming(h, { duration: 380, easing: Easing.out(Easing.cubic) }); }, [h]);
  const a = useAnimatedStyle(() => ({ height: v.value }));
  return <Animated.View style={[st.bar, { backgroundColor: color, opacity: dim ? 0.35 : 1 }, a]} />;
}

const st = StyleSheet.create({
  hello: { fontWeight: '400', fontSize: 17, color: C.muted },
  cardTitle: { fontWeight: '600', fontSize: 17, color: C.dark, letterSpacing: -0.3 },
  cardSub: { fontWeight: '400', fontSize: 13, color: C.muted },
  selWord: { fontWeight: '700', fontSize: 24, letterSpacing: -0.5, color: C.dark },
  chart: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  group: { flex: 1, alignItems: 'center', gap: 8 },
  bars: { height: 110, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barHit: { justifyContent: 'flex-end', height: 110 },
  bar: { width: 14, borderRadius: 7 },
  groupLabel: { fontWeight: '500', fontSize: 12, color: C.muted },
  reset: { fontWeight: '400', color: C.muted, textAlign: 'center', fontSize: 13 },
});
