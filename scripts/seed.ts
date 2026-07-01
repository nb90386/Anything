import { seedDatabase } from "../src/lib/seed";

seedDatabase()
  .then(({ count }) => console.log(`Seeded ${count} contracts successfully.`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
