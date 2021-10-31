const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
