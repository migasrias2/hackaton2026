// PASSO 2B · Pede MighT: link de convite, sem criar conta. Só depois de enviares. Dono: Pessoa 3.
import { router } from 'expo-router';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { Button, Caps, Card, Chip, H1, Input, Locked, P, Row, Screen } from '@/components/ui';
import { CIRCLE_LABEL, CIRCLES, Circle } from '@/data/types';
import { sent } from '@/lib/logic';
import { useMight } from '@/store/useMight';

export default function Ask() {
  const mights = useMight((s) => s.mights);
  const me = useMight((s) => s.me);
  const ask = useMight((s) => s.ask);
  const [name, setName] = useState('');
  const [circle, setCircle] = useState<Circle | null>(null);
  const [link, setLink] = useState<string | null>(null);

  if (!sent(mights).length) {
    return (
      <Screen step="Passo 2 de 6 · Pede">
        <Locked title="Primeiro, dá" text="Para pedires um MighT, começa por enviar um a alguém."
          cta="MANDAR UM MIGHT" onPress={() => router.replace('/send')} />
      </Screen>
    );
  }

  if (link) {
    return (
      <Screen back={false} step="Passo 2 de 6 · Pede" footer={<>
        <Button title="PARTILHAR LINK" onPress={() => Share.share({ message: `${me.name} pediu-te um MighT: 3 palavras para o descrever. ${link}` })} />
        <Button title="Ver recebidos" variant="secondary" onPress={() => router.replace('/inbox')} />
        <Button title="Ir para o início" variant="ghost" onPress={() => router.replace('/')} />
      </>}>
        <View style={{ gap: 12, paddingTop: 30 }}>
          <H1>Boa!</H1>
          <P>Agora é uma questão de tempo. Com 3 MighTs aceites desbloqueias o teu All MighT.</P>
          <Card><P>{link}</P></Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen step="Passo 2 de 6 · Pede"
      footer={<Button title="CRIAR PEDIDO" disabled={!name.trim() || !circle} onPress={() => setLink(ask(name.trim(), circle!))} />}>
      <H1>Pede MighT</H1>
      <P muted>Impaciente? Pede a quem te conhece melhor. A pessoa recebe um link e não precisa de criar conta.</P>
      <Caps>A quem pedes?</Caps>
      <Input value={name} onChangeText={setName} placeholder="Primeiro nome" />
      <Caps>De que círculo?</Caps>
      <Row>{CIRCLES.map((c) => <Chip key={c} label={CIRCLE_LABEL[c]} selected={circle === c} onPress={() => setCircle(c)} />)}</Row>
    </Screen>
  );
}
