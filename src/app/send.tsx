// PASSO 2A · Manda MighT: uma pessoa, um círculo e 3 tags. Dono: Pessoa 3.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { TagGrid } from '@/components/might';
import { Button, Caps, Card, Chip, H1, H2, Input, P, Row, Screen } from '@/components/ui';
import { PEOPLE } from '@/data/seed';
import { CIRCLE_LABEL, CIRCLES, Circle, DIM_INFO, DIMS, TagTriple } from '@/data/types';
import { useMight } from '@/store/useMight';

export default function Send() {
  const send = useMight((s) => s.send);
  const [q, setQ] = useState('');
  const [to, setTo] = useState<{ id: string; name: string } | null>(null);
  const [circle, setCircle] = useState<Circle | null>(null);
  const [tags, setTags] = useState<Partial<TagTriple>>({});
  const [done, setDone] = useState(false);

  const list = useMemo(
    () => PEOPLE.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6),
    [q],
  );
  const ready = to && circle && DIMS.every((d) => tags[d]);

  if (done && to) {
    return (
      <Screen back={false} step="Passo 2 de 6" footer={<>
        <Button title="PEDE UM MIGHT" onPress={() => router.replace('/ask')} />
        <Button title="Mandar outro" variant="secondary" onPress={() => { setDone(false); setTo(null); setTags({}); setCircle(null); }} />
        <Button title="Ir para o início" variant="ghost" onPress={() => router.replace('/')} />
      </>}>
        <View style={{ alignItems: 'center', gap: 12, paddingTop: 40 }}>
          <H1 style={{ textAlign: 'center' }}>MighT enviado a {to.name.split(' ')[0]}!</H1>
          <P muted style={{ textAlign: 'center' }}>Vais ver que essa pessoa vai retribuir.</P>
        </View>
      </Screen>
    );
  }

  return (
    <Screen step="Passo 2 de 6 · Manda"
      footer={<Button title="ENVIAR MIGHT" disabled={!ready}
        onPress={() => { send(to!, circle!, tags as TagTriple); setDone(true); }} />}>
      <H1>Manda MighT</H1>
      <P muted>Para receberes, começa por dar. Escolhe alguém que conheças bem e em quem vês potencial.</P>

      <Caps>1 · Pessoa</Caps>
      {to ? (
        <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <H2>{to.name}</H2>
          <Button title="Trocar" variant="ghost" onPress={() => setTo(null)} />
        </Card>
      ) : (
        <>
          <Input value={q} onChangeText={setQ} placeholder="Procurar ou escrever um primeiro nome" />
          <Row>
            {list.map((p) => <Chip key={p.id} label={p.name} onPress={() => setTo({ id: p.id, name: p.name })} />)}
            {q.trim() && !list.length ? <Chip label={`+ ${q.trim()}`} onPress={() => setTo({ id: `guest-${q}`, name: q.trim() })} /> : null}
          </Row>
        </>
      )}

      <Caps>2 · De que círculo a conheces?</Caps>
      <Row>{CIRCLES.map((c) => <Chip key={c} label={CIRCLE_LABEL[c]} selected={circle === c} onPress={() => setCircle(c)} />)}</Row>

      {DIMS.map((d, i) => (
        <View key={d} style={{ gap: 8 }}>
          <Caps>{i + 3} · {DIM_INFO[d].part} · {DIM_INFO[d].label}</Caps>
          <P muted>{DIM_INFO[d].question}</P>
          <TagGrid dim={d} value={tags[d]} onChange={(id) => setTags((t) => ({ ...t, [d]: id }))} />
        </View>
      ))}
    </Screen>
  );
}
