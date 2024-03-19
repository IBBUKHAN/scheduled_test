const client = require("./client");
const json = require("./uniliving.distance_matrixes.json");

async function deleteAllHashes() {
  const pattern = "property:*";

  const keysToDelete = await client.keys(pattern);

  if (keysToDelete.length > 0) {
    const result = await client.del(keysToDelete);
    console.log(`Number of hashes deleted: ${result}`);
  } else {
    console.log("No matching hashes found.");
  }
}

deleteAllHashes();

// function handleUndefined(value) {
//   return value !== undefined ? value : null;
// }

// async function int() {
//   for (const property of json) {
//     const propertyId = property._id.$oid;

//     const key = `property:${propertyId}`;
//     await client.hmset(key, {
//       propertyId: propertyId,
//       propertySlug: property.propertySlug,
//       driving: handleUndefined(
//         property.driving &&
//           property.driving.distance &&
//           property.driving.distance.text
//       ),
//       duration: handleUndefined(
//         property.driving &&
//           property.driving.duration &&
//           property.driving.duration.text
//       ),
//       address: handleUndefined(
//         property.driving && property.driving.start_address
//       ),
//       walkingTime: handleUndefined(
//         property.walking &&
//           property.walking.distance &&
//           property.walking.distance.text
//       ),
//       walkingduration: handleUndefined(
//         property.walking &&
//           property.walking.duration &&
//           property.walking.duration.text
//       ),
//       universitySlug: property.universitySlug,
//       propertyId: property.propertyId.$oid,
//       universityId: property.universityId.$oid,
//     });

//     console.log(`Entry for property ${propertyId} set successfully.`);
//     client.quit();
//   }
// }

// async function int() {
//   const property = "6426a736effafbe4ce754d6c";
//   const name = await client.hmget(
//     `property:${property}`,
//     "propertySlug",
//     "duration"
//   );
//   console.log(name);
//   client.quit();
//   return name;
// }

// int();
