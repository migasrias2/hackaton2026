// PASSO 1 · Cria o teu MighT (Self MighT). Dono: Pessoa 2.
// Objetivo: 1.º MighT em < 2 min → nome, 3 tags, "IA" desenha figura + tagline.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Figure, TagGrid, TagParts } from '@/components/might';
import { Button, Caps, H1, Input, P, Screen, Steps } from '@/components/ui';
import { DIM_INFO, DIMS, TagTriple } from '@/data/types';
import { figureFor } from '@/lib/figure';
import { useMight } from '@/store/useMight';
import { C } from '@/theme';

const SELF_Q = {
  personalidade: 'Que palavra descreve melhor a tua personalidade?',
  poder: 'Qual é o teu talento natural?',
  caracter: 'Que valor te define?',
} as const;

type Phase = 'name' | 0 | 1 | 2 | 'loading' | 'done';

export default function Create() {
  const me = useMight((s) => s.me);
  const createSelf = useMight((s) => s.createSelf);
  const startTimer = useMight((s) => s.startTimer);
  const [phase, setPhase] = useState<Phase>('name');
  const [name, setName] = useState(me.name);
  const [tags, setTags] = useState<Partial<TagTriple>>({});

  useEffect(() => { startTimer(); }, [startTimer]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setTimeout(() => { createSelf(name.trim(), tags as TagTriple); setPhase('done'); }, 1400);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'name') {
    return (
      <Screen step="Passo 1 de 6" footer={<Button title="CONTINUAR" disabled={!name.trim()} onPress={() => setPhase(0)} />}>
        <Steps n={4} at={0} />
        <H1>Como te chamas?</H1>
        <P muted>Só o primeiro nome. Ninguém vê o teu MighT sem o teu consentimento.</P>
        <Input value={name} onChangeText={setName} placeholder="O teu primeiro nome" autoFocus
          returnKeyType="next" onSubmitEditing={() => name.trim() && setPhase(0)} />
      </Screen>
    );
  }

  if (phase === 'loading') {
    return (
      <Screen back={false}>
        <View style={{ alignItems: 'center', gap: 16, paddingTop: 80 }}>
          <ActivityIndicator size="large" color={C.tealInk} />
          <H1 style={{ textAlign: 'center', fontSize: 24 }}>A IA está a desenhar o teu MighT…</H1>
        </View>
      </Screen>
    );
  }

  if (phase === 'done' && me.self) {
    const secs = me.createdMs ? Math.round(me.createdMs / 1000) : null;
    return (
      <Screen back={false} step="Passo 1 de 6" footer={<>
        <Button title="MANDA O TEU PRIMEIRO MIGHT" onPress={() => router.replace('/send')} />
        <Button title="Ir para o início" variant="ghost" onPress={() => router.replace('/')} />
      </>}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Caps>O teu Self MighT{secs ? ` · criado em ${secs} s` : ''}</Caps>
          <Figure figure={me.self ? figureFor(me.self) : null} size={260} />
          <H1 style={{ textAlign: 'center', fontSize: 22 }}>“{me.tagline}”</H1>
          <TagParts tags={me.self} />
          <P muted style={{ textAlign: 'center' }}>
            Boa! Já conseguiste. Mas não seria bestial descobrires o que os outros veem em ti?
          </P>
        </View>
      </Screen>
    );
  }

  const i = phase as 0 | 1 | 2;
  const dim = DIMS[i];
  const info = DIM_INFO[dim];
  const next = () => (i < 2 ? setPhase((i + 1) as Phase) : setPhase('loading'));
  return (
    <Screen bg="light" step={`Passo 1 de 6 · ${i + 2}/4`} onBack={() => setPhase(i === 0 ? 'name' : ((i - 1) as Phase))}
      footer={<Button title={i < 2 ? 'SEGUINTE' : 'CRIAR O MEU MIGHT'} disabled={!tags[dim]} onPress={next} />}>
      <Steps n={4} at={i + 1} />
      <Caps>{info.part} · {info.label}</Caps>
      <H1 style={{ fontSize: 24 }}>{SELF_Q[dim]}</H1>
      <P muted>{info.hint}</P>
      <TagGrid dim={dim} value={tags[dim]} onChange={(id) => setTags((t) => ({ ...t, [dim]: id }))} />
    </Screen>
  );
}
