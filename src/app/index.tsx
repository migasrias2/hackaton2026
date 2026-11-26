// Início: boas-vindas (sem MighT) ou hub com os 6 passos. Dono: Integrador.
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Figure, Logo, TagParts } from '@/components/might';
import { Button, Card, H1, P, Pressy, Screen } from '@/components/ui';
import { accepted, isUnlocked, pending, sent, UNLOCK_AT } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C, F } from '@/theme';

export default function Home() {
  const me = useMight((s) => s.me);
  const mights = useMight((s) => s.mights);
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

  const nAcc = accepted(mights).length;
  const nPend = pending(mights).length;
  const nSent = sent(mights).length;
  const open = isUnlocked(mights);

  const items: { n: string; title: string; sub: string; href: Href; badge?: number }[] = [
    { n: '2A', title: 'Manda MighT', sub: nSent ? `${nSent} enviado(s)` : 'Para receberes, começa por dar', href: '/send' },
    { n: '2B', title: 'Pede MighT', sub: nSent ? 'Envia um link de convite' : 'Disponível depois de enviares', href: '/ask' },
    { n: '↓', title: 'Recebidos', sub: nPend ? `${nPend} à espera de resposta` : 'Aceita ou recusa', href: '/inbox', badge: nPend },
    { n: '3', title: 'All MighT', sub: open ? 'Como os outros te veem' : `${nAcc}/${UNLOCK_AT} MighTs aceites para desbloquear`, href: '/profile' },
    { n: '4', title: 'MighT Card', sub: 'Descarrega e partilha', href: '/card' },
    { n: '5', title: 'Pessoas como tu', sub: 'Por % de semelhança', href: '/discover' },
    { n: '6', title: 'Funções ideais', sub: 'O teu próximo passo', href: '/roles' },
  ];

  return (
    <Screen back={false}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Text style={st.hello}>Olá,</Text>
        <H1>{me.name}</H1>
        <Button title="Ver All MighT" variant="secondary" onPress={() => router.push('/profile')} style={{ height: 38 }} />
        <Animated.View entering={ZoomIn.springify().damping(14)}><Figure figure={me.figure} size={220} /></Animated.View>
        <TagParts tags={me.self} />
        {me.tagline ? <P style={{ textAlign: 'center', fontStyle: 'italic' }}>“{me.tagline}”</P> : null}
      </View>
      <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
        {items.map((it, i) => (
          <Pressy key={it.title} scaleTo={0.985} onPress={() => router.push(it.href)}
            style={[st.row, i < items.length - 1 && st.divider]}>
            <View style={st.num}><Text style={st.numText}>{it.n}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={st.rowTitle}>{it.title}</Text>
              <Text style={st.rowSub}>{it.sub}</Text>
            </View>
            {it.badge ? <View style={st.badge}><Text style={st.badgeText}>{it.badge}</Text></View> : null}
            <Text style={st.chev}>›</Text>
          </Pressy>
        ))}
      </Card>
      <Pressable onPress={reset}><Text style={st.reset}>Recomeçar demo</Text></Pressable>
    </Screen>
  );
}

const st = StyleSheet.create({
  hello: { fontWeight: '400', fontSize: 17, color: C.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: C.surface },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.separator },
  num: { width: 32, height: 32, borderRadius: 9, borderCurve: 'continuous', backgroundColor: C.mint100, alignItems: 'center', justifyContent: 'center' },
  numText: { fontWeight: '700', color: C.tealInk, fontSize: 13 },
  rowTitle: { fontWeight: '500', fontSize: 17, color: C.dark, letterSpacing: -0.3 },
  rowSub: { fontWeight: '400', fontSize: 14, color: C.muted, marginTop: 1 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { fontWeight: '700', color: C.onTeal, fontSize: 13 },
  chev: { fontSize: 24, color: '#C4C4C7', fontWeight: '300' },
  reset: { fontWeight: '400', color: C.muted, textAlign: 'center', fontSize: 13 },
});
