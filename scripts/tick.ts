/** Run a single autonomous tick (data refresh -> signals -> trades -> reports). */
import { tick } from "../src/lib/engine/experiment";

tick()
  .then((r) => {
    console.log("[tick]", JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  })
  .catch((e) => {
    console.error("[tick] fatal", e);
    process.exit(1);
  });
