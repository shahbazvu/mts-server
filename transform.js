const fs = require("fs");
const csv = require("csvtojson");
// const lowercase = require("lowercase-keys");

csv()
  .fromFile("./data/raw.csv")
  .then((data) => {
    const geojsonFeatureArray = data
    //   .map((d) => {
    //     return lowercase(d);
    //   })
      .filter((d) => {
        return !!d.Latitude && !!d.Longitude;
      })
      .map((d) => {
        const properties = {
          ...d,
        };

        delete properties.Latitude;
        delete properties.Longitude;

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(d.Longitude), parseFloat(d.Latitude)],
          },
          properties,
        };
      });

    // write to geojson-ld
    const outputFile = fs.createWriteStream("./data/inspections.geojsonld");
    geojsonFeatureArray.forEach((feature) => {
      outputFile.write(`${JSON.stringify(feature)}\n`);
    });
  });
