// src/data/mockData.js

export const BRANDS = [
  "Toyota",
  "Mercedes",
  "BMW",
  "Audi",
  "Renault",
  "Hyundai",
  "Volkswagen",
  "Peugeot",
  "Kia",
  "Dacia",
  "Ford",
  "Nissan",
  "Jeep",
  "Range Rover"
];

export const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fez",
  "Tangier",
  "Agadir",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Essaouira",
  "El Jadida",
  "Laayoune"
];

export const OWNERS = [
  "Auto Maroc Premium",
  "Royal Cars Rental",
  "Elite Drive Morocco",
  "Mega Rent Casablanca",
  "Luxury Vehicles Rabat",
  "Agadir Auto Rent",
  "Marrakech Prestige Cars",
  "Tangier Mobility",
  "Fez Luxury Rentals",
  "Oujda Auto Services"
];

// --------------------
// 20 cars with real images
// --------------------

export const CARS = [
  // 1 - Toyota Corolla 2022
  {
    id: 1,
    name: "Toyota Corolla 2022",
    brand: "Toyota",
    pricePerDay: 320,
    city: "Casablanca",
    availability: "available",
    owner: "Auto Maroc Premium",
    mainImage: "https://i.gaw.to/vehicles/photos/40/27/402780-2022-toyota-corolla.jpg?640x400",
    images: [
      "https://mkt-vehicleimages-prd.autotradercdn.ca/photos/import/202509/1702/0238/098b7232-277e-4dbf-88bb-6a2bf4cb8481.jpg-420x315",
      "https://static.moniteurautomobile.be/imgcontrol/images_tmp/clients/moniteur/c520-d355-z1/content/medias/images/cars/toyota/corolla/toyota--corolla-5p--2023/toyota--corolla-5p--2023-m-1.webp",
      "https://product-detail-www-opennext.snc-prod.aws.cinch.co.uk/_next/image?url=https%3A%2F%2Feu.cdn.autosonshow.tv%2F6762%2F18088%2FFV22XOK%2Fe03_md.jpg&w=3840&q=75"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 33.5731,
    longitude: -7.5898
  },

  // 2 - Mercedes Class A 2021
  {
    id: 2,
    name: "Mercedes Class A 2021",
    brand: "Mercedes",
    pricePerDay: 550,
    city: "Rabat",
    availability: "reserved",
    owner: "Royal Cars Rental",
    mainImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Diesel",
    gearbox: "Automatic",
    latitude: 34.0209,
    longitude: -6.8416
  },

  // 3 - BMW Series 3 2020
  {
    id: 3,
    name: "BMW Series 3 2020",
    brand: "BMW",
    pricePerDay: 480,
    city: "Marrakech",
    availability: "available",
    owner: "Marrakech Prestige Cars",
    mainImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format&q=90",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format&q=95"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Manual",
    latitude: 31.6295,
    longitude: -7.9811
  },

  // 4 - Renault Clio 5
  {
    id: 4,
    name: "Renault Clio 5",
    brand: "Renault",
    pricePerDay: 200,
    city: "Fez",
    availability: "available",
    owner: "Fez Luxury Rentals",
    mainImage: "https://images.caradisiac.com/logos/8/9/3/2/258932/S7-la-renault-clio-5-arrive-en-occasion-star-en-devenir-malgre-quelques-soucis-181536.jpg",
    images: [
      "https://leseco.ma/wp-content/uploads/2019/02/Renault_CLIO.jpg",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Manual",
    latitude: 34.0331,
    longitude: -5.0003
  },

  // 5 - Audi Q7 2022
  {
    id: 5,
    name: "Audi Q7 2022",
    brand: "Audi",
    pricePerDay: 900,
    city: "Tangier",
    availability: "reserved",
    owner: "Tangier Mobility",
    mainImage: "https://media.ed.edmunds-media.com/audi/q7/2022/oem/2022_audi_q7_4dr-suv_prestige_fq_oem_1_1600.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=90"
    ],
    seats: 7,
    fuel: "Diesel",
    gearbox: "Automatic",
    latitude: 35.7595,
    longitude: -5.8339
  },

  // 6 - Hyundai Tucson 2021
  {
    id: 6,
    name: "Hyundai Tucson 2021",
    brand: "Hyundai",
    pricePerDay: 450,
    city: "Agadir",
    availability: "available",
    owner: "Agadir Auto Rent",
    mainImage: "https://www.wandaloo.com/files/2020/09/HYUNDAI-TUCSON-REVEAL-NOUVELLE-GENERATION-SUV-COMPACT.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=90"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 30.4278,
    longitude: -9.5981
  },

  // 7 - Dacia Duster 2023
  {
    id: 7,
    name: "Dacia Duster 2023",
    brand: "Dacia",
    pricePerDay: 220,
    city: "Oujda",
    availability: "available",
    owner: "Oujda Auto Services",
    mainImage: "https://www.wandaloo.com/files/2023/06/dacia-duster-finition-extreme-maroc.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Diesel",
    gearbox: "Manual",
    latitude: 34.6814,
    longitude: -1.9086
  },

  // 8 - Peugeot 3008 2022
  {
    id: 8,
    name: "Peugeot 3008 2022",
    brand: "Peugeot",
    pricePerDay: 380,
    city: "Kenitra",
    availability: "reserved",
    owner: "Elite Drive Morocco",
    mainImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGUW5zPR7-vY4GbCyDYziYuQKZXvcpVdBgQg&s",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 34.2610,
    longitude: -6.5800
  },

  // 9 - Volkswagen Golf 7
  {
    id: 9,
    name: "Volkswagen Golf 7",
    brand: "Volkswagen",
    pricePerDay: 300,
    city: "Tetouan",
    availability: "available",
    owner: "Royal Cars Rental",
    mainImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqQ3ps7o3LqBQCRj5tX7NOlJ4SgHITTR0rbQ&s",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Diesel",
    gearbox: "Manual",
    latitude: 35.5784,
    longitude: -5.3684
  },

  // 10 - Kia Sportage 2022
  {
    id: 10,
    name: "Kia Sportage 2022",
    brand: "Kia",
    pricePerDay: 420,
    city: "Essaouira",
    availability: "available",
    owner: "Mega Rent Casablanca",
    mainImage: "https://im.qccdn.fr/node/actualite-kia-sportage-2022-premieres-impressions-98244/thumbnail_1000x600px-138270.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 31.5085,
    longitude: -9.7590
  },

  // 11 - Ford Fiesta 2019
  {
    id: 11,
    name: "Ford Fiesta 2019",
    brand: "Ford",
    pricePerDay: 180,
    city: "El Jadida",
    availability: "reserved",
    owner: "Auto Maroc Premium",
    mainImage: "https://www.automotivpress.fr/wp-content/uploads/2019/12/FordFiestaST2019-17.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Manual",
    latitude: 33.2333,
    longitude: -8.5000
  },

  // 12 - Nissan Qashqai 2020
  {
    id: 12,
    name: "Nissan Qashqai 2020",
    brand: "Nissan",
    pricePerDay: 400,
    city: "Casablanca",
    availability: "available",
    owner: "Luxury Vehicles Rabat",
    mainImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS03tgddO3WXI2M-EmvDRhRqevIWssiay9ABg&s",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Diesel",
    gearbox: "Automatic",
    latitude: 33.5731,
    longitude: -7.5898
  },

  // 13 - Jeep Compass 2022
  {
    id: 13,
    name: "Jeep Compass 2022",
    brand: "Jeep",
    pricePerDay: 650,
    city: "Agadir",
    availability: "available",
    owner: "Agadir Auto Rent",
    mainImage: "https://images.hgmsites.net/hug/2022-jeep-compass-limited_100811274_h.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 30.4278,
    longitude: -9.5981
  },

  // 14 - Range Rover Evoque
  {
    id: 14,
    name: "Range Rover Evoque",
    brand: "Range Rover",
    pricePerDay: 1100,
    city: "Marrakech",
    availability: "reserved",
    owner: "Marrakech Prestige Cars",
    mainImage: "https://images.caradisiac.com/logos-ref/modele/modele--land-rover-range-rover-evoque/S0-modele--land-rover-range-rover-evoque.jpg",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=90"
    ],
    seats: 5,
    fuel: "Diesel",
    gearbox: "Automatic",
    latitude: 31.6295,
    longitude: -7.9811
  },

  // 15 - Toyota Yaris 2021
  {
    id: 15,
    name: "Toyota Yaris 2021",
    brand: "Toyota",
    pricePerDay: 220,
    city: "Fez",
    availability: "available",
    owner: "Fez Luxury Rentals",
    mainImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Manual",
    latitude: 34.0331,
    longitude: -5.0003
  },

  // 16 - BMW X5 2023
  {
    id: 16,
    name: "BMW X5 2023",
    brand: "BMW",
    pricePerDay: 950,
    city: "Tangier",
    availability: "available",
    owner: "Tangier Mobility",
    mainImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=90"
    ],
    seats: 7,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 35.7595,
    longitude: -5.8339
  },

  // 17 - Volkswagen Passat 2018
  {
    id: 17,
    name: "Volkswagen Passat 2018",
    brand: "Volkswagen",
    pricePerDay: 260,
    city: "Rabat",
    availability: "reserved",
    owner: "Luxury Vehicles Rabat",
    mainImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format"
    ],
    seats: 5,
    fuel: "Diesel",
    gearbox: "Manual",
    latitude: 34.0209,
    longitude: -6.8416
  },

  // 18 - Kia Picanto 2020
  {
    id: 18,
    name: "Kia Picanto 2020",
    brand: "Kia",
    pricePerDay: 150,
    city: "Oujda",
    availability: "available",
    owner: "Oujda Auto Services",
    mainImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 4,
    fuel: "Gasoline",
    gearbox: "Manual",
    latitude: 34.6814,
    longitude: -1.9086
  },

  // 19 - Peugeot 208 2019
  {
    id: 19,
    name: "Peugeot 208 2019",
    brand: "Peugeot",
    pricePerDay: 200,
    city: "Casablanca",
    availability: "available",
    owner: "Mega Rent Casablanca",
    mainImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 5,
    fuel: "Gasoline",
    gearbox: "Manual",
    latitude: 33.5731,
    longitude: -7.5898
  },

  // 20 - Ford Explorer 2022
  {
    id: 20,
    name: "Ford Explorer 2022",
    brand: "Ford",
    pricePerDay: 780,
    city: "Agadir",
    availability: "reserved",
    owner: "Agadir Auto Rent",
    mainImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop&auto=format&q=80"
    ],
    seats: 7,
    fuel: "Gasoline",
    gearbox: "Automatic",
    latitude: 30.4278,
    longitude: -9.5981
  }
];