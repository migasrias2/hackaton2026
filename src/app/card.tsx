// PASSO 4 · MighT Card: figura, tagline, tags principais, círculos. Retrato ou LinkedIn. PNG. Dono: Pessoa 4.
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useMemo, useRef, useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Figure, Logo } from '@/components/might';
import { Button, Chip, H1, Locked, P, Row, Screen } from '@/components/ui';
import { label } from '@/data/tags';
import { CIRCLE_LABEL, DIM_INFO, DIMS } from '@/data/types';
import { figureFor } from '@/lib/figure';
import { accepted, isUnlocked, topTriple, weightsFrom } from '@/lib/logic';
import { useMight } from '@/store/useMight';
import { C, DIM_COLOR, F } from '@/theme';

type Format = 'retrato' | 'linkedin';

export default function Card() {
  const me = useMight((s) => s.me);
  const mights = useMight((s) => s.mights);
  const [format, setFormat] = useState<Format>('retrato');
  const ref = useRef<any>(null);
  const acc = accepted(mights);
  const top = useMemo(() => topTriple(weightsFrom(acc.map((m) => m.tags))), [acc]);
  const circles = [...new Set(acc.map((m) => CIRCLE_LABEL[m.circle]))];

  if (!isUnlocked(mights) || !top) {
    return (
      <Screen step="Passo 4 de 6 · MighT Card">
        <Locked title="O teu Card ainda está bloqueado" text="Precisas de 3 MighTs aceites para teres provas de quem te conhece."
          cta="VER RECEBIDOS" onPress={() => router.replace('/inbox')} />
      </Screen>
    );
  }

  async function download() {
    try {
      if (Platform.OS === 'web') {
        const uri = await captureRef(ref, { format: 'png', result: 'data-uri' });
        const a = document.createElement('a');
        a.href = uri; a.download = `might-card-${format}.png`; a.click();
        return;
      }
      const uri = await captureRef(ref, { format: 'png', quality: 1, result: 'tmpfile' });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'O meu MighT Card' });
    } catch (e) {
      Alert.alert('Não foi possível gerar o PNG', String(e));
    }
  }

  const wide = format === 'linkedin';
  return (
    <Screen step="Passo 4 de 6 · MighT Card" footer={<>
      <Button title="DESCARREGAR PNG" onPress={download} />
      <Button title="Encontrar pessoas como eu" variant="secondary" onPress={() => router.push('/discover')} />
    </>}>
      <H1>O teu MighT Card</H1>
      <P muted>Tu, pelos olhos dos outros. Publicavas?</P>
      <Row>
        <Chip label="Retrato" selected={!wide} onPress={() => setFormat('retrato')} />
        <Chip label="LinkedIn" selected={wide} onPress={() => setFormat('linkedin')} />
      </Row>

      <View ref={ref} collapsable={false} style={{ borderRadius: 20, overflow: 'hidden', alignSelf: 'center', width: '100%', aspectRatio: wide ? 1.91 : 0.62 }}>
        <LinearGradient colors={[C.blueTop, C.blueBottom]} style={{ flex: 1, padding: 18, flexDirection: wide ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <View style={{ alignItems: 'center', flex: wide ? 1 : undefined }}>
            <Figure figure={figureFor(top)} size={wide ? 150 : 210} />
          </View>
          <View style={{ flex: wide ? 1 : undefined, gap: 8, alignItems: wide ? 'flex-start' : 'center', justifyContent: 'center' }}>
            <Logo white width={70} />
            <Text style={{ fontFamily: F.extrabold, fontSize: wide ? 22 : 26, color: C.light }}>{me.name}</Text>
            {me.tagline ? <Text style={{ fontFamily: F.medium, fontSize: 12, color: C.light, textAlign: wide ? 'left' : 'center' }}>“{me.tagline}”</Text> : null}
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: wide ? 'flex-start' : 'center' }}>
              {DIMS.map((d) => (
                <View key={d} style={{ backgroundColor: DIM_COLOR[d], borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ fontFamily: F.bold, fontSize: 11, color: C.light, textTransform: 'uppercase' }}>{DIM_INFO[d].part} · {label(top[d])}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontFamily: F.regular, fontSize: 11, color: C.light, opacity: 0.85 }}>
              {acc.length} MighTs · {circles.join(' · ')}
            </Text>
          </View>
        </LinearGradient>
      </View>
      <P muted style={{ fontSize: 12, textAlign: 'center' }}>Nenhum MighT fica público sem o teu consentimento.</P>
    </Screen>
  );
}
