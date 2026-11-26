// PASSO 2A · Manda MighT, em assistente: pessoa → círculo → Cabeça → Braço → Mão. Dono: Pessoa 3.
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Figure, TagGrid, TagParts } from '@/components/might';
import { Button, Caps, Chip, H1, Input, P, Pressy, Row, Screen, Steps } from '@/components/ui';
import { PEOPLE } from '@/data/seed';
import { CIRCLE_LABEL, CIRCLES, Circle, DIM_INFO, DIMS, TagTriple } from '@/data/types';
import { figureFor } from '@/lib/figure';
import { useMight } from '@/store/useMight';
import { C, R } from '@/theme';

const N = 5; // 0 pessoa · 1 círculo · 2–4 tags

export default function Send() {
  const send = useMight((s) => s.send);
  const params = useLocalSearchParams<{ to?: string; name?: string }>();
  const preset = params.to && params.name ? { id: params.to, name: params.name } : null;
  const [step, setStep] = useState(preset ? 1 : 0);
  const [q, setQ] = useState('');
  const [to, setTo] = useState<{ id: string; name: string } | null>(preset);
  const [circle, setCircle] = useState<Circle | null>(null);
  const [tags, setTags] = useState<Partial<TagTriple>>({});
  const [done, setDone] = useState(false);

  const list = useMemo(() => PEOPLE.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8), [q]);
  const first = to?.name.split(' ')[0] ?? '';
  const back = () => (step > 0 ? setStep(step - 1) : router.back());

  if (done && to) {
    return (
      <Screen back={false} step="Passo 2 de 6" footer={<>
        <Button title="PEDE UM MIGHT" onPress={() => router.replace('/ask')} />
        <Button title="Mandar outro" variant="secondary" onPress={() => { setDone(false); setTo(null); setTags({}); setCircle(null); setStep(0); }} />
        <Button title="Ir para o início" variant="ghost" onPress={() => router.replace('/')} />
      </>}>
        <View style={{ alignItems: 'center', gap: 12, paddingTop: 20 }}>
          <Figure figure={figureFor(tags as TagTriple)} size={200} />
          <H1 style={{ textAlign: 'center' }}>MighT enviado a {first}!</H1>
          <TagParts tags={tags as TagTriple} />
          <P muted style={{ textAlign: 'center' }}>Vais ver que essa pessoa vai retribuir.</P>
        </View>
      </Screen>
    );
  }

  const label = `Passo 2 de 6 · ${step + 1}/${N}`;

  // 1 · Pessoa
  if (step === 0) {
    const pick = (p: { id: string; name: string }) => { setTo(p); setStep(1); };
    return (
      <Screen step={label} onBack={back}>
        <Steps n={N} at={0} />
        <H1>A quem mandas?</H1>
        <P muted>Para receberes, começa por dar. Escolhe alguém que conheças bem e em quem vês potencial.</P>
        <Input value={q} onChangeText={setQ} placeholder="Procurar ou escrever um primeiro nome" />
        <View style={{ gap: 8 }}>
          {list.map((p) => (
            <Pressy key={p.id} instant onPress={() => pick({ id: p.id, name: p.name })}
              style={{ backgroundColor: C.surface, borderRadius: R.md, borderCurve: 'continuous', paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: C.separator }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: C.dark }}>{p.name}</Text>
            </Pressy>
          ))}
          {q.trim() && !list.length ? <Chip label={`+ ${q.trim()}`} onPress={() => pick({ id: `guest-${q}`, name: q.trim() })} /> : null}
        </View>
      </Screen>
    );
  }

  // 2 · Círculo
  if (step === 1) {
    return (
      <Screen step={label} onBack={back} footer={<Button title="SEGUINTE" disabled={!circle} onPress={() => setStep(2)} />}>
        <Steps n={N} at={1} />
        <H1>De onde conheces {first}?</H1>
        <Row>{CIRCLES.map((c) => <Chip key={c} label={CIRCLE_LABEL[c]} selected={circle === c} onPress={() => setCircle(c)} />)}</Row>
      </Screen>
    );
  }

  // 3–5 · Cabeça · Braço · Mão
  const i = step - 2;
  const d = DIMS[i];
  const last = i === DIMS.length - 1;
  return (
    <Screen step={label} onBack={back} footer={
      <Button title={last ? 'ENVIAR MIGHT' : 'SEGUINTE'} disabled={!tags[d]}
        onPress={() => (last ? (send(to!, circle!, tags as TagTriple), setDone(true)) : setStep(step + 1))} />
    }>
      <Steps n={N} at={step} />
      <Caps>{DIM_INFO[d].part} · {DIM_INFO[d].label}</Caps>
      <H1 style={{ fontSize: 24 }}>{ask(DIM_INFO[d].question, first)}</H1>
      <TagGrid dim={d} value={tags[d]} onChange={(id) => setTags((t) => ({ ...t, [d]: id }))} />
    </Screen>
  );
}

/** "Qual é o talento natural?" → "Qual é o talento natural de Ana?" */
function ask(q: string, name: string) {
  return /esta pessoa/i.test(q) ? q.replace(/esta pessoa/i, name) : q.replace(/\?$/, ` de ${name}?`);
}
