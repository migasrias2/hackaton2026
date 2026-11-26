// PASSO 3 · Perfil e All MighT: filtrar por círculo, comparar com o Self MighT. Dono: Pessoa 3.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Figure, TagParts, WeightBars } from '@/components/might';
import { Button, Caps, Card, Chip, H1, H2, Locked, P, Row, Screen } from '@/components/ui';
import { label } from '@/data/tags';
import { CIRCLE_LABEL, Circle, DIM_INFO, DIMS } from '@/data/types';
import { figureFor } from '@/lib/figure';
import { accepted, isUnlocked, topTags, topTriple, UNLOCK_AT, weightsFrom } from '@/lib/logic';
import { useMight } from '@/store/useMight';

export default function Profile() {
  const me = useMight((s) => s.me);
  const mights = useMight((s) => s.mights);
  const [circle, setCircle] = useState<Circle | null>(null);

  const all = accepted(mights);
  const circles = useMemo(() => [...new Set(all.map((m) => m.circle))], [all]);
  const list = accepted(mights, circle);
  const w = useMemo(() => weightsFrom(list.map((m) => m.tags)), [list]);
  const top = topTriple(w);

  if (!isUnlocked(mights)) {
    return (
      <Screen step="Passo 3 de 6 · All MighT">
        <Locked title={`${all.length}/${UNLOCK_AT} MighTs aceites`}
          text="O teu All MighT desbloqueia com 3 MighTs aceites. Manda, pede ou aceita os que já recebeste."
          cta="VER RECEBIDOS" onPress={() => router.replace('/inbox')} />
      </Screen>
    );
  }

  const matches = me.self && top ? DIMS.filter((d) => top[d] === me.self![d]).length : 0;

  return (
    <Screen bg="purple" step="Passo 3 de 6 · All MighT" footer={<>
      <Button title="DESCARREGAR O MEU MIGHT CARD" onPress={() => router.push('/card')} />
      <Button title="Encontrar pessoas como eu" variant="secondary" onPress={() => router.push('/discover')} />
    </>}>
      <H1>All MighT</H1>
      <P muted>A soma de todos os MighTs aceites ({all.length}), de todos os círculos.</P>
      <Row>
        <Chip label="Todos" selected={!circle} onPress={() => setCircle(null)} />
        {circles.map((c) => <Chip key={c} label={CIRCLE_LABEL[c]} selected={circle === c} onPress={() => setCircle(c)} />)}
      </Row>

      {top ? (
        <View style={{ alignItems: 'center', gap: 10 }}>
          <Figure figure={figureFor(top)} size={200} />
          <TagParts tags={top} />
        </View>
      ) : null}

      {me.self && top ? (
        <Card>
          <Caps>Self MighT vs All MighT</Caps>
          <H2>{matches === 3 ? 'Os outros veem-te como tu te vês.' : `Coincides em ${matches} de 3 dimensões.`}</H2>
          {DIMS.filter((d) => top[d] !== me.self![d]).map((d) => (
            <P key={d}>{DIM_INFO[d].label}: tu dizes <P style={{ fontWeight: '700' }}>{label(me.self![d])}</P>, os outros dizem <P style={{ fontWeight: '700' }}>{label(top[d])}</P>.</P>
          ))}
        </Card>
      ) : null}

      {DIMS.map((d) => (
        <Card key={d}>
          <Caps>{DIM_INFO[d].part} · {DIM_INFO[d].label}</Caps>
          <WeightBars dim={d} items={topTags(w, d, 4)} selfId={me.self?.[d]} />
        </Card>
      ))}
      <P muted style={{ fontSize: 12 }}>Peso = nº de vezes que a tag foi dada ÷ total de tags nessa dimensão.</P>
    </Screen>
  );
}
