import dbClient from "../utils/db";

const waitConnection = () => {
  return new Promise((resolve, reject) => {
    let i = 0;
    const repeatFct = async () => {
      await setTimeout(() => {
        i += 1;
        if (i >= 10) {
          reject();
        } else if (!dbClient.isAlive()) {
          repeatFct();
        } else {
          console.log(`MongoDB connected succesfully`);
          resolve();
        }
      }, 1000);
    };
    repeatFct();
  });
};

const startServer = async (api) => {
  const port = process.env.PORT || 5000;
  const env = process.env.ENV || "dev";
  await waitConnection();

  api.listen(port, () => {
    console.log(`[${env}] API has started listening at port:${port}`);
  });
};

export default startServer;
