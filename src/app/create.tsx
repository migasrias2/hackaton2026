// PASSO 1 · Cria o teu MighT (Self MighT). Dono: Pessoa 2.
// Objetivo: 1.º MighT em < 2 min → nome, 5 perguntas de entrada (Sim/Talvez/Não), 3 tags, "IA" desenha figura + tagline.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Figure, TagGrid, TagParts } from '@/components/might';
import { Button, Caps, Card, Choice, H1, H2, Input, P, Screen, Steps } from '@/components/ui';
import { Answer, ANSWER_LABEL, Answers, ANSWERS, PROFILE_QS, profileOf } from '@/data/profile';
import { DIM_INFO, DIMS, TagTriple } from '@/data/types';
import { figureFor } from '@/lib/figure';
import { useMight } from '@/store/useMight';
import { C } from '@/theme';

const SELF_Q = {
  personalidade: 'Que palavras descrevem a tua personalidade?',
  poder: 'Qual é o teu talento natural?',
  caracter: 'Que valor te define?',
} as const;

// 'name' → perguntas q0–q4 → tags 0–2 → loading → done
type Phase = 'name' | `q${number}` | 0 | 1 | 2 | 'loading' | 'done';
const N = 9; // nome + 5 perguntas + 3 tags
const OPTS = ANSWERS.map((k) => ({ key: k, label: ANSWER_LABEL[k] }));

export default function Create() {
  const me = useMight((s) => s.me);
  const createSelf = useMight((s) => s.createSelf);
  const startTimer = useMight((s) => s.startTimer);
  const [phase, setPhase] = useState<Phase>('name');
  const [name, setName] = useState(me.name);
  const [tags, setTags] = useState<Partial<TagTriple>>({});
  const [persona, setPersona] = useState<string[]>([]); // várias tags de personalidade (máx. 3)
  const [answers, setAnswers] = useState<(Answer | undefined)[]>([]);

  useEffect(() => { startTimer(); }, [startTimer]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setTimeout(() => { createSelf(name.trim(), { ...tags, personalidade: persona[0] } as TagTriple, answers as Answers, persona.slice(1)); setPhase('done'); }, 1400);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'name') {
    return (
      <Screen step="Passo 1 de 6" footer={<Button title="CONTINUAR" disabled={!name.trim()} onPress={() => setPhase('q0')} />}>
        <Steps n={N} at={0} />
        <H1>Como te chamas?</H1>
        <P muted>Só o primeiro nome. Ninguém vê o teu MighT sem o teu consentimento.</P>
        <Input value={name} onChangeText={setName} placeholder="O teu primeiro nome" autoFocus
          returnKeyType="next" onSubmitEditing={() => name.trim() && setPhase('q0')} />
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
          <TagParts tags={me.self} extra={me.extra} />
          {me.answers ? (() => { const pr = profileOf(me.answers); return (
            <Card style={{ alignSelf: 'stretch' }}>
              <Caps>O teu perfil na rede</Caps>
              <H2>{pr.profile}</H2>
              <P muted>{pr.desc} Os teus amigos vão confirmar.</P>
            </Card>
          ); })() : null}
          <P muted style={{ textAlign: 'center' }}>
            Boa! Já conseguiste. Mas não seria bestial descobrires o que os outros veem em ti?
          </P>
        </View>
      </Screen>
    );
  }

  if (typeof phase === 'string' && phase.startsWith('q')) {
    const k = Number(phase.slice(1));
    const qd = PROFILE_QS[k];
    const pick = (a: Answer) => {
      setAnswers((x) => { const n = [...x]; n[k] = a; return n; });
      setPhase(k < 4 ? (`q${k + 1}` as Phase) : 0);
    };
    return (
      <Screen bg="light" step={`Passo 1 de 6 · ${k + 2}/${N}`} onBack={() => setPhase(k === 0 ? 'name' : (`q${k - 1}` as Phase))}>
        <Steps n={N} at={k + 1} />
        <Caps>{String(k + 1).padStart(2, '0')} · {qd.tag}</Caps>
        <H1 style={{ fontSize: 24 }}>{qd.self}</H1>
        <Choice options={OPTS} value={answers[k]} onPick={pick} />
      </Screen>
    );
  }

  const i = phase as 0 | 1 | 2;
  const dim = DIMS[i];
  const info = DIM_INFO[dim];
  const multi = dim === 'personalidade';
  const next = () => (i < 2 ? setPhase((i + 1) as Phase) : setPhase('loading'));
  return (
    <Screen bg="light" step={`Passo 1 de 6 · ${i + 7}/${N}`} onBack={() => setPhase(i === 0 ? 'q4' : ((i - 1) as Phase))}
      footer={<Button title={i < 2 ? 'SEGUINTE' : 'CRIAR O MEU MIGHT'} disabled={multi ? !persona.length : !tags[dim]} onPress={next} />}>
      <Steps n={N} at={i + 6} />
      <Caps>{info.part} · {info.label}</Caps>
      <H1 style={{ fontSize: 24 }}>{SELF_Q[dim]}</H1>
      <P muted>{multi ? 'Escolhe até 3 adjetivos. O primeiro define a tua personagem.' : info.hint}</P>
      {multi
        ? <TagGrid dim={dim} values={persona} onChange={(id) => setPersona((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p))} />
        : <TagGrid dim={dim} value={tags[dim]} onChange={(id) => setTags((t) => ({ ...t, [dim]: id }))} />}
    </Screen>
  );
}
