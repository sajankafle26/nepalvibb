const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/nepalvibb';

const TourSchema = new mongoose.Schema({
  title: String,
  slug: String,
  destination: String,
  duration: String,
  difficulty: String,
  price: Number,
  image: String,
  summary: String,
  overview: String,
  category: String,
  highlights: [String],
  itinerary: [{ day: Number, title: String, details: String }],
  priceIncludes: [String],
  priceExcludes: [String],
  gallery: [String],
  usefulInfo: {
    bestTime: String,
    accommodation: String,
    meals: String,
    visaInfo: String,
    packingList: String
  },
  isFeatured: Boolean,
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function updateTours() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const toursToUpdate = [
      {
        slug: 'everest-base-camp-trek',
        overview: 'Everest Base Camp-trekket er en legendarisk reise til hjertet av Himalaya. Denne 14-dagers ekspedisjonen tar deg gjennom Khumbu-dalen, forbi eldgamle klostre og over hengebroer drapert i bønneflagg, før du endelig når foten av verdens høyeste fjell, Mount Everest (8848m).',
        highlights: [
          'Nå Everest Base Camp (5364m)',
          'Soloppgang over Everest fra Kala Patthar (5545m)',
          'Besøk det berømte Tengboche-klosteret',
          'Utforsk Namche Bazaar, sherpaenes hovedstad',
          'Fantastisk utsikt over Ama Dablam og Lhotse'
        ],
        itinerary: [
          { day: 1, title: 'Fly til Lukla & Trek til Phakding', details: 'En spennende 30-minutters flytur til Lukla etterfulgt av en lett 3-4 timers vandring til Phakding.' },
          { day: 2, title: 'Trek til Namche Bazaar', details: 'En utfordrende stigning gjennom furuskog og over den berømte Hillary-broen til Namche Bazaar.' },
          { day: 3, title: 'Akklimatisering i Namche', details: 'Fottur til Everest View Hotel for din første utsikt over Everest, Lhotse og Ama Dablam.' },
          { day: 4, title: 'Namche til Tengboche', details: 'Vandring langs en naturskjønn sti med panoramautsikt før vi klatrer opp til det åndelige sentrumet Tengboche.' },
          { day: 5, title: 'Tengboche til Dingboche', details: 'Gå forbi sommerbeiter og kryss elver mens vi beveger oss over tregrensen til Dingboche (4410m).' },
          { day: 6, title: 'Akklimatisering i Dingboche', details: 'En hviledag med mulighet for en fottur opp til Nangkartshang Peak for spektakulær utsikt over Makalu.' }
        ],
        priceIncludes: [
          'Innenlandsflyvninger (Katmandu-Lukla-Katmandu)',
          'Alle overnattinger i Katmandu (3 stjerner) og på tehus',
          'Erfaren engelsktalende guide og bærere',
          'Alle måltider (frokost, lunsj, middag) under vandringen',
          'Sagarmatha nasjonalparkavgift og TIMS-kort'
        ],
        priceExcludes: [
          'Internasjonale flyreiser til Nepal',
          'Nepal visumavgift',
          'Reiseforsikring (obligatorisk)',
          'Tips til guider og bærere',
          'Personlige utgifter som varm dusj, batterilading og drikkevarer'
        ],
        usefulInfo: {
          bestTime: 'Mars til Mai og September til November',
          accommodation: 'Tehus (Lodge) under vandringen',
          meals: 'Variert meny inkludert Dal Bhat, pasta og pannekaker',
          visaInfo: 'Visum ved ankomst i Katmandu (USD 50 for 30 dager)',
          packingList: 'Gode tursko, dun-jakke, sovepose (-20C) og lagvis bekledning.'
        }
      },
      {
        slug: 'annapurna-sanctuary',
        overview: 'Annapurna Sanctuary-trekket er en spektakulær fottur inn i hjertet av Annapurna-massivet. Du vil bli omringet av gigantiske topper som Annapurna I, Annapurna South og den hellige Machhapuchhre (Fiskehalen).',
        highlights: [
          '360-graders utsikt fra Annapurna Base Camp',
          'Bad i naturlige varme kilder i Jhinu Danda',
          'Vandring gjennom frodige rhododendronskoger',
          'Soloppgang fra Poon Hill over Dhaulagiri og Annapurna'
        ],
        itinerary: [
          { day: 1, title: 'Kjøring til Nayapul & Trek til Ulleri', details: 'Start turen med en kjøretur fra Pokhara og en bratt stigning opp trappene til Ulleri.' },
          { day: 2, title: 'Ulleri til Ghorepani', details: 'Vandring gjennom vakre skoger med gradvis stigning til den hyggelige landsbyen Ghorepani.' },
          { day: 3, title: 'Poon Hill & Trek til Tadapani', details: 'Tidlig morgen fottur til Poon Hill for soloppgang, etterfulgt av vandring mot Tadapani.' },
          { day: 4, title: 'Tadapani til Chhomrong', details: 'Nedstigning gjennom tett skog før en stigning opp til den sjarmerende landsbyen Chhomrong.' }
        ],
        priceIncludes: [
          'Transport mellom Katmandu og Pokhara',
          'Overnatting i tehus med delt bad',
          'Erfaren guide og nødvendige tillatelser',
          'Alle måltider under vandringen'
        ],
        priceExcludes: [
          'Drikkevarer og snacks',
          'Personlig utstyr',
          'Tips',
          'Forsikring'
        ],
        usefulInfo: {
          bestTime: 'Vår og Høst',
          accommodation: 'Tradisjonelle tehus',
          meals: 'Lokal og internasjonal mat',
          visaInfo: 'Standard Nepal visum',
          packingList: 'Turstøvler, regntøy, varmt undertøy og hode-lykt.'
        }
      },
      {
        slug: 'island-peak-climbing',
        overview: 'Island Peak (Imja Tse) er en av de mest populære "trekking peaks" i Nepal. Toppen ligger midt i Chhukung-dalen og byr på en fantastisk utsikt over Lhotse-veggen.',
        highlights: [
          'Nå toppen av Island Peak (6189m)',
          'Teknisk klatring med tau og stegjern',
          'Spektakulær utsikt over Lhotse og Makalu',
          'Vandring gjennom Everest-regionen'
        ],
        itinerary: [
          { day: 1, title: 'Ankomst Island Peak Base Camp', details: 'Vandring fra Chhukung til Base Camp (5080m).' },
          { day: 2, title: 'Klatretrening', details: 'Gjennomgang av klatreutstyr og teknikker før toppstøtet.' },
          { day: 3, title: 'Toppstøt (6189m)', details: 'Start midt på natten for å nå toppen ved soloppgang.' }
        ],
        priceIncludes: [
          'Klatretillatelse for Island Peak',
          'Erfaren klatreguide',
          'Telt og klatreutstyr',
          'Alt av mat under klatringen'
        ],
        priceExcludes: [
          'Personlig klatreutstyr (kan leies)',
          'Redningsforsikring',
          'Tips'
        ],
        usefulInfo: {
          bestTime: 'Vår og Høst',
          accommodation: 'Telt i Base Camp',
          meals: 'Næringsrik mat for klatrere',
          visaInfo: 'Standard Nepal visum',
          packingList: 'Stegjern, isøks, sele og gode klatrestøvler.'
        }
      }
    ];

    for (const data of toursToUpdate) {
      const updated = await Tour.findOneAndUpdate(
        { slug: data.slug },
        { $set: data },
        { new: true }
      );
      if (updated) {
        console.log(`Updated tour: ${updated.title}`);
      } else {
        console.log(`Tour not found: ${data.slug}`);
      }
    }

    console.log('Finished updating tours');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

updateTours();
