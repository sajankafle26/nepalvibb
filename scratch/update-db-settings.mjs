import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nepalvibb";

const SiteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Nepalvibb' },
  subsidiaryLogo: { type: String },
  affiliations: [{
    name: String,
    logoUrl: String,
    url: String,
  }],
}, { strict: false });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function update() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const settings = await SiteSettings.findOne({});
    if (!settings) {
      console.log('No settings document found in database to update.');
      process.exit(0);
    }

    console.log('Current settings found. Updating affiliations and subsidiary logo...');

    const updatedAffiliations = [
      { name: 'NATTA', logoUrl: '/uploads/natta.png', url: 'https://www.natta.org.np' },
      { name: 'NTB', logoUrl: '/uploads/ntb.svg', url: 'https://ntb.gov.np' },
      { name: 'TAAN', logoUrl: '/uploads/taan.svg', url: 'https://www.taan.org.np' },
      { name: 'NMA', logoUrl: '/uploads/nma.png', url: 'https://nepalmountaineering.org' },
      { name: 'RGF', logoUrl: '/uploads/rgf.jpg', url: 'https://reisegarantifondet.no' },
      { name: 'Keep Nepal Green', logoUrl: '/uploads/keep.svg', url: '#' },
      { name: 'Government of Nepal', logoUrl: '/uploads/nepal-goverment.svg', url: '#' }
    ];

    settings.affiliations = updatedAffiliations;
    settings.subsidiaryLogo = '/uploads/actual-adventure-logo-np.svg';
    
    await settings.save();
    console.log('Successfully updated database settings document! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Error updating settings:', err.message);
    process.exit(1);
  }
}

update();
