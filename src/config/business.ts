export const business = {
  name: "Lutz Scoops",
  address: { street: "19259 North Dale Mabry Highway", cityStateZip: "Lutz, FL 33548" },
  phone: { display: "727-504-4722", href: "tel:+17275044722" },
  hours: [
    { days: "Monday – Thursday", time: "12 PM – 9 PM" },
    { days: "Friday – Saturday", time: "12 PM – 10 PM" },
    { days: "Sunday", time: "12 PM – 8 PM" },
  ],
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=19259+North+Dale+Mabry+Highway+Lutz+FL+33548",
  orderOnlineUrl: "https://lutzscoops.square.site/",
} as const;
