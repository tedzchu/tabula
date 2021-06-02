const mongoose = require('mongoose');

const deleteInactiveUsers = require('./deleteInactiveUsers');
const deletePublicPages = require('./deletePublicPages');

const executeJobs = async () => {
  console.log('Task runner setup database connection');
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@notion-clone-0.gqqwp.gcp.mongodb.net/notion?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
      console.log('SUCCESS - Database connected to task runner.');

      // Running jobs
      await deleteInactiveUsers();
      await deletePublicPages();

      process.exit();
    })
    .catch((err) => {
      console.log(`ERROR - While running scheduled tasks: ${err.message}`);
    });
};

executeJobs();
