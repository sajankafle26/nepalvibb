import mongoose from 'mongoose';

const HomeContentSchema = new mongoose.Schema({
  destinations: {
    subtitle: { type: String, default: 'Oppdag verden med oss' },
    title: { type: String, default: 'Velg Din Neste Destinasjon' },
  },
  activities: {
    subtitle: { type: String, default: 'Ting å gjøre i Nepal' },
    title: { type: String, default: 'Eventyrlige Opplevelser' },
  },
  whoWeAre: {
    subtitle: { type: String, default: 'Hvem vi er' },
    title: { type: String, default: 'Eksperter på Himalaya Eventyr' },
    description: { type: String, default: 'Velkommen til Nepalvibb, et stolt datterselskap av Actual Adventure Pvt. Ltd. Med over 15 års dedikasjon har vi etablert oss som den fremste aktøren for skandinaviske reisende i Nepal.' },
    yearsOfExperience: { type: String, default: '15' },
    image1: { type: String, default: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },
    image2: { type: String, default: 'https://images.unsplash.com/photo-1551882547-ff43c63faf76?auto=format&fit=crop&w=800&q=80' },
    feature1Title: { type: String, default: 'TRYGGHET' },
    feature1Desc: { type: String, default: 'Sikkerhet i fokus på alle turer.' },
    feature2Title: { type: String, default: 'EKSPERTISE' },
    feature2Desc: { type: String, default: 'Lokale guider med dyp kunnskap.' },
  },
  tours: {
    subtitle: { type: String, default: 'Våre Mest Populære Turer' },
    title: { type: String, default: 'Finn Ditt Perfekte Eventyr' },
  },
  purpose: {
    subtitle: { type: String, default: 'Vårt samfunnsansvar' },
    title: { type: String, default: 'En Reise med Formål: Ditt Eventyr – Deres Håp' },
    description: { type: String, default: 'Vi støtter lokale prosjekter for gatehunder i Nepal. Ved å reise med oss bidrar du direkte til å gi disse dyrene et bedre liv gjennom Actual Adventure Foundation.' },
    buttonText: { type: String, default: 'Les mer om prosjektet' },
  },
  blog: {
    subtitle: { type: String, default: 'Tips og inspirasjon' },
    title: { type: String, default: 'Siste nyheter og artikler' },
  }
}, { timestamps: true });

export default mongoose.models.HomeContent || mongoose.model('HomeContent', HomeContentSchema);
