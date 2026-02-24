export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://driverchicago.com/#business",
    "name": "Ahmad: Your Chicago Driver",
    "alternateName": "Ahmad Chicago Driver",
    "description": "Professional private driver and chauffeur services in Chicago. Airport transfers to O'Hare and Midway, corporate transportation, city tours, hourly car service, school drop-offs, and daily commutes. Safe, reliable, and affordable transportation in a 2023 Honda Accord Hybrid Touring.",
    "url": "https://driverchicago.com",
    "telephone": "+1-847-219-3030",
    "email": "ahmad@driverchicago.com",
    "image": "https://driverchicago.com/images/driver-new.jpg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chicago",
      "addressRegion": "IL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.8781",
      "longitude": "-87.6298"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Chicago",
        "sameAs": "https://en.wikipedia.org/wiki/Chicago"
      },
      {
        "@type": "Place",
        "name": "O'Hare International Airport"
      },
      {
        "@type": "Place",
        "name": "Midway International Airport"
      },
      {
        "@type": "Place",
        "name": "Downtown Chicago"
      },
      {
        "@type": "Place",
        "name": "Chicago Suburbs"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Driver Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfers",
            "description": "Stress-free rides to O'Hare and Midway airports with flight tracking"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hourly Driver Service",
            "description": "Personal driver for the day, perfect for business meetings or city exploration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Corporate Transportation",
            "description": "Professional transportation for business clients and executives"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "City Tours",
            "description": "Customized tours of Chicago's attractions and hidden gems"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "School Drop-offs and Pick-ups",
            "description": "Safe and dependable transportation for children"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Daily Commute Service",
            "description": "Reliable daily transportation to and from work"
          }
        }
      ]
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59",
      "description": "Available 24/7 by appointment"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [],
    "slogan": "Your Personal Chicago Driver - Safe, Reliable, Always On Time"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema() {
  const services = [
    {
      name: "Airport Transfer Service Chicago",
      description: "Professional airport pickup and drop-off service to O'Hare and Midway airports. Flight tracking included for on-time arrivals.",
      areaServed: "Chicago, IL"
    },
    {
      name: "Private Chauffeur Service Chicago", 
      description: "Personal driver service for business meetings, events, and daily transportation needs in Chicago.",
      areaServed: "Chicago, IL"
    },
    {
      name: "Corporate Car Service Chicago",
      description: "Executive transportation service for corporate clients and business travelers in Chicago.",
      areaServed: "Chicago, IL"
    }
  ];

  return (
    <>
      {services.map((service, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "serviceType": "Transportation Service",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Ahmad: Your Chicago Driver",
                "telephone": "+1-847-219-3030"
              },
              ...service
            })
          }}
        />
      ))}
    </>
  );
}
