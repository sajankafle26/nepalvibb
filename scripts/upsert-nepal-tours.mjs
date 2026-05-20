/**
 * upsert-nepal-tours.mjs
 *
 * Upserts all Nepal tours from the live website into MongoDB.
 * Reads itinerary data from scraped-itineraries.json.
 * If a tour with the same slug exists → update it.
 * If not → create it.
 *
 * Usage: node scripts/upsert-nepal-tours.mjs
 */

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      process.env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
    }
  } catch (e) {
    console.error('Could not read .env.local:', e.message);
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌  MONGODB_URI missing'); process.exit(1); }

// ─── Read itineraries ────────────────────────────────────────────────────────
const itinerariesPath = join(__dirname, '..', 'scraped-itineraries.json');
const itineraries = JSON.parse(readFileSync(itinerariesPath, 'utf-8'));

// ─── Tour data scraped from https://nepalvibb.com/destination/nepal/ ─────────
// All tours from the live Nepal destination page (pages 1 & 2)
const nepalTours = [
  {
    slug: 'ama-yangri-trek',
    title: 'Fantastisk 5-dagers tur til Aama Yangri fra Kathmandu',
    destination: 'Nepal',
    duration: '5 dager',
    difficulty: 'Moderat',
    price: 16000,
    image: 'https://nepalvibb.com/wp-content/uploads/2026/04/IMG_5233-scaled.jpg',
    category: 'Trekking',
    summary: 'Aama Yangri er perfekt for reisende som vil oppleve Himalaya på en kort, vakker og meningsfull måte. På bare fem dager kan man reise fra hovedstadens travle gater til en hellig fjelltopp omgitt av bønneflagg og Himalaya-panorama.',
    overview: '<p>Aama Yangri er perfekt for reisende som vil oppleve Himalaya på en kort, vakker og meningsfull måte. På bare fem dager kan man reise fra hovedstadens travle gater til en hellig fjelltopp omgitt av bønneflagg og Himalaya-panorama.</p><p>Turen tar deg gjennom sjarmerende Sherpa-landsbyer, tett skog og åpne fjellsider med spektakulær utsikt over Langtang-massivet og Helambu-regionen. Toppen (3771 moh) er hellig for lokalbefolkningen og prydet med fargerike bønneflagg.</p>',
    highlights: [
      'Hellig fjelltopp Aama Yangri (3771 moh)',
      'Panoramautsikt over Himalaya',
      'Sherpa-kultur og autentiske landsbyer',
      'Passer for nybegynnere og familier',
      'Kun 5 dager fra Kathmandu'
    ],
    priceIncludes: [
      'Alle transporter i Nepal',
      'Guide og bærer',
      'Overnatting (tehus)',
      'Alle måltider under trekken',
      'Alle nødvendige tillatelser og nasjonalparkkort'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Drikkevarer og snacks',
      'Tips til guide og bærer'
    ],
    isFeatured: false,
  },
  {
    slug: 'unik-homestay-opplevelse',
    title: 'Unik Homestay-Kulturelle Opplevelse',
    destination: 'Nepal',
    duration: '10 dager',
    difficulty: 'Lett',
    price: 18000,
    image: 'https://nepalvibb.com/wp-content/uploads/2022/01/village-life.jpg',
    category: 'Turer',
    summary: 'Å bo på homestay gir deg en helt spesiell opplevelse av Nepal. Du bor hos en lokal familie, spiser tradisjonell mat og lærer om hverdagslivet deres. Det er en varm og ekte måte å bli kjent med kulturen på.',
    overview: '<p>Å bo på homestay gir deg en helt spesiell opplevelse av Nepal. Du bor hos en lokal familie, spiser tradisjonell mat og lærer om hverdagslivet deres. Det er en varm og ekte måte å bli kjent med kulturen på.</p><p>Du får se hvordan folk lever, jobber og feirer – ikke som turist, men som gjest. Mange homestays ligger i vakre fjellområder eller landsbyer. Du våkner til natur, stillhet og ekte gjestfrihet. En homestay gir minner for livet.</p>',
    highlights: [
      'Bo hos ekte nepalsk vertsfamilie',
      'Tradisjonell mat og matlagingskurs',
      'Besøk historiske steder i Kathmandu-dalen',
      'Lokal kulturimmersjon',
      'Guidet tur i sjarmerende landsbyer'
    ],
    priceIncludes: [
      'Homestay-overnatting',
      'Alle måltider hos vertsfamilien',
      'Kulturguide',
      'Transport mellom destinasjoner',
      'Inngangsavgifter til historiske steder'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips'
    ],
    isFeatured: false,
  },
  {
    slug: 'annapurna-circuit-trek',
    title: 'Oppdag Magien ved Annapurna Circuit Trek',
    destination: 'Nepal',
    duration: '14 dager',
    difficulty: 'Krevende',
    price: 15400,
    image: 'https://nepalvibb.com/wp-content/uploads/2022/01/annapurna-scaled.jpg',
    category: 'Trekking',
    summary: 'Med to uker på Annapurna Circuit kan du fullføre hele ruten og få med deg uforglemmelige avstikkere underveis. Denne klassiske reisen tar deg gjennom noen av Nepals mest spektakulære landskap, med god tid til å vandre, utforske og oppleve den rike kulturen i Himalaya.',
    overview: '<p>Med to uker på Annapurna Circuit kan du fullføre hele ruten og få med deg uforglemmelige avstikkere underveis. Denne klassiske reisen tar deg gjennom noen av Nepals mest spektakulære landskap.</p><p>Du krysser det berømte Thorong La-passet (5 416 moh) og vandrer gjennom varierte landskap fra subtropisk jungel til arktisk ødemark. Annapurna Circuit regnes som en av verdens beste trekker.</p>',
    highlights: [
      'Kryss Thorong La-passet (5 416 moh)',
      'Besøk det hellige Muktinath-tempelet',
      'Varierte landskap fra jungel til snø',
      'Rike kultur- og naturopplevelser',
      'Manang-akklimatisering og lokalsamfunn'
    ],
    priceIncludes: [
      'Alle transporter i Nepal',
      'Erfaren trekking-guide',
      'Overnatting (tehus)',
      'Alle måltider under trekken',
      'ACAP-tillatelse og TIMS-kort'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips til guide og bærer',
      'Ekstra aktiviteter'
    ],
    isFeatured: true,
  },
  {
    slug: 'langtang-valley-trek',
    title: 'Oppdag Skjønnheten i Himalaya: Langtang Valley Trek',
    destination: 'Nepal',
    duration: '10 dager',
    difficulty: 'Moderat',
    price: 18000,
    image: 'https://nepalvibb.com/wp-content/uploads/2019/11/langtang-trek-2.webp',
    category: 'Trekking',
    summary: 'Langtang Valley Trek er en fantastisk fjelltur i Nepal som passer perfekt for deg som elsker natur og stillhet. Du vandrer gjennom vakre daler, høye fjell og hyggelige landsbyer der folk tar deg imot med et smil.',
    overview: '<p>Langtang Valley Trek er en fantastisk fjelltur i Nepal som passer perfekt for deg som elsker natur og stillhet. Du vandrer gjennom vakre daler, høye fjell og hyggelige landsbyer.</p><p>Her slipper du de store turistmengdene, og får en mer ekte og fredelig opplevelse. Utsikten til de snødekte Himalaya-toppene er rett og slett magisk, og turen byr på både naturopplevelser og kulturelle møter.</p>',
    highlights: [
      'Fredelig og lite besøkt trekkrute',
      'Kyanjin Gompa-klosteret og ostemeieribesøk',
      'Spektakulær utsikt til Langtang Lirung (7227 moh)',
      'Tamang-kulturopplevelse',
      'Tserko Ri utsiktstopp (4984 moh)'
    ],
    priceIncludes: [
      'Alle transporter i Nepal',
      'Erfaren guide',
      'Overnatting (tehus)',
      'Alle måltider under trekken',
      'Langtang nasjonalpark-tillatelse'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips'
    ],
    isFeatured: false,
  },
  {
    slug: 'yoga-trek',
    title: 'Yoga og Meditasjonsretrett i Nepal',
    destination: 'Nepal',
    duration: '10 dager',
    difficulty: 'Lett',
    price: 19000,
    image: 'https://nepalvibb.com/wp-content/uploads/2019/11/yoga.webp',
    category: 'Turer',
    summary: 'Bli med på en transformerende yoga- og meditasjonsretrett i Nepal, midt i Himalayas fredelige omgivelser. Her får du mulighet til å koble av fra hverdagens stress og vende oppmerksomheten innover.',
    overview: '<p>Bli med på en transformerende yoga- og meditasjonsretrett i Nepal, midt i Himalayas fredelige omgivelser. Her får du mulighet til å koble av fra hverdagens stress og vende oppmerksomheten innover.</p><p>Med daglige yogaøkter, dyp meditasjon og nærvær i naturen åpner du rom for indre ro og klarhet. Retretten passer for både nybegynnere og erfarne, og gir deg tid og rom til å finne tilbake til deg selv.</p>',
    highlights: [
      'Daglige yoga- og pranayama-økter',
      'Guidet meditasjon i himalayaomgivelser',
      'Ayurveda-workshop og selvpleie',
      'Besøk til buddhistiske klostre',
      'Dag med stillhet (Mauna-praksis)'
    ],
    priceIncludes: [
      'Alle yogaøkter og meditasjoner',
      'Retrettovernatting',
      'Vegetariske ayurvediske måltider',
      'Kulturelle utflukter og guiding',
      'Retrettsertifikat'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips'
    ],
    isFeatured: false,
  },
  {
    slug: 'poon-hill-annapurna-base-camp-trek',
    title: 'Poon Hill og Annapurna Base Camp Trek',
    destination: 'Nepal',
    duration: '14 dager',
    difficulty: 'Moderat',
    price: 10000,
    image: 'https://nepalvibb.com/wp-content/uploads/2019/11/Annapurna-Base-Camp-Trek.jpg',
    category: 'Trekking',
    summary: 'PoonHill og Annapurna base camp kombinasjonsturen gir deg den beste utsikt av Himalayas skjønnhet, lokal gjestfrihet og naturlig magi. Enten du reiser alene, med venner eller i gruppe, lover vi en trygg og uforglemmelig opplevelse.',
    overview: '<p>PoonHill og Annapurna base camp kombinasjonsturen gir deg den beste utsikt av Himalayas skjønnhet, lokal gjestfrihet og naturlig magi.</p><p>Turen kombinerer to av Nepals mest populære trekkruter til én storslått opplevelse. Du starter med soloppgang fra Poon Hill (3210 moh) og avslutter på Annapurna Base Camp (4130 moh) omringet av 360 graders Himalaya-panorama.</p>',
    highlights: [
      'Soloppgang fra Poon Hill (3210 moh)',
      'Annapurna Base Camp (4130 moh)',
      'Machhapuchhare Base Camp',
      'Varme kilder i Jhinu Danda',
      'Rhododendronskog og fjellkultur'
    ],
    priceIncludes: [
      'Alle transporter i Nepal',
      'Erfaren guide og bærer',
      'Overnatting (tehus)',
      'Alle måltider under trekken',
      'ACAP-tillatelse og TIMS-kort'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips'
    ],
    isFeatured: true,
  },
  {
    slug: 'everest-base-camp-trek',
    title: 'Everest Base Camp Trek – En Livsforvandlende Reise',
    destination: 'Nepal',
    duration: '14 dager',
    difficulty: 'Krevende',
    price: 14000,
    image: 'https://nepalvibb.com/wp-content/uploads/2022/01/IMG_3349-scaled.jpg',
    category: 'Trekking',
    summary: 'Oppfyll drømmen om Everest! Å vandre til Everest Base Camp er mer enn en fysisk prestasjon – det er en reise inn i deg selv. Du får utfordret grenser, skapt varige minner og kjent på ekte mestringsfølelse.',
    overview: '<p>Oppfyll drømmen om Everest! Å vandre til Everest Base Camp er mer enn en fysisk prestasjon – det er en reise inn i deg selv. Du får utfordret grenser, skapt varige minner og kjent på ekte mestringsfølelse.</p><p>Turen tar deg fra Lukla (2840 moh) gjennom dramatiske Himalaya-landskap til det legendariske Everest Base Camp (5364 moh). Underveis passerer du sjarmerende Sherpa-landsbyer, hellige klostre og hengefergebroer. Høydepunktet er utsikten fra Kala Patthar i soloppgang.</p>',
    highlights: [
      'Everest Base Camp (5364 moh)',
      'Soloppgang fra Kala Patthar (5545 moh)',
      'Tengboche-klosteret og Sherpa-kultur',
      'Sagarmatha nasjonalpark',
      'Namche Bazaar – Everest-regionens hjerte'
    ],
    priceIncludes: [
      'Lukla flytur tur/retur',
      'Alle transporter i Nepal',
      'Erfaren Sherpa-guide og bærer',
      'Overnatting (tehus)',
      'Alle måltider under trekken',
      'Sagarmatha nasjonalpark-tillatelse og TIMS-kort'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Høydekammerdeksel',
      'Tips til guide og bærer'
    ],
    isFeatured: true,
  },
  {
    slug: 'dolpo-trek',
    title: 'Eventyepakke: Mystiske Dolpo – Himalayas Skjulte Perle',
    destination: 'Nepal',
    duration: '19 dager',
    difficulty: 'Svært krevende',
    price: 28000,
    image: 'https://nepalvibb.com/wp-content/uploads/2022/01/annpurna-circle.webp',
    category: 'Trekking',
    summary: 'Dolpo er mer enn et trekkingmål. Det er en reise inn i en annen virkelighet – en verden der naturen hersker, tiden står stille og menneskelige forbindelser betyr mer enn teknologi og komfort.',
    overview: '<p>Dolpo er mer enn et trekkingmål. Det er en reise inn i en annen virkelighet – en verden der naturen hersker, tiden står stille og menneskelige forbindelser betyr mer enn teknologi og komfort.</p><p>Dette avsidesliggende området nordvest i Nepal er en av de siste uberørte regionene i Himalaya. Her finner du den turkisblå Phoksundo-innsjøen, gammel Bön-kultur og dramatiske høyfjellspassasjer over 5000 moh.</p>',
    highlights: [
      'Den turkisblå Phoksundo-innsjøen',
      'Kryss Numa La (5310 moh) og Baga La (5190 moh)',
      'Gammel Bön-buddhisme og lokale gompaer',
      'Spektakulær Dolpo-natur',
      'Dho Tarap – et av Nepals mest isolerte samfunn'
    ],
    priceIncludes: [
      'Alle innenriks flyreiser (Kathmandu-Nepalgunj-Juphal)',
      'Alle transporter i Nepal',
      'Erfaren guide og kokk',
      'Teltleir og utstyr',
      'Alle måltider',
      'Spesialtillatelse for Dolpo'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips'
    ],
    isFeatured: false,
  },
  {
    slug: 'motorsykkeltur-upper-mustang-nepal',
    title: 'Motorsykkeltur til Upper Mustang i Nepal',
    destination: 'Nepal',
    duration: '12 dager',
    difficulty: 'Moderat',
    price: 30000,
    image: 'https://nepalvibb.com/wp-content/uploads/2019/11/mountain-biker-in-himalayas-mountains-2024-09-23-07-25-07-utc-scaled.jpg',
    category: 'Turer',
    summary: 'Bli med på en spektakulær motorsykkeltur til Upper Mustang – et av Nepals mest avsidesliggende og vakre områder. Utforsk «det skjulte kongeriket Lo» med sine ørkenlandskap, gamle klostre og ekte tibetansk kultur.',
    overview: '<p>Bli med på en spektakulær motorsykkeltur til Upper Mustang – et av Nepals mest avsidesliggende og vakre områder. Utforsk «det skjulte kongeriket Lo» med sine ørkenlandskap, gamle klostre og ekte tibetansk kultur.</p><p>Turen byr på rå kjøreopplevelser gjennom fjellpass og grusveier. Du møter lokalbefolkning og får oppleve en kultur som nesten ikke er endret på hundrevis av år. En eventyrlig reise for deg som elsker både motorsykkel og natur!</p>',
    highlights: [
      'Lo Manthang – Upper Mustangs kongeby',
      'Dramatiske ørkenlandskap og kløfter',
      'Tibetansk klosterkultur',
      'Muktinath-tempelet',
      'Rå fjellkjøring på grusveier'
    ],
    priceIncludes: [
      'Motorsykkelleie (Royal Enfield / KTM)',
      'Erfaren guide og mekaniker',
      'Alle overnatting',
      'Alle måltider',
      'Upper Mustang spesialtillatelse'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Drivstoffkostnader',
      'Tips'
    ],
    isFeatured: false,
  },
  {
    slug: '6-dager-poonhill-trek',
    title: 'Ghorepani Poonhill Trek – 6 Dager',
    destination: 'Nepal',
    duration: '6 dager',
    difficulty: 'Lett til Moderat',
    price: 7000,
    image: 'https://nepalvibb.com/wp-content/uploads/2019/11/nepal-223001_1280.jpg',
    category: 'Trekking',
    summary: 'Poon Hill Trek er en kort og vakker fottur i Annapurna-regionen i Nepal. Turen passer for alle med normal form og byr på fantastisk utsikt mot Himalaya. Høydepunktet er soloppgang fra Poon Hill (3210 moh).',
    overview: '<p>Poon Hill Trek er en kort og vakker fottur i Annapurna-regionen i Nepal. Turen passer for alle med normal form og byr på fantastisk utsikt mot Himalaya.</p><p>Høydepunktet er soloppgang fra Poon Hill (3 210 moh), med panoramautsikt over fjell som Annapurna og Dhaulagiri. Du går gjennom sjarmerende landsbyer og blomstrende skoger, og opplever ekte nepalsk fjellkultur. En perfekt introduksjon til trekking i Nepal!</p>',
    highlights: [
      'Soloppgang fra Poon Hill (3210 moh)',
      'Panoramautsikt over Annapurna og Dhaulagiri',
      'Ghorepani og Gurung-landsbyer',
      'Rhododendronskog',
      'Perfekt for nybegynnere'
    ],
    priceIncludes: [
      'Transport Pokhara–Nayapul og Ghandruk–Pokhara',
      'Erfaren guide',
      'Overnatting (tehus)',
      'Alle måltider under trekken',
      'ACAP-tillatelse og TIMS-kort'
    ],
    priceExcludes: [
      'Internasjonale flyreiser',
      'Reiseforsikring',
      'Personlige utgifter',
      'Tips'
    ],
    isFeatured: false,
  },
];

// ─── Attach itineraries ───────────────────────────────────────────────────────
for (const tour of nepalTours) {
  tour.itinerary = itineraries[tour.slug] || [];
}

// ─── Run upsert ──────────────────────────────────────────────────────────────
async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('\n✅  Connected to MongoDB\n');

    const db = client.db();
    const toursCollection = db.collection('tours');

    let created = 0;
    let updated = 0;

    for (const tour of nepalTours) {
      const existing = await toursCollection.findOne({ slug: tour.slug });

      if (existing) {
        // Update – preserve _id and timestamps, overwrite everything else
        const { _id, createdAt, ...rest } = existing;
        const merged = { ...rest, ...tour, updatedAt: new Date() };
        delete merged._id;

        await toursCollection.updateOne(
          { slug: tour.slug },
          { $set: merged }
        );

        console.log(`   🔄  Updated  "${tour.title}" — ${tour.itinerary.length} itinerary days`);
        updated++;
      } else {
        // Insert new tour
        await toursCollection.insertOne({
          ...tour,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`   ✨  Created  "${tour.title}" — ${tour.itinerary.length} itinerary days`);
        created++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n🎉  All done!\n`);
    console.log(`   ✨  Created : ${created} new tours`);
    console.log(`   🔄  Updated : ${updated} existing tours`);
    console.log(`   📋  Total   : ${nepalTours.length} tours processed\n`);

  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌  MongoDB connection closed.\n');
  }
}

run();
