import React, { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  catalog,
  catalogStats,
  pendingCatalog,
  sanitizeCatalog,
  youtubeEmbed,
  youtubeSearchUrl,
  youtubeThumbnail,
} from '../streamingCatalog';

const FILTERS = ['tout', 'film', 'série', 'animé'];

function CustomYoutubePlayer({ item, episode }) {
  const unit = episode || item;
  const embedUrl = youtubeEmbed(unit.youtubeId);
  const searchUrl = youtubeSearchUrl(unit.youtubeQuery || item.youtubeQuery);
  const [muted, setMuted] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  const openYoutube = () => Linking.openURL(searchUrl);

  return (
    <View style={styles.playerShell}>
      <View style={styles.playerTopline}>
        <Text style={styles.kicker}>Player personnalisé YouTube</Text>
        <Text style={styles.playerStatus}>{embedUrl ? 'Lecture validée' : 'Validation requise'}</Text>
      </View>

      <View style={styles.playerFrame}>
        {embedUrl ? (
          <WebView
            key={`${unit.id}-${muted}-${playerKey}`}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            source={{ uri: `${embedUrl}&mute=${muted ? 1 : 0}` }}
            style={styles.webView}
          />
        ) : (
          <View style={styles.noVideo}>
            <Text style={styles.noVideoTitle}>Aucune vidéo complète validée</Text>
            <Text style={styles.noVideoCopy}>
              Le contenu reste masqué du player tant qu'un identifiant YouTube officiel, entier, en français et non bande-annonce n'est pas validé.
            </Text>
            <Pressable style={styles.primaryButton} onPress={openYoutube}>
              <Text style={styles.primaryButtonText}>Rechercher la vidéo complète sur YouTube</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.playerControls}>
        <Pressable style={styles.controlButton} onPress={() => setPlayerKey((value) => value + 1)}>
          <Text style={styles.controlText}>Recharger</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={() => setMuted((value) => !value)}>
          <Text style={styles.controlText}>{muted ? 'Activer le son' : 'Muet'}</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={openYoutube}>
          <Text style={styles.controlText}>Ouvrir YouTube</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ContentCard({ item, selected, onPress }) {
  const thumbnail = youtubeThumbnail(item.youtubeId, item.thumbnail);

  return (
    <Pressable style={[styles.card, selected && styles.cardSelected]} onPress={onPress}>
      <Image source={{ uri: thumbnail }} style={styles.poster} />
      <View style={styles.cardBody}>
        <Text style={styles.badge}>{item.type}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.language} • {item.durationLabel}</Text>
        <Text style={item.hiddenReason ? styles.warningText : styles.readyText}>
          {item.hiddenReason || 'Prêt à regarder'}
        </Text>
      </View>
    </Pressable>
  );
}

function EpisodeList({ item, selectedEpisode, setSelectedEpisode }) {
  if (item.type === 'film') return null;

  return (
    <View style={styles.episodesPanel}>
      <Text style={styles.sectionTitle}>Saisons et épisodes</Text>
      {(item.seasons || []).map((season) => (
        <View key={season.id} style={styles.seasonBlock}>
          <Text style={styles.seasonTitle}>{season.title}</Text>
          <View style={styles.episodeGrid}>
            {season.episodes.map((episode) => (
              <Pressable
                key={episode.id}
                style={[styles.episodePill, selectedEpisode?.id === episode.id && styles.episodePillActive]}
                onPress={() => setSelectedEpisode(episode)}
              >
                <Text style={styles.episodeText}>Épisode {episode.episode}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
      {(!item.seasons || item.seasons.length === 0) && (
        <Text style={styles.noVideoCopy}>Tous les épisodes sont masqués jusqu'à validation automatique.</Text>
      )}
    </View>
  );
}

export default function Index() {
  const [filter, setFilter] = useState('tout');
  const [query, setQuery] = useState('');
  const curated = useMemo(() => sanitizeCatalog(catalog), []);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return curated.filter((item) => {
      const matchesType = filter === 'tout' || item.type === filter;
      const matchesTerm = !term || item.title.toLowerCase().includes(term);
      return matchesType && matchesTerm;
    });
  }, [curated, filter, query]);
  const [selectedId, setSelectedId] = useState(curated[0]?.id);
  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || curated[0];
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>StreamTube FR</Text>
            <Text style={styles.heroTitle}>Catalogue streaming YouTube en français</Text>
            <Text style={styles.heroText}>
              70 films, 14 séries et 7 animés structurés avec saisons, épisodes, miniatures et validation anti-bande-annonce avant diffusion.
            </Text>
            <View style={styles.statsRow}>
              <Text style={styles.stat}>{catalogStats.films} films</Text>
              <Text style={styles.stat}>{catalogStats.series} séries</Text>
              <Text style={styles.stat}>{catalogStats.anime} animés</Text>
              <Text style={styles.stat}>{catalogStats.episodes} épisodes</Text>
            </View>
          </View>
          <View style={styles.auditBox}>
            <Text style={styles.auditTitle}>Contrôle automatique</Text>
            <Text style={styles.auditLine}>• Supprime les doublons par lien YouTube</Text>
            <Text style={styles.auditLine}>• Retire bandes-annonces, extraits et vidéos trop courtes</Text>
            <Text style={styles.auditLine}>• Reclasse film, série et animé avant affichage</Text>
            <Text style={styles.auditLine}>• Masque bannière et player si la vidéo est non fonctionnelle</Text>
          </View>
        </View>

        <CustomYoutubePlayer item={selected} episode={selectedEpisode} />

        {selected && (
          <View style={styles.detailPanel}>
            <Image source={{ uri: youtubeThumbnail(selected.youtubeId, selected.thumbnail) }} style={styles.detailPoster} />
            <View style={styles.detailText}>
              <Text style={styles.badge}>{selected.type}</Text>
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={styles.cardMeta}>{selected.language} • {selected.durationLabel}</Text>
              <Text style={styles.detailCopy}>
                {selected.hiddenReason
                  ? `Masqué automatiquement: ${selected.hiddenReason}. Ajoutez un youtubeId validé pour publier ce contenu.`
                  : 'Disponible dans le player personnalisé.'}
              </Text>
            </View>
          </View>
        )}

        <EpisodeList item={selected} selectedEpisode={selectedEpisode} setSelectedEpisode={setSelectedEpisode} />

        <View style={styles.toolbar}>
          <TextInput
            style={styles.search}
            placeholder="Rechercher un film, une série ou un animé"
            placeholderTextColor="#8ea0bb"
            value={query}
            onChangeText={setQuery}
          />
          <View style={styles.filters}>
            {FILTERS.map((value) => (
              <Pressable
                key={value}
                style={[styles.filterButton, filter === value && styles.filterButtonActive]}
                onPress={() => setFilter(value)}
              >
                <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              selected={selected?.id === item.id}
              onPress={() => {
                setSelectedId(item.id);
                setSelectedEpisode(null);
              }}
            />
          ))}
        </View>

        <View style={styles.pendingBox}>
          <Text style={styles.pendingTitle}>{pendingCatalog.length} contenus masqués par sécurité</Text>
          <Text style={styles.pendingCopy}>
            Les lignes restent dans le catalogue éditorial mais ne sont pas diffusées tant que la vidéo YouTube entière en français n'est pas confirmée.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#08111f' },
  page: { padding: 18, gap: 22, maxWidth: 1280, alignSelf: 'center', width: '100%' },
  hero: { flexDirection: Platform.select({ web: 'row', default: 'column' }), gap: 18, alignItems: 'stretch' },
  heroCopy: { flex: 1, backgroundColor: '#101b31', borderRadius: 28, padding: 28, borderWidth: 1, borderColor: '#1d3155' },
  eyebrow: { color: '#8dd8ff', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  heroTitle: { color: '#ffffff', fontSize: 42, lineHeight: 48, fontWeight: '900' },
  heroText: { color: '#c7d5ee', fontSize: 16, lineHeight: 25, marginTop: 14, maxWidth: 760 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  stat: { color: '#ffffff', backgroundColor: '#1b2b4b', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, fontWeight: '800' },
  auditBox: { width: Platform.select({ web: 360, default: '100%' }), backgroundColor: '#0d2430', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: '#1f6072' },
  auditTitle: { color: '#7ef3c5', fontSize: 20, fontWeight: '900', marginBottom: 12 },
  auditLine: { color: '#d7fff2', lineHeight: 24 },
  playerShell: { backgroundColor: '#050b14', borderRadius: 28, padding: 16, borderWidth: 1, borderColor: '#223957' },
  playerTopline: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  kicker: { color: '#93c5fd', fontWeight: '900' },
  playerStatus: { color: '#fbbf24', fontWeight: '800' },
  playerFrame: { minHeight: 360, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000000' },
  webView: { flex: 1, minHeight: 360, backgroundColor: '#000000' },
  noVideo: { minHeight: 360, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noVideoTitle: { color: '#ffffff', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  noVideoCopy: { color: '#b7c6df', textAlign: 'center', marginTop: 12, lineHeight: 22, maxWidth: 680 },
  primaryButton: { marginTop: 20, backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 13, paddingHorizontal: 18 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900' },
  playerControls: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  controlButton: { backgroundColor: '#17233a', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: '#2b456d' },
  controlText: { color: '#dbeafe', fontWeight: '800' },
  detailPanel: { flexDirection: Platform.select({ web: 'row', default: 'column' }), gap: 18, backgroundColor: '#101827', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#27364f' },
  detailPoster: { width: 160, height: 160, borderRadius: 20, backgroundColor: '#18243a' },
  detailText: { flex: 1, justifyContent: 'center' },
  detailTitle: { color: '#ffffff', fontSize: 30, fontWeight: '900', marginTop: 8 },
  detailCopy: { color: '#cbd5e1', lineHeight: 22, marginTop: 10 },
  episodesPanel: { backgroundColor: '#0f172a', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#243047' },
  sectionTitle: { color: '#ffffff', fontSize: 22, fontWeight: '900', marginBottom: 12 },
  seasonBlock: { marginBottom: 16 },
  seasonTitle: { color: '#93c5fd', fontWeight: '900', marginBottom: 8 },
  episodeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  episodePill: { backgroundColor: '#152238', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2d4368' },
  episodePillActive: { backgroundColor: '#2563eb', borderColor: '#60a5fa' },
  episodeText: { color: '#eff6ff', fontWeight: '800' },
  toolbar: { gap: 12 },
  search: { color: '#ffffff', backgroundColor: '#101827', borderColor: '#263a5c', borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 16 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#111c30', borderWidth: 1, borderColor: '#273a5f' },
  filterButtonActive: { backgroundColor: '#f8fafc' },
  filterText: { color: '#dbeafe', fontWeight: '900', textTransform: 'capitalize' },
  filterTextActive: { color: '#0f172a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: { width: Platform.select({ web: 238, default: '100%' }), backgroundColor: '#101827', borderRadius: 22, padding: 12, borderWidth: 1, borderColor: '#22344f' },
  cardSelected: { borderColor: '#60a5fa', backgroundColor: '#13233d' },
  poster: { width: '100%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#1b2b44' },
  cardBody: { paddingTop: 12, gap: 6 },
  badge: { alignSelf: 'flex-start', overflow: 'hidden', color: '#082f49', backgroundColor: '#bae6fd', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 9, fontWeight: '900', textTransform: 'uppercase', fontSize: 11 },
  cardTitle: { color: '#ffffff', fontSize: 17, fontWeight: '900', minHeight: 44 },
  cardMeta: { color: '#9fb1cc', fontWeight: '700' },
  warningText: { color: '#fca5a5', fontSize: 12, lineHeight: 17 },
  readyText: { color: '#86efac', fontSize: 12, fontWeight: '900' },
  pendingBox: { backgroundColor: '#201923', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#6b263a' },
  pendingTitle: { color: '#fecdd3', fontWeight: '900', fontSize: 18 },
  pendingCopy: { color: '#ffe4e6', marginTop: 8, lineHeight: 22 },
});
