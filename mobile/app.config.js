// Expo merges app.json into this function as `config`. The only change: the Firebase file may come from the
// EAS file secret GOOGLE_SERVICES_JSON (set during EAS builds), so google-services.json can stay out of git.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? config.android?.googleServicesFile ?? "./google-services.json",
  },
});
