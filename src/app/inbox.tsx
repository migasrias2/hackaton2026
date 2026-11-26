// Recebidos: aceitar ou recusar MighTs (+ botão de demo "da sala"). Dono: Pessoa 3.
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { TagParts } from '@/components/might';
import { Button, Caps, Card, H1, H2, P, Row, Screen } from '@/components/ui';
import { CIRCLE_LABEL } from '@/data/types';
import { accepted, isUnlocked, pending, UNLOCK_AT } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C, F } from '@/theme';

export default function Inbox() {
  const mights = useMight((s) => s.mights);
  const respond = useMight((s) => s.respond);
  const receiveFromRoom = useMight((s) => s.receiveFromRoom);
  const pend = pending(mights);
  const nAcc = accepted(mights).length;
  const open = isUnlocked(mights);

  return (
    <Screen step="Passo 3 de 6 · Recebidos" footer={
      open
        ? <Button title="VER O MEU ALL MIGHT" onPress={() => router.push('/profile')} />
        : <Button title="RECEBER 3 MIGHTS DA SALA (DEMO)" variant="secondary" onPress={() => receiveFromRoom(3)} />
    }>
      <H1>Amigos</H1>
      <Row style={{ flexWrap: 'nowrap' }}>
        <Button title="Manda MighT" onPress={() => router.push('/send')} style={{ flex: 1 }} />
        <Button title="Pede MighT" variant="secondary" onPress={() => router.push('/ask')} style={{ flex: 1 }} />
      </Row>
      <Caps>Recebidos</Caps>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Caps>MighTs aceites</Caps>
          <Text style={{ fontWeight: '800', fontSize: 28, color: open ? C.confirmed : C.dark }}>
            {Math.min(nAcc, UNLOCK_AT)}/{UNLOCK_AT}
          </Text>
        </View>
        <P muted style={{ flex: 1, textAlign: 'right' }}>{open ? 'Perfil desbloqueado!' : 'Aceita 3 para desbloquear o perfil.'}</P>
      </Card>

      {!pend.length ? <P muted>Sem MighTs à espera. Manda ou pede um, ou usa o botão de demo.</P> : null}
      {pend.map((m) => (
        <Card key={m.id} style={{ gap: 10 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <H2>{m.fromName}</H2>
            <Caps style={{ color: C.plum }}>{CIRCLE_LABEL[m.circle]}</Caps>
          </Row>
          <TagParts tags={m.tags} />
          <Row>
            <Button title="ACEITAR" style={{ flex: 1 }} onPress={() => respond(m.id, 'aceite')} />
            <Button title="Recusar" variant="secondary" style={{ flex: 1 }} onPress={() => respond(m.id, 'recusado')} />
          </Row>
        </Card>
      ))}
    </Screen>
  );
}
