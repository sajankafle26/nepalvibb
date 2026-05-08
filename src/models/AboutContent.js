import mongoose from 'mongoose';

const AboutContentSchema = new mongoose.Schema({
  hero: {
    image: { type: String, default: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' },
    title: { type: String, default: 'Oppdag Nepalvibb' },
    subtitle: { type: String, default: 'Vår Historie' },
  },
  mission: {
    title: { type: String, default: 'Vi skaper minner for livet' },
    description: { type: String, default: 'Nepalvibb ble grunnlagt med en lidenskap for å dele skjønnheten og mystikken i Himalaya med resten av verden.' },
    stats: [
      { number: { type: String, default: '15+' }, label: { type: String, default: 'Års Erfaring' } },
      { number: { type: String, default: '5k+' }, label: { type: String, default: 'Fornøyde Gjest' } },
      { number: { type: String, default: '100%' }, label: { type: String, default: 'Lokal Guiding' } }
    ],
    image: { type: String, default: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop' },
    quote: { type: String, default: '"Vi reiser ikke bare for å se nye steder, men for å se verden med nye øyne."' }
  },
  valuesTitle: { type: String, default: 'Våre Kjerneverdier' },
  valuesSubtitle: { type: String, default: 'Grunnpilarene i alt vi gjør, fra planlegging til gjennomføring.' },
  values: [
    { 
      title: { type: String, default: 'Lokal Ekspertise' }, 
      desc: { type: String, default: 'Våre guider er født og oppvokst i Himalaya, og kjenner hver sti og tradisjon.' }, 
      icon: { type: String, default: 'Compass' } 
    },
    { 
      title: { type: String, default: 'Bærekraft' }, 
      desc: { type: String, default: 'Vi forplikter oss til å bevare naturen og støtte lokalsamfunnene vi besøker.' }, 
      icon: { type: String, default: 'Globe' } 
    }
  ]
}, { timestamps: true });

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
