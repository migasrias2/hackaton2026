// Início: boas-vindas (sem MighT) ou saudação + figura + "o que pensam de ti". Dono: Integrador.
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Figure, Logo } from '@/components/might';
import { Button, Card, H1, P, Pressy, Screen } from '@/components/ui';
import { label } from '@/data/tags';
import { DIM_INFO, DIMS } from '@/data/types';
import { received, similarity, weightsFrom } from '@/lib/logic';
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
      <View style={{ gap: 0, alignItems: 'center' }}>
        <Text style={st.hello}>{greeting()},</Text>
        <Text style={st.name}>{me.name || 'Olá'}</Text>
      </View>
      <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center' }}>
        <Pressy scaleTo={0.98} onPress={() => router.navigate('/profile')}>
          <Figure figure={figureFor(me.self)} size={160} />
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

/** "O que pensam de ti": anel 0–100 = quanto os outros te veem como tu te vês
 *  (semelhança entre as tuas 3 tags e as dos MighTs recebidos, exceto recusados).
 *  Anéis pequenos: a palavra mais dada em cada parte e a % de pessoas que a deram. */
function OthersThink() {
  const me = useMight((s) => s.me);
  const mights = useMight((s) => s.mights);
  const got = received(mights).filter((m) => m.status !== 'recusado');

  if (!got.length || !me.self) {
    return (
      <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 24 }}>
        <Text style={st.cardTitle}>O que pensam de ti</Text>
        <P muted style={{ textAlign: 'center' }}>Ainda ninguém te deu um MighT. Pede a quem te conhece.</P>
        <Button title="Pede MighT" variant="secondary" onPress={() => router.push('/ask')} style={{ alignSelf: 'stretch' }} />
      </Card>
    );
  }

  const others = weightsFrom(got.map((m) => m.tags));
  const score = Math.round(similarity(weightsFrom([me.self]), others) * 100);
  const parts = DIMS.map((dim) => {
    const [id, w] = Object.entries(others[dim]).sort((x, y) => y[1] - x[1])[0];
    return { dim, id, v: Math.round(w * 100) };
  });

  return (
    <Card style={{ gap: 14, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', alignItems: 'baseline' }}>
        <Text style={st.cardTitle}>O que pensam de ti</Text>
        <Text style={st.cardSub}>{got.length} MighT{got.length > 1 ? 's' : ''}</Text>
      </View>
      <Ring value={score} size={140} stroke={12} color={C.teal}>
        <Text style={st.big}>{score}</Text>
        <Text style={st.cardSub}>de 100</Text>
      </Ring>
      <P muted style={{ textAlign: 'center', marginTop: -4 }}>
        {score >= 67 ? 'Veem-te como tu te vês.' : score >= 34 ? 'Veem-te em parte como tu te vês.' : 'Veem em ti algo que ainda não vês.'}
      </P>
      <View style={st.row3}>
        {parts.map((p) => (
          <View key={p.dim} style={st.mini}>
            <Ring value={p.v} size={60} stroke={6} color={DIM_COLOR[p.dim]}>
              <Text style={st.miniNum}>{p.v}</Text>
            </Ring>
            <Text style={st.miniWord} numberOfLines={1}>{label(p.id)}</Text>
            <Text style={st.miniPart}>{DIM_INFO[p.dim].part}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const ACircle = Animated.createAnimatedComponent(Circle);

/** Anel de progresso 0–100 que se preenche ao aparecer. */
function Ring({ value, size, stroke, color, children }: { value: number; size: number; stroke: number; color: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const v = useSharedValue(0);
  useEffect(() => { v.value = withTiming(Math.max(0, Math.min(100, value)) / 100, { duration: 700, easing: Easing.out(Easing.cubic) }); }, [value]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - v.value) }));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.mint100} strokeWidth={stroke} fill="none" />
        <ACircle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={`${len} ${len}`} animatedProps={props} rotation={-90} originX={size / 2} originY={size / 2} />
      </Svg>
      {children}
    </View>
  );
}

const st = StyleSheet.create({
  hello: { fontWeight: '400', fontSize: 15, color: C.muted, textAlign: 'center' },
  name: { fontWeight: '700', fontSize: 24, color: C.dark, letterSpacing: -0.5, lineHeight: 30, textAlign: 'center' },
  cardTitle: { fontWeight: '600', fontSize: 17, color: C.dark, letterSpacing: -0.3 },
  cardSub: { fontWeight: '400', fontSize: 13, color: C.muted },
  big: { fontWeight: '700', fontSize: 44, color: C.dark, letterSpacing: -1.5, lineHeight: 48 },
  row3: { flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between' },
  mini: { flex: 1, alignItems: 'center', gap: 4 },
  miniNum: { fontWeight: '700', fontSize: 17, color: C.dark, letterSpacing: -0.5 },
  miniWord: { fontWeight: '600', fontSize: 14, color: C.dark, marginTop: 4 },
  miniPart: { fontWeight: '400', fontSize: 12, color: C.muted },
  reset: { fontWeight: '400', color: C.muted, textAlign: 'center', fontSize: 13 },
});
