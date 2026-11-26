// "Como me sinto hoje": selfie (opcional) + personagem do estado de espírito + nota. Dono: Integrador.
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Figure } from '@/components/might';
import { Button, Caps, H1, Input, P, Pressy, Screen } from '@/components/ui';
import { MOODS } from '@/lib/figure';
import { useMight } from '@/store/useMight';
import { C, R } from '@/theme';

export default function Mood() {
  const addPost = useMight((s) => s.addPost);
  const [photo, setPhoto] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [perm, requestPerm] = useCameraPermissions();
  const cam = useRef<CameraView>(null);

  // A câmara abre logo ao entrar no ecrã.
  useEffect(() => { if (perm && !perm.granted && perm.canAskAgain) requestPerm(); }, [perm]); // eslint-disable-line react-hooks/exhaustive-deps
  const live = !photo && !!perm?.granted;

  async function snap() {
    try {
      const r = await cam.current?.takePictureAsync({ quality: 0.6 });
      if (r?.uri) setPhoto(r.uri);
    } catch { shoot(); }
  }

  async function shoot() {
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6 };
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) throw new Error('sem câmara');
      const r = await ImagePicker.launchCameraAsync({ ...opts, cameraType: ImagePicker.CameraType.front });
      if (!r.canceled) setPhoto(r.assets[0].uri);
    } catch {
      // Simulador / sem câmara: escolher da galeria.
      const r = await ImagePicker.launchImageLibraryAsync(opts);
      if (!r.canceled) setPhoto(r.assets[0].uri);
    }
  }

  function publish() {
    if (!mood) return;
    addPost(mood, photo, note.trim());
    router.replace('/inbox');
  }

  return (
    <Screen footer={<Button title="Publicar" disabled={!mood} onPress={publish} />}>
      <H1>Como te sentes hoje?</H1>
      {live ? (
        <View style={st.photo}>
          <CameraView ref={cam} facing="front" mirror style={StyleSheet.absoluteFill} />
          <Pressy onPress={snap} scaleTo={0.9} style={st.shutter}><View style={st.shutterIn} /></Pressy>
        </View>
      ) : (
      <Pressy onPress={photo ? () => setPhoto(null) : shoot} style={st.photo}>
        {photo
          ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
          : mood ? <Figure figure={mood} size={150} /> : (
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 34 }}>📷</Text>
              <P muted>Tira uma selfie</P>
            </View>
          )}
        {photo && mood ? <View style={st.badge}><Figure figure={mood} size={56} /></View> : null}
        {photo ? <View style={st.retake}><Text style={st.retakeText}>Repetir</Text></View> : null}
      </Pressy>
      )}
      <Caps>Escolhe a tua personagem</Caps>
      <View style={st.grid}>
        {MOODS.map((m) => {
          const on = mood === m.key;
          return (
            <Pressy key={m.key} scaleTo={0.95} instant onPress={() => setMood(m.key)} style={[st.cell, on && st.cellOn]}>
              <Figure figure={m.key} size={44} />
              <Text style={[st.cellText, on && { color: C.onTeal }]} numberOfLines={1}>{m.label}</Text>
            </Pressy>
          );
        })}
      </View>
      <Input placeholder="Uma frase (opcional)" value={note} onChangeText={setNote} maxLength={80} />
    </Screen>
  );
}

const st = StyleSheet.create({
  photo: {
    alignSelf: 'center', width: 260, height: 260, borderRadius: R.lg, borderCurve: 'continuous', overflow: 'hidden',
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.mint100, alignItems: 'center', justifyContent: 'center',
  },
  badge: { position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, padding: 4 },
  shutter: {
    position: 'absolute', bottom: 12, alignSelf: 'center', width: 56, height: 56, borderRadius: 28,
    borderWidth: 3, borderColor: C.surface, alignItems: 'center', justifyContent: 'center',
  },
  shutterIn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.surface },
  retake: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(4,54,58,0.7)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  retakeText: { color: C.surface, fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: {
    width: '23.2%', alignItems: 'center', paddingVertical: 8, gap: 2, borderRadius: R.sm, borderCurve: 'continuous',
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.separator,
  },
  cellOn: { backgroundColor: C.mint300, borderColor: C.teal },
  cellText: { fontSize: 11, fontWeight: '500', color: C.dark },
});
