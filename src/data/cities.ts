import type { WorldCity } from "@/types/alarm";

export const CITIES_DATABASE: WorldCity[] = [
  // ==========================================
  // LATINOAMÉRICA (Priorizados)
  // ==========================================
  // Argentina
  { id: "ar-bue", name: "Buenos Aires", country: "Argentina", timeZone: "America/Argentina/Buenos_Aires" },
  { id: "ar-cor", name: "Córdoba", country: "Argentina", timeZone: "America/Argentina/Cordoba" },
  { id: "ar-mdz", name: "Mendoza", country: "Argentina", timeZone: "America/Argentina/Mendoza" },
  { id: "ar-ros", name: "Rosario", country: "Argentina", timeZone: "America/Argentina/Buenos_Aires" },
  { id: "ar-brc", name: "Bariloche", country: "Argentina", timeZone: "America/Argentina/Salta" },
  { id: "ar-ush", name: "Ushuaia", country: "Argentina", timeZone: "America/Argentina/Ushuaia" },

  // Brasil
  { id: "br-sao", name: "São Paulo", country: "Brasil", timeZone: "America/Sao_Paulo" },
  { id: "br-rio", name: "Río de Janeiro", country: "Brasil", timeZone: "America/Sao_Paulo" },
  { id: "br-bsb", name: "Brasilia", country: "Brasil", timeZone: "America/Sao_Paulo" },
  { id: "br-ssa", name: "Salvador", country: "Brasil", timeZone: "America/Bahia" },
  { id: "br-mao", name: "Manaos", country: "Brasil", timeZone: "America/Manaus" },
  { id: "br-for", name: "Fortaleza", country: "Brasil", timeZone: "America/Fortaleza" },

  // Chile
  { id: "cl-scl", name: "Santiago", country: "Chile", timeZone: "America/Santiago" },
  { id: "cl-val", name: "Valparaíso", country: "Chile", timeZone: "America/Santiago" },
  { id: "cl-puq", name: "Punta Arenas", country: "Chile", timeZone: "America/Punta_Arenas" },
  { id: "cl-ipc", name: "Isla de Pascua", country: "Chile", timeZone: "Pacific/Easter" },

  // Uruguay
  { id: "uy-mvd", name: "Montevideo", country: "Uruguay", timeZone: "America/Montevideo" },
  { id: "uy-pde", name: "Punta del Este", country: "Uruguay", timeZone: "America/Montevideo" },

  // Paraguay
  { id: "py-asu", name: "Asunción", country: "Paraguay", timeZone: "America/Asuncion" },
  { id: "py-cde", name: "Ciudad del Este", country: "Paraguay", timeZone: "America/Asuncion" },

  // Bolivia
  { id: "bo-lpz", name: "La Paz", country: "Bolivia", timeZone: "America/La_Paz" },
  { id: "bo-srn", name: "Santa Cruz de la Sierra", country: "Bolivia", timeZone: "America/La_Paz" },
  { id: "bo-cba", name: "Cochabamba", country: "Bolivia", timeZone: "America/La_Paz" },

  // Perú
  { id: "pe-lim", name: "Lima", country: "Perú", timeZone: "America/Lima" },
  { id: "pe-cuz", name: "Cusco", country: "Perú", timeZone: "America/Lima" },
  { id: "pe-aqp", name: "Arequipa", country: "Perú", timeZone: "America/Lima" },

  // Colombia
  { id: "co-bog", name: "Bogotá", country: "Colombia", timeZone: "America/Bogota" },
  { id: "co-mde", name: "Medellín", country: "Colombia", timeZone: "America/Bogota" },
  { id: "co-clo", name: "Cali", country: "Colombia", timeZone: "America/Bogota" },
  { id: "co-baq", name: "Barranquilla", country: "Colombia", timeZone: "America/Bogota" },
  { id: "co-ctg", name: "Cartagena", country: "Colombia", timeZone: "America/Bogota" },

  // Ecuador
  { id: "ec-uio", name: "Quito", country: "Ecuador", timeZone: "America/Guayaquil" },
  { id: "ec-gye", name: "Guayaquil", country: "Ecuador", timeZone: "America/Guayaquil" },
  { id: "ec-gps", name: "Islas Galápagos", country: "Ecuador", timeZone: "Pacific/Galapagos" },

  // Venezuela
  { id: "ve-ccs", name: "Caracas", country: "Venezuela", timeZone: "America/Caracas" },
  { id: "ve-mar", name: "Maracaibo", country: "Venezuela", timeZone: "America/Caracas" },
  { id: "ve-val", name: "Valencia", country: "Venezuela", timeZone: "America/Caracas" },

  // México
  { id: "mx-mex", name: "Ciudad de México", country: "México", timeZone: "America/Mexico_City" },
  { id: "mx-gdl", name: "Guadalajara", country: "México", timeZone: "America/Mexico_City" },
  { id: "mx-mty", name: "Monterrey", country: "México", timeZone: "America/Monterrey" },
  { id: "mx-cun", name: "Cancún", country: "México", timeZone: "America/Cancun" },
  { id: "mx-tij", name: "Tijuana", country: "México", timeZone: "America/Tijuana" },
  { id: "mx-mid", name: "Mérida", country: "México", timeZone: "America/Merida" },

  // Centroamérica y Caribe
  { id: "cr-sjo", name: "San José", country: "Costa Rica", timeZone: "America/Costa_Rica" },
  { id: "pa-pty", name: "Ciudad de Panamá", country: "Panamá", timeZone: "America/Panama" },
  { id: "gt-gua", name: "Ciudad de Guatemala", country: "Guatemala", timeZone: "America/Guatemala" },
  { id: "sv-sal", name: "San Salvador", country: "El Salvador", timeZone: "America/El_Salvador" },
  { id: "hn-tgu", name: "Tegucigalpa", country: "Honduras", timeZone: "America/Tegucigalpa" },
  { id: "ni-mga", name: "Managua", country: "Nicaragua", timeZone: "America/Managua" },
  { id: "cu-hav", name: "La Habana", country: "Cuba", timeZone: "America/Havana" },
  { id: "do-sdq", name: "Santo Domingo", country: "República Dominicana", timeZone: "America/Santo_Domingo" },
  { id: "pr-sju", name: "San Juan", country: "Puerto Rico", timeZone: "America/Puerto_Rico" },

  // ==========================================
  // AMÉRICA DEL NORTE Y RESTO DE AMÉRICA
  // ==========================================
  // Estados Unidos
  { id: "us-nyc", name: "Nueva York", country: "Estados Unidos", timeZone: "America/New_York" },
  { id: "us-lax", name: "Los Ángeles", country: "Estados Unidos", timeZone: "America/Los_Angeles" },
  { id: "us-chi", name: "Chicago", country: "Estados Unidos", timeZone: "America/Chicago" },
  { id: "us-mia", name: "Miami", country: "Estados Unidos", timeZone: "America/New_York" },
  { id: "us-sfo", name: "San Francisco", country: "Estados Unidos", timeZone: "America/Los_Angeles" },
  { id: "us-was", name: "Washington D.C.", country: "Estados Unidos", timeZone: "America/New_York" },
  { id: "us-hou", name: "Houston", country: "Estados Unidos", timeZone: "America/Chicago" },
  { id: "us-sea", name: "Seattle", country: "Estados Unidos", timeZone: "America/Los_Angeles" },
  { id: "us-den", name: "Denver", country: "Estados Unidos", timeZone: "America/Denver" },
  { id: "us-bos", name: "Boston", country: "Estados Unidos", timeZone: "America/New_York" },
  { id: "us-las", name: "Las Vegas", country: "Estados Unidos", timeZone: "America/Los_Angeles" },
  { id: "us-hnl", name: "Honolulu (Hawái)", country: "Estados Unidos", timeZone: "Pacific/Honolulu" },

  // Canadá
  { id: "ca-tor", name: "Toronto", country: "Canadá", timeZone: "America/Toronto" },
  { id: "ca-yvr", name: "Vancouver", country: "Canadá", timeZone: "America/Vancouver" },
  { id: "ca-mtl", name: "Montreal", country: "Canadá", timeZone: "America/Toronto" },
  { id: "ca-cal", name: "Calgary", country: "Canadá", timeZone: "America/Edmonton" },
  { id: "ca-ott", name: "Ottawa", country: "Canadá", timeZone: "America/Toronto" },

  // Caribe
  { id: "jm-kin", name: "Kingston", country: "Jamaica", timeZone: "America/Jamaica" },
  { id: "bs-nas", name: "Nasáu", country: "Bahamas", timeZone: "America/Nassau" },
  { id: "tt-pos", name: "Puerto España", country: "Trinidad y Tobago", timeZone: "America/Port_of_Spain" },

  // ==========================================
  // EUROPA
  // ==========================================
  { id: "es-mad", name: "Madrid", country: "España", timeZone: "Europe/Madrid" },
  { id: "es-bcn", name: "Barcelona", country: "España", timeZone: "Europe/Madrid" },
  { id: "gb-lon", name: "Londres", country: "Reino Unido", timeZone: "Europe/London" },
  { id: "fr-par", name: "París", country: "Francia", timeZone: "Europe/Paris" },
  { id: "it-rom", name: "Roma", country: "Italia", timeZone: "Europe/Rome" },
  { id: "it-mil", name: "Milán", country: "Italia", timeZone: "Europe/Rome" },
  { id: "de-ber", name: "Berlín", country: "Alemania", timeZone: "Europe/Berlin" },
  { id: "de-fra", name: "Fráncfort", country: "Alemania", timeZone: "Europe/Berlin" },
  { id: "pt-lis", name: "Lisboa", country: "Portugal", timeZone: "Europe/Lisbon" },
  { id: "nl-ams", name: "Ámsterdam", country: "Países Bajos", timeZone: "Europe/Amsterdam" },
  { id: "be-bru", name: "Bruselas", country: "Bélgica", timeZone: "Europe/Brussels" },
  { id: "ch-zrh", name: "Zúrich", country: "Suiza", timeZone: "Europe/Zurich" },
  { id: "at-vie", name: "Viena", country: "Austria", timeZone: "Europe/Vienna" },
  { id: "gr-ath", name: "Atenas", country: "Grecia", timeZone: "Europe/Athens" },
  { id: "se-sto", name: "Estocolmo", country: "Suecia", timeZone: "Europe/Stockholm" },
  { id: "no-osl", name: "Oslo", country: "Noruega", timeZone: "Europe/Oslo" },
  { id: "ie-dub", name: "Dublín", country: "Irlanda", timeZone: "Europe/Dublin" },
  { id: "pl-waw", name: "Varsovia", country: "Polonia", timeZone: "Europe/Warsaw" },
  { id: "cz-prg", name: "Praga", country: "República Checa", timeZone: "Europe/Prague" },
  { id: "ru-mow", name: "Moscú", country: "Rusia", timeZone: "Europe/Moscow" },

  // ==========================================
  // ASIA, OCEANÍA Y ÁFRICA
  // ==========================================
  { id: "jp-tyo", name: "Tokio", country: "Japón", timeZone: "Asia/Tokyo" },
  { id: "jp-osa", name: "Osaka", country: "Japón", timeZone: "Asia/Tokyo" },
  { id: "cn-bjs", name: "Pekín", country: "China", timeZone: "Asia/Shanghai" },
  { id: "cn-sha", name: "Shanghái", country: "China", timeZone: "Asia/Shanghai" },
  { id: "hk-hkg", name: "Hong Kong", country: "Hong Kong", timeZone: "Asia/Hong_Kong" },
  { id: "kr-sel", name: "Seúl", country: "Corea del Sur", timeZone: "Asia/Seoul" },
  { id: "sg-sin", name: "Singapur", country: "Singapur", timeZone: "Asia/Singapore" },
  { id: "th-bkk", name: "Bangkok", country: "Tailandia", timeZone: "Asia/Bangkok" },
  { id: "ae-dxb", name: "Dubái", country: "Emiratos Árabes Unidos", timeZone: "Asia/Dubai" },
  { id: "qa-doh", name: "Doha", country: "Catar", timeZone: "Asia/Qatar" },
  { id: "in-del", name: "Nueva Delhi", country: "India", timeZone: "Asia/Kolkata" },
  { id: "in-bom", name: "Bombay", country: "India", timeZone: "Asia/Kolkata" },
  { id: "au-syd", name: "Sídney", country: "Australia", timeZone: "Australia/Sydney" },
  { id: "au-mel", name: "Melbourne", country: "Australia", timeZone: "Australia/Melbourne" },
  { id: "nz-akl", name: "Auckland", country: "Nueva Zelanda", timeZone: "Pacific/Auckland" },
  { id: "za-cpt", name: "Ciudad del Cabo", country: "Sudáfrica", timeZone: "Africa/Johannesburg" },
  { id: "eg-cai", name: "El Cairo", country: "Egipto", timeZone: "Africa/Cairo" },
  { id: "ma-cas", name: "Casablanca", country: "Marruecos", timeZone: "Africa/Casablanca" },
];
