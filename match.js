const universitiesData = [
  {
    name: "Bharati Vidyapeeth Deemed University",
    country: "India",
    city: "Pune",
    citySlug: "pune",
    countrySlug: "india",
    slug: "bharati-vidyapeeth-deemed-university",
    status: false,
    universityId: {
      $oid: "5f7efd7727828284",
    },
    isCampus: false,
    url: "https://www.eemed-university",
  },
  {
    name: "Maharashtra Institute of Technology (MIT)",
    country: "India",
    city: "Pune",
    citySlug: "pune",
    countrySlug: "india",
    slug: "maharashtra-institute-of-technology-mit",
    status: false,
    universityId: {
      $oid: "5f7efde48b21d6828286",
    },
    isCampus: false,
    url: "https://wtechnology-mit",
  },
];

const citiesData = [
  {
    _id: {
      $oid: "5dd620a02f60e9716a",
    },
    country: "India",
    name: "Pune",
    countrySlug: "india",
    slug: "pune",
    enable: true,
  },
  {
    _id: {
      $oid: "5e3b9af51d5a8c03f",
    },
    country: "United States",
    name: "Eugene (Oregon)",
    countrySlug: "united-states",
    slug: "eugene",
    enable: true,
  },
];

// Function to filter universities based on city name and enable status
const filterUniversities = () => {
  const filteredUniversities = universitiesData.filter((university) => {
    const cityData = citiesData.find(
      (city) => city.name === university.city && city.enable
    );
    return cityData;
  });

  return filteredUniversities.map(
    (university) =>
      `${university.name}, ${university.city} ${university.country}`
  );
};

// Example usage
const result = filterUniversities();
console.log(result);
