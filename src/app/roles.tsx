// PASSO 6 · Funções e percursos ideais: Agora → Próximo → Desafio + "porque encaixa". Dono: Integrador.
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { Button, Caps, Card, H1, H2, Locked, P, Row, Screen } from '@/components/ui';
import { ROLE_BY_ID, ROLES } from '@/data/roles';
import { PEOPLE } from '@/data/seed';
import { accepted, isUnlocked, pct, roleFit, similarity, weightsFrom, whyFits } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C, F } from '@/theme';

export default function Roles() {
  const mights = useMight((s) => s.mights);
  const acc = accepted(mights);
  const w = useMemo(() => weightsFrom(acc.map((m) => m.tags)), [acc]);

  // Funções das 5 pessoas mais parecidas contigo
  const peers = useMemo(() => PEOPLE
    .map((p) => ({ p, sim: similarity(w, weightsFrom(p.received.map((r) => r.tags))) }))
    .sort((a, b) => b.sim - a.sim).slice(0, 5), [w]);
  const peerCount = (id: string) => peers.filter((x) => x.p.roleId === id).length;

  // Encaixe = peso das tags pedidas pela função + bónus se pessoas como tu a exercem
  const ranked = useMemo(() => ROLES
    .map((r) => ({ r, fit: roleFit(w, r), peers: peerCount(r.id) }))
    .sort((a, b) => (b.fit + b.peers * 0.05) - (a.fit + a.peers * 0.05)), [w, peers]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isUnlocked(mights)) {
    return (
      <Screen step="Passo 6 de 6 · Funções">
        <Locked title="Falta pouco" text="As funções ideais saem do teu All MighT. Precisas de 3 MighTs aceites."
          cta="VER RECEBIDOS" onPress={() => router.replace('/inbox')} />
      </Screen>
    );
  }

  const best = ranked[0];
  return (
    <Screen step="Passo 6 de 6 · Funções" footer={<>
      <Button title="DESCARREGAR O MEU MIGHT CARD" onPress={() => router.push('/card')} />
      <Button title="Voltar ao início" variant="ghost" onPress={() => router.replace('/')} />
    </>}>
      <H1>O teu próximo passo</H1>
      <P muted>São hipóteses para explorar, não veredictos.</P>

      <Card style={{ borderColor: C.plum, borderWidth: 2 }}>
        <Caps style={{ color: C.plum }}>Percurso sugerido</Caps>
        <Row style={{ alignItems: 'stretch', flexWrap: 'nowrap' }}>
          {[['Agora', best.r.title], ['Próximo', best.r.next], ['Desafio', best.r.challenge]].map(([k, v], i) => (
            <View key={k} style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: F.semibold, fontSize: 11, color: C.muted, textTransform: 'uppercase' }}>{i ? '→ ' : ''}{k}</Text>
              <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.dark }}>{v}</Text>
            </View>
          ))}
        </Row>
        <P style={{ fontStyle: 'italic' }}>{whyFits(w, best.r)}</P>
      </Card>

      <Caps>Funções que encaixam em ti</Caps>
      {ranked.slice(0, 3).map(({ r, fit, peers: n }) => (
        <Card key={r.id}>
          <Row style={{ justifyContent: 'space-between' }}>
            <H2 style={{ flex: 1 }}>{r.title}</H2>
            <Text style={{ fontFamily: F.extrabold, fontSize: 20, color: C.plum }}>{pct(fit)}</Text>
          </Row>
          <P muted>{r.blurb}{n ? ` · ${n} das 5 pessoas mais parecidas contigo ${n === 1 ? 'faz' : 'fazem'} isto.` : ''}</P>
          <P>{whyFits(w, r)}</P>
        </Card>
      ))}

      <Caps>O que fazem pessoas como tu</Caps>
      <Card>
        {peers.map(({ p, sim }) => (
          <Row key={p.id} style={{ justifyContent: 'space-between' }}>
            <P>{p.name} · {ROLE_BY_ID[p.roleId]?.title}</P>
            <P muted>{pct(sim)}</P>
          </Row>
        ))}
      </Card>
    </Screen>
  );
}
