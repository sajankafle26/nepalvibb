import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Nepalvibb' },
  contactEmail: { type: String, default: 'info@nepalvibb.com' },
  contactPhone: { type: String, default: '+47 48672979' },
  address: { type: String, default: 'Nygata 12, 0159 Oslo, Norge' },
  kathmanduAddress: { type: String, default: 'Thamel, Kathmandu, Nepal' },
  whatsapp: { type: String, default: '4748672979' },
  viber: { type: String, default: '4748672979' },
  
  footerAbout: { 
    type: String, 
    default: 'Nepalvibb er din personlige portal til Himalaya. Vi kobler deg med lokale eksperter for å skape uforglemmelige og bærekraftige reiseopplevelser i hjertet av Asia.' 
  },
  
  socialLinks: {
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
  },
  
  affiliations: [{
    name: String,
    logoUrl: String,
    url: String,
  }],
  
  copyrightText: { type: String, default: '© 2025 NEPALVIBB AS. ALL RIGHTS RESERVED.' },
  
  adminEmail: { type: String, default: 'sajankafle9841@gmail.com' },
  adminPassword: { type: String, default: 'admin@345' },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
