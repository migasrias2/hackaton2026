// PASSO 5 · Pessoas como tu: % de semelhança, tags em comum, maior diferença. Dono: Integrador.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Caps, Card, Chip, H1, H2, Locked, P, Row, Screen } from '@/components/ui';
import { ROLE_BY_ID } from '@/data/roles';
import { PEOPLE } from '@/data/seed';
import { label } from '@/data/tags';
import { DIM_INFO, DIMS, Dim } from '@/data/types';
import { accepted, biggestDiff, commonTags, isUnlocked, pct, similarity, weightsFrom } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C, F } from '@/theme';

export default function Discover() {
  const mights = useMight((s) => s.mights);
  const [dim, setDim] = useState<Dim | null>(null);
  const acc = accepted(mights);
  const mine = useMemo(() => weightsFrom(acc.map((m) => m.tags)), [acc]);

  const ranked = useMemo(() => {
    const dims = dim ? [dim] : DIMS;
    return PEOPLE.map((p) => {
      const w = weightsFrom(p.received.map((r) => r.tags));
      return { p, sim: similarity(mine, w, dims), common: commonTags(mine, w, dims), diff: biggestDiff(mine, w, dims) };
    }).sort((a, b) => b.sim - a.sim);
  }, [mine, dim]);

  if (!isUnlocked(mights)) {
    return (
      <Screen step="Passo 5 de 6 · Descobrir">
        <Locked title="Ainda não te conhecemos bem" text="Com 3 MighTs aceites comparamos o teu All MighT com o de outras pessoas."
          cta="VER RECEBIDOS" onPress={() => router.replace('/inbox')} />
      </Screen>
    );
  }

  return (
    <Screen step="Passo 5 de 6 · Descobrir" footer={<Button title="VER FUNÇÕES IDEAIS" onPress={() => router.push('/roles')} />}>
      <H1>Pessoas como tu</H1>
      <P muted>Ordenadas por % de peso sobreposto com o teu All MighT.</P>
      <Row>
        <Chip label="Todas" selected={!dim} onPress={() => setDim(null)} />
        {DIMS.map((d) => <Chip key={d} label={DIM_INFO[d].label} selected={dim === d} onPress={() => setDim(d)} />)}
      </Row>
      {ranked.slice(0, 10).map(({ p, sim, common, diff }, i) => (
        <Card key={p.id} style={i === 0 ? { borderColor: C.mint300, borderWidth: 1.5 } : undefined}>
          {i === 0 ? <Caps style={{ color: C.plum }}>A pessoa mais parecida contigo</Caps> : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <H2>{p.name}</H2>
              <P muted>{ROLE_BY_ID[p.roleId]?.title}</P>
            </View>
            <Text style={{ fontWeight: '800', fontSize: 26, color: C.plum }}>{pct(sim)}</Text>
          </View>
          {common.length ? <P>Em comum: {common.slice(0, 3).map((c) => label(c.id)).join(', ')}</P> : <P muted>Sem tags em comum.</P>}
          {diff ? <P muted>Maior diferença: {label(diff.id)} ({diff.mine ? 'mais em ti' : `mais em ${p.name.split(' ')[0]}`})</P> : null}
        </Card>
      ))}
    </Screen>
  );
}
