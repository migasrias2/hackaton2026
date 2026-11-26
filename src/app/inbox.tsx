// Recebidos: aceitar ou recusar MighTs (+ botão de demo "da sala"). Dono: Pessoa 3.
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Figure, TagParts } from '@/components/might';
import { Button, Caps, Card, H1, H2, P, Row, Screen } from '@/components/ui';
import { CIRCLE_LABEL, Post } from '@/data/types';
import { moodLabel } from '@/lib/figure';
import { accepted, isUnlocked, pending, UNLOCK_AT } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C, R } from '@/theme';

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
      <Caps>Hoje</Caps>
      <Feed />
      <Caps>Recebidos</Caps>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Caps>MighTs aceites</Caps>
          <Text style={{ fontWeight: '800', fontSize: 28, color: open ? C.tealInk : C.dark }}>
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
            <Caps style={{ color: C.tealInk }}>{CIRCLE_LABEL[m.circle]}</Caps>
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

/** Feed "Como me sinto hoje": as publicações (minhas e dos amigos de demo). */
function Feed() {
  const posts = useMight((s) => s.posts);
  return (
    <View style={{ gap: 12 }}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <H2>Como te sentes hoje?</H2>
          <P muted>Tira uma selfie e escolhe a personagem.</P>
        </View>
        <Button title="Publicar" onPress={() => router.push('/mood')} />
      </Card>
      {posts.map((p) => <PostCard key={p.id} p={p} />)}
    </View>
  );
}

function PostCard({ p }: { p: Post }) {
  const mine = p.personId === 'me';
  return (
    <Card style={{ gap: 10, padding: 12 }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={fs.name}>{mine ? 'Tu' : p.name}</Text>
        <Text style={fs.time}>{ago(p.createdAt)}</Text>
      </Row>
      <View style={fs.media}>
        {p.photo
          ? <Image source={{ uri: p.photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
          : <Figure figure={p.mood} size={170} />}
        <View style={fs.badge}>
          {p.photo ? <Figure figure={p.mood} size={26} /> : null}
          <Text style={fs.badgeTxt}>{moodLabel(p.mood)}</Text>
        </View>
      </View>
      {p.note ? <P>{p.note}</P> : null}
      {!mine ? <Button title="Manda-lhe um MighT" variant="secondary" onPress={() => router.push({ pathname: '/send', params: { to: p.personId, name: p.name } })} /> : null}
    </Card>
  );
}

function ago(t: number) {
  const m = Math.max(1, Math.round((Date.now() - t) / 60000));
  return m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.round(m / 60)} h` : `há ${Math.round(m / 1440)} d`;
}

const fs = StyleSheet.create({
  name: { fontWeight: '600', fontSize: 16, color: C.dark, letterSpacing: -0.2 },
  time: { fontSize: 13, color: C.muted },
  media: { height: 220, borderRadius: R.md, borderCurve: 'continuous', overflow: 'hidden', backgroundColor: C.mint50, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.94)' },
  badgeTxt: { fontWeight: '600', fontSize: 13, color: C.tealInk },
});
