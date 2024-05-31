const app = require("./src/app");
const startCronJobs = require('./cronJobs');
const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`Journese listening on port ${PORT}`);
  startCronJobs();
});

module.exports =  server