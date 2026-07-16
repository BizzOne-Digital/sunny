import { syncServices } from "../src/lib/site";

async function main() {
  const items = await syncServices();
  console.log(`Synced ${items.length} services`);
  console.log(items.map((item) => `${item.name} (${item.priceLabel})`).join(" | "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
