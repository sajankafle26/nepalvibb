import mongoose from 'mongoose';

const ContactContentSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Kontakt Oss' },
    subtitle: { type: String, default: 'La oss snakke' },
    description: { type: String, default: 'Våre reiseeksperter er klare til å hjelpe deg med å planlegge ditt neste eventyr i Himalaya.' },
  },
  form: {
    title: { type: String, default: 'Send oss en melding' },
    subtitle: { type: String, default: 'Fyll ut skjemaet nedenfor, så kontakter vi deg i løpet av 24 timer.' },
  }
}, { timestamps: true });

export default mongoose.models.ContactContent || mongoose.model('ContactContent', ContactContentSchema);
