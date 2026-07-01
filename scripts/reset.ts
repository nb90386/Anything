import { wipeAllData } from "../src/lib/db/repo";

wipeAllData();
console.log("Database wiped. Run `npm run db:seed` to reload sample contracts.");
