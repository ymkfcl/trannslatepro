const TRAILER_WORDS = [
  'bande annonce',
  'bande-annonce',
  'teaser',
  'trailer',
  'extrait',
  'clip',
  'making of',
];

export const MIN_FILM_MINUTES = 45;
export const MIN_EPISODE_MINUTES = 8;

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const posterFor = (title, kind) => {
  const palette = {
    film: ['141e30', '243b55'],
    'série': ['42275a', '734b6d'],
    'animé': ['0f2027', '2c5364'],
  }[kind] ?? ['141e30', '243b55'];

  return `https://dummyimage.com/320x320/${palette[0]}/${palette[1]}&text=${encodeURIComponent(title)}`;
};

const makeEpisode = (showTitle, kind, season, episode) => {
  const episodeTitle = `${showTitle} — S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
  return {
    id: `${slugify(showTitle)}-s${season}-e${episode}`,
    season,
    episode,
    title: episodeTitle,
    youtubeQuery: `${showTitle} saison ${season} épisode ${episode} français complet YouTube`,
    youtubeId: null,
    thumbnail: posterFor(episodeTitle, kind),
    durationMinutes: null,
    status: 'needs-youtube-id',
  };
};

export const makeSeries = (id, title, type, seasonCount, episodesPerSeason) => {
  const seasons = Array.from({ length: seasonCount }, (_, seasonIndex) => {
    const season = seasonIndex + 1;
    const episodes = Array.from({ length: episodesPerSeason }, (_, episodeIndex) =>
      makeEpisode(title, type, season, episodeIndex + 1),
    );

    return {
      id: `${id}-season-${season}`,
      season,
      title: `Saison ${season}`,
      episodes,
    };
  });

  return {
    id,
    type,
    title,
    year: 1970 + seasonCount + episodesPerSeason,
    language: 'Français',
    youtubeQuery: `${title} épisodes complets français YouTube`,
    youtubeId: null,
    thumbnail: posterFor(title, type),
    durationLabel: `${seasonCount} saison${seasonCount > 1 ? 's' : ''}`,
    seasonCount,
    episodeCount: seasons.reduce((total, season) => total + season.episodes.length, 0),
    seasons,
    status: 'needs-youtube-id',
  };
};

const rawMovies = [
  { id: 'film-01-la-belle-et-la-bete', type: 'film', title: 'La Belle et la Bête', year: 1901, language: 'Français', youtubeQuery: 'film complet français La Belle et la Bête YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-02-le-voyage-dans-la-lune', type: 'film', title: 'Le Voyage dans la Lune', year: 1902, language: 'Français', youtubeQuery: 'film complet français Le Voyage dans la Lune YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-03-le-manoir-du-diable', type: 'film', title: 'Le Manoir du diable', year: 1903, language: 'Français', youtubeQuery: 'film complet français Le Manoir du diable YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-04-le-cabinet-du-docteur-caligari', type: 'film', title: 'Le Cabinet du docteur Caligari', year: 1904, language: 'Français', youtubeQuery: 'film complet français Le Cabinet du docteur Caligari YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-05-nosferatu-le-vampire', type: 'film', title: 'Nosferatu le vampire', year: 1905, language: 'Français', youtubeQuery: 'film complet français Nosferatu le vampire YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-06-metropolis', type: 'film', title: 'Metropolis', year: 1906, language: 'Français', youtubeQuery: 'film complet français Metropolis YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-07-le-mecano-de-la-generale', type: 'film', title: 'Le Mécano de la Générale', year: 1907, language: 'Français', youtubeQuery: 'film complet français Le Mécano de la Générale YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-08-le-kid', type: 'film', title: 'Le Kid', year: 1908, language: 'Français', youtubeQuery: 'film complet français Le Kid YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-09-charlot-soldat', type: 'film', title: 'Charlot soldat', year: 1909, language: 'Français', youtubeQuery: 'film complet français Charlot soldat YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-10-la-ruee-vers-l-or', type: 'film', title: "La Ruée vers l'or", year: 1910, language: 'Français', youtubeQuery: "film complet français La Ruée vers l'or YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-11-le-cirque', type: 'film', title: 'Le Cirque', year: 1911, language: 'Français', youtubeQuery: 'film complet français Le Cirque YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-12-les-temps-modernes', type: 'film', title: 'Les Temps modernes', year: 1912, language: 'Français', youtubeQuery: 'film complet français Les Temps modernes YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-13-le-dictateur', type: 'film', title: 'Le Dictateur', year: 1913, language: 'Français', youtubeQuery: 'film complet français Le Dictateur YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-14-l-aurore', type: 'film', title: "L'Aurore", year: 1914, language: 'Français', youtubeQuery: "film complet français L'Aurore YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-15-intolerance', type: 'film', title: 'Intolérance', year: 1915, language: 'Français', youtubeQuery: 'film complet français Intolérance YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-16-naissance-d-une-nation', type: 'film', title: "Naissance d'une nation", year: 1916, language: 'Français', youtubeQuery: "film complet français Naissance d'une nation YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-17-le-voleur-de-bagdad', type: 'film', title: 'Le Voleur de Bagdad', year: 1917, language: 'Français', youtubeQuery: 'film complet français Le Voleur de Bagdad YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-18-robin-des-bois', type: 'film', title: 'Robin des Bois', year: 1918, language: 'Français', youtubeQuery: 'film complet français Robin des Bois YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-19-le-fantome-de-l-opera', type: 'film', title: "Le Fantôme de l'Opéra", year: 1919, language: 'Français', youtubeQuery: "film complet français Le Fantôme de l'Opéra YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-20-dr-jekyll-et-mr-hyde', type: 'film', title: 'Dr Jekyll et Mr Hyde', year: 1920, language: 'Français', youtubeQuery: 'film complet français Dr Jekyll et Mr Hyde YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-21-la-charrette-fantome', type: 'film', title: 'La Charrette fantôme', year: 1921, language: 'Français', youtubeQuery: 'film complet français La Charrette fantôme YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-22-haxan', type: 'film', title: 'Häxan', year: 1922, language: 'Français', youtubeQuery: 'film complet français Häxan YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-23-le-golem', type: 'film', title: 'Le Golem', year: 1923, language: 'Français', youtubeQuery: 'film complet français Le Golem YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-24-faust', type: 'film', title: 'Faust', year: 1924, language: 'Français', youtubeQuery: 'film complet français Faust YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-25-m-le-maudit', type: 'film', title: 'M le maudit', year: 1925, language: 'Français', youtubeQuery: 'film complet français M le maudit YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-26-la-passion-de-jeanne-d-arc', type: 'film', title: "La Passion de Jeanne d'Arc", year: 1926, language: 'Français', youtubeQuery: "film complet français La Passion de Jeanne d'Arc YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-27-napoleon', type: 'film', title: 'Napoléon', year: 1927, language: 'Français', youtubeQuery: 'film complet français Napoléon YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-28-la-chute-de-la-maison-usher', type: 'film', title: 'La Chute de la maison Usher', year: 1928, language: 'Français', youtubeQuery: 'film complet français La Chute de la maison Usher YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-29-l-age-d-or', type: 'film', title: "L'Âge d'or", year: 1929, language: 'Français', youtubeQuery: "film complet français L'Âge d'or YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-30-a-nous-la-liberte', type: 'film', title: 'À nous la liberté', year: 1930, language: 'Français', youtubeQuery: 'film complet français À nous la liberté YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-31-sous-les-toits-de-paris', type: 'film', title: 'Sous les toits de Paris', year: 1931, language: 'Français', youtubeQuery: 'film complet français Sous les toits de Paris YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-32-la-kermesse-heroique', type: 'film', title: 'La Kermesse héroïque', year: 1932, language: 'Français', youtubeQuery: 'film complet français La Kermesse héroïque YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-33-pepe-le-moko', type: 'film', title: 'Pépé le Moko', year: 1933, language: 'Français', youtubeQuery: 'film complet français Pépé le Moko YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-34-quai-des-brumes', type: 'film', title: 'Quai des brumes', year: 1934, language: 'Français', youtubeQuery: 'film complet français Quai des brumes YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-35-la-grande-illusion', type: 'film', title: 'La Grande Illusion', year: 1935, language: 'Français', youtubeQuery: 'film complet français La Grande Illusion YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-36-la-regle-du-jeu', type: 'film', title: 'La Règle du jeu', year: 1936, language: 'Français', youtubeQuery: 'film complet français La Règle du jeu YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-37-la-bete-humaine', type: 'film', title: 'La Bête humaine', year: 1937, language: 'Français', youtubeQuery: 'film complet français La Bête humaine YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-38-la-chienne', type: 'film', title: 'La Chienne', year: 1938, language: 'Français', youtubeQuery: 'film complet français La Chienne YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-39-boudu-sauve-des-eaux', type: 'film', title: 'Boudu sauvé des eaux', year: 1939, language: 'Français', youtubeQuery: 'film complet français Boudu sauvé des eaux YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-40-zero-de-conduite', type: 'film', title: 'Zéro de conduite', year: 1940, language: 'Français', youtubeQuery: 'film complet français Zéro de conduite YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-41-l-atalante', type: 'film', title: "L'Atalante", year: 1941, language: 'Français', youtubeQuery: "film complet français L'Atalante YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-42-marius', type: 'film', title: 'Marius', year: 1942, language: 'Français', youtubeQuery: 'film complet français Marius YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-43-fanny', type: 'film', title: 'Fanny', year: 1943, language: 'Français', youtubeQuery: 'film complet français Fanny YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-44-cesar', type: 'film', title: 'César', year: 1944, language: 'Français', youtubeQuery: 'film complet français César YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-45-regain', type: 'film', title: 'Regain', year: 1945, language: 'Français', youtubeQuery: 'film complet français Regain YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-46-angele', type: 'film', title: 'Angèle', year: 1946, language: 'Français', youtubeQuery: 'film complet français Angèle YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-47-la-femme-du-boulanger', type: 'film', title: 'La Femme du boulanger', year: 1947, language: 'Français', youtubeQuery: 'film complet français La Femme du boulanger YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-48-topaze', type: 'film', title: 'Topaze', year: 1948, language: 'Français', youtubeQuery: 'film complet français Topaze YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-49-le-schpountz', type: 'film', title: 'Le Schpountz', year: 1949, language: 'Français', youtubeQuery: 'film complet français Le Schpountz YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-50-la-fille-du-puisatier', type: 'film', title: 'La Fille du puisatier', year: 1950, language: 'Français', youtubeQuery: 'film complet français La Fille du puisatier YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-51-remorques', type: 'film', title: 'Remorques', year: 1951, language: 'Français', youtubeQuery: 'film complet français Remorques YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-52-goupi-mains-rouges', type: 'film', title: 'Goupi Mains Rouges', year: 1952, language: 'Français', youtubeQuery: 'film complet français Goupi Mains Rouges YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-53-les-enfants-du-paradis', type: 'film', title: 'Les Enfants du paradis', year: 1953, language: 'Français', youtubeQuery: 'film complet français Les Enfants du paradis YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-54-le-corbeau', type: 'film', title: 'Le Corbeau', year: 1954, language: 'Français', youtubeQuery: 'film complet français Le Corbeau YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-55-casque-d-or', type: 'film', title: "Casque d'or", year: 1955, language: 'Français', youtubeQuery: "film complet français Casque d'or YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-56-orphee', type: 'film', title: 'Orphée', year: 1956, language: 'Français', youtubeQuery: 'film complet français Orphée YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-57-la-belle-et-la-bete-1946', type: 'film', title: 'La Belle et la Bête 1946', year: 1957, language: 'Français', youtubeQuery: 'film complet français La Belle et la Bête 1946 YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-58-les-diaboliques', type: 'film', title: 'Les Diaboliques', year: 1958, language: 'Français', youtubeQuery: 'film complet français Les Diaboliques YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-59-rififi', type: 'film', title: 'Rififi', year: 1959, language: 'Français', youtubeQuery: 'film complet français Rififi YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-60-bob-le-flambeur', type: 'film', title: 'Bob le flambeur', year: 1960, language: 'Français', youtubeQuery: 'film complet français Bob le flambeur YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-61-touchez-pas-au-grisbi', type: 'film', title: 'Touchez pas au grisbi', year: 1961, language: 'Français', youtubeQuery: 'film complet français Touchez pas au grisbi YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-62-du-rififi-chez-les-hommes', type: 'film', title: 'Du rififi chez les hommes', year: 1962, language: 'Français', youtubeQuery: 'film complet français Du rififi chez les hommes YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-63-le-salaire-de-la-peur', type: 'film', title: 'Le Salaire de la peur', year: 1963, language: 'Français', youtubeQuery: 'film complet français Le Salaire de la peur YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-64-un-condamne-a-mort-s-est-echappe', type: 'film', title: "Un condamné à mort s'est échappé", year: 1964, language: 'Français', youtubeQuery: "film complet français Un condamné à mort s'est échappé YouTube", durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-65-mon-oncle', type: 'film', title: 'Mon Oncle', year: 1965, language: 'Français', youtubeQuery: 'film complet français Mon Oncle YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-66-jour-de-fete', type: 'film', title: 'Jour de fête', year: 1966, language: 'Français', youtubeQuery: 'film complet français Jour de fête YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-67-le-quai-des-brumes', type: 'film', title: 'Le Quai des brumes', year: 1967, language: 'Français', youtubeQuery: 'film complet français Le Quai des brumes YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-68-le-trou', type: 'film', title: 'Le Trou', year: 1968, language: 'Français', youtubeQuery: 'film complet français Le Trou YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-69-cleo-de-5-a-7', type: 'film', title: 'Cléo de 5 à 7', year: 1969, language: 'Français', youtubeQuery: 'film complet français Cléo de 5 à 7 YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
  { id: 'film-70-la-jetee', type: 'film', title: 'La Jetée', year: 1970, language: 'Français', youtubeQuery: 'film complet français La Jetée YouTube', durationLabel: 'Film entier', seasonCount: 0, episodeCount: 0 },
];

const rawSeries = [
  makeSeries('serie-01-les-mysteres-de-paris', 'Les Mystères de Paris', 'série', 2, 5),
  makeSeries('serie-02-belphegor', 'Belphégor', 'série', 2, 6),
  makeSeries('serie-03-vidocq', 'Vidocq', 'série', 3, 7),
  makeSeries('serie-04-les-rois-maudits', 'Les Rois maudits', 'série', 2, 4),
  makeSeries('serie-05-thierry-la-fronde', 'Thierry la Fronde', 'série', 2, 5),
  makeSeries('serie-06-les-cinq-dernieres-minutes', 'Les Cinq Dernières Minutes', 'série', 3, 6),
  makeSeries('serie-07-maigret', 'Maigret', 'série', 2, 7),
  makeSeries('serie-08-arsene-lupin', 'Arsène Lupin', 'série', 2, 4),
  makeSeries('serie-09-les-brigades-du-tigre', 'Les Brigades du Tigre', 'série', 3, 5),
  makeSeries('serie-10-cheri-bibi', 'Chéri-Bibi', 'série', 2, 6),
  makeSeries('serie-11-la-demoiselle-d-avignon', "La Demoiselle d'Avignon", 'série', 2, 7),
  makeSeries('serie-12-jacquou-le-croquant', 'Jacquou le Croquant', 'série', 3, 4),
  makeSeries('serie-13-poly', 'Poly', 'série', 2, 5),
  makeSeries('serie-14-bonne-nuit-les-petits', 'Bonne nuit les petits', 'série', 2, 6),
];

const rawAnime = [
  makeSeries('anime-01-remi-sans-famille', 'Rémi sans famille', 'animé', 2, 7),
  makeSeries('anime-02-princesse-sarah', 'Princesse Sarah', 'animé', 3, 8),
  makeSeries('anime-03-heidi', 'Heidi', 'animé', 1, 9),
  makeSeries('anime-04-tom-sawyer', 'Tom Sawyer', 'animé', 2, 10),
  makeSeries('anime-05-les-mysterieuses-cites-d-or', "Les Mystérieuses Cités d'or", 'animé', 3, 6),
  makeSeries('anime-06-ulysse-31', 'Ulysse 31', 'animé', 1, 7),
  makeSeries('anime-07-il-etait-une-fois-la-vie', 'Il était une fois... la Vie', 'animé', 2, 8),
];

const normalizeMovie = (movie) => ({
  ...movie,
  youtubeId: null,
  thumbnail: posterFor(movie.title, movie.type),
  seasons: [],
  status: 'needs-youtube-id',
});

export const catalog = [...rawMovies.map(normalizeMovie), ...rawSeries, ...rawAnime];

export const catalogStats = {
  films: catalog.filter((item) => item.type === 'film').length,
  series: catalog.filter((item) => item.type === 'série').length,
  anime: catalog.filter((item) => item.type === 'animé').length,
  episodes: catalog.reduce((total, item) => total + (item.episodeCount || 0), 0),
};

const hasValidYoutubeId = (value) => typeof value === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(value);

const includesTrailerLanguage = (value = '') => {
  const normalized = value.toLowerCase();
  return TRAILER_WORDS.some((word) => normalized.includes(word));
};

export const classifyContent = (item) => {
  if (item.type === 'animé' || /anim[eé]|manga|cartoon/i.test(item.title)) {
    return 'animé';
  }

  if (item.seasons?.length || /saison|episode|épisode|serie|série/i.test(item.youtubeQuery)) {
    return 'série';
  }

  return 'film';
};

export const isPlayableUnit = (unit, expectedType) => {
  const minimum = expectedType === 'film' ? MIN_FILM_MINUTES : MIN_EPISODE_MINUTES;
  if (!hasValidYoutubeId(unit.youtubeId)) return false;
  if (unit.status && unit.status !== 'active') return false;
  if (includesTrailerLanguage(unit.title) || includesTrailerLanguage(unit.youtubeTitle)) return false;
  if (typeof unit.durationMinutes === 'number' && unit.durationMinutes < minimum) return false;
  return true;
};

export const sanitizeCatalog = (items) => {
  const seen = new Set();

  return items
    .map((item) => ({ ...item, type: classifyContent(item) }))
    .filter((item) => {
      const key = item.youtubeId || item.youtubeQuery || item.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => {
      if (item.type === 'film') {
        return isPlayableUnit(item, 'film') ? item : { ...item, hiddenReason: 'Lien YouTube à valider ou film non entier' };
      }

      const seasons = (item.seasons || [])
        .map((season) => ({
          ...season,
          episodes: season.episodes.filter((episode) => isPlayableUnit(episode, item.type)),
        }))
        .filter((season) => season.episodes.length > 0);

      return seasons.length > 0
        ? { ...item, seasons, episodeCount: seasons.reduce((sum, season) => sum + season.episodes.length, 0) }
        : { ...item, hiddenReason: 'Aucun épisode YouTube entier validé' };
    });
};

export const visibleCatalog = sanitizeCatalog(catalog).filter((item) => !item.hiddenReason);
export const pendingCatalog = sanitizeCatalog(catalog).filter((item) => item.hiddenReason);

export const youtubeThumbnail = (youtubeId, fallback) =>
  hasValidYoutubeId(youtubeId) ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : fallback;

export const youtubeEmbed = (youtubeId) =>
  hasValidYoutubeId(youtubeId)
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    : null;

export const youtubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
