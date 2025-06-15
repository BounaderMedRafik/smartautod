import { Mechanics, ShopsProps } from '.';

export type supaUser = {
  uuid: string;
  created_at: string;
  name: string;
  age: number;
  email: string;
  password: string;
};

export const mockMechanics: Mechanics[] = [
  {
    name: 'Ahmed Bensalem',
    description: "Spécialiste en moteurs diesel avec 10 ans d'expérience.",
    phonenum: '+213699123456',
    location: 'El Kala, El Tarf',
    image:
      'https://www.shutterstock.com/image-photo/man-car-technician-mechanic-repairing-600nw-2329495859.jpg',
  },
  {
    name: 'Khaled Amrani',
    description: 'Mécanicien polyvalent, entretien et diagnostic rapide.',
    phonenum: '+213772654321',
    location: 'Annaba Centre',
    image:
      'https://www.shutterstock.com/image-photo/portrait-arabic-mechanic-working-workshop-600nw-425186530.jpg',
  },
  {
    name: 'Yacine Bouzid',
    description: 'Réparations de boîtes de vitesse et embrayages.',
    phonenum: '+213661987654',
    location: 'Bouhadjar, El Tarf',
    image:
      'https://cdn.freepixel.com/preview/free-photos-a-middle-eastern-man-wearing-a-white-hat-glasses-and-a-traditional-arabic-headdress-standing-in-a-ca-preview-100322758.jpg',
  },
  {
    name: 'Sofiane Mekki',
    description: 'Spécialiste électricité automobile, toutes marques.',
    phonenum: '+213775112233',
    location: 'Drean, El Tarf',
    image:
      'https://www.shutterstock.com/image-photo/car-service-repair-maintenance-concept-600nw-2203312555.jpg',
  },
  {
    name: 'Rachid Guemache',
    description: 'Mécanique générale, service rapide et fiable.',
    phonenum: '+213664445566',
    location: 'Seraïdi, Annaba',
    image:
      'https://media.istockphoto.com/id/534460548/photo/arabic-mechanic-with-tires-shows-thumb-up.jpg?s=1024x1024&w=is&k=20&c=Imeg2MfvZwQ64_jwtiWyZsmz4PshdLjom8GsprKRm4s=',
  },
  {
    name: 'Nabil Charef',
    description: 'Mécano à domicile, interventions sur Annaba et environs.',
    phonenum: '+213777889900',
    location: 'Berrahal, Annaba',
    image:
      'https://explorerdubailtd.com/uae/wp-content/uploads/sites/6/2023/03/The-Advantages-Of-Hiring-Ugandan-Mechanics-In-The-United-Arab-Emirates-UAE-scaled.jpg',
  },
  {
    name: 'Adel Mansouri',
    description: 'Diagnostique moteur et reprogrammation.',
    phonenum: '+213667778899',
    location: 'Chefia, El Tarf',
    image:
      'https://thumbs.dreamstime.com/b/arabic-mechanic-gives-key-car-portrait-wearing-uniform-giving-smiling-camera-isolated-white-background-71834840.jpg',
  },
];

export const carShops: ShopsProps[] = [
  {
    name: 'Auto Pièces El Kala',
    description:
      "Vente de pièces détachées neuves et d'occasion pour toutes marques.",
    phonenum: '0657 42 31 10',
    location: 'El Kala, El Tarf',
    image:
      'https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67c1ac112565c597dd338fe1_alex-suprun-AHnhdjyTNGM-unsplash-1-1024x683.jpg',
    openTime: '08:00',
    closeTime: '17:00',
  },
  {
    name: 'Garage Annaba Pièces',
    description:
      'Spécialiste des pièces Renault, Peugeot, et Hyundai à bon prix.',
    phonenum: '0771 83 24 66',
    location: 'Centre-ville, Annaba',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV5HmxfZCnHvwnKaOVmd77oQ5Cg027lx-dVg&s',
    openTime: '08:30',
    closeTime: '18:00',
  },
  {
    name: 'Sidi Amar Auto Center',
    description: 'Pièces auto, accessoires, et huiles moteur. Service rapide.',
    phonenum: '0550 22 90 43',
    location: 'Sidi Amar, Annaba',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJiWg0MgfRXMYBsa8gnphMTYyCnG8VOQLWHw&s',
    openTime: '09:00',
    closeTime: '17:30',
  },
  {
    name: 'AutoDz Pièces & Accessoires',
    description:
      'Grossiste en pièces détachées pour voitures européennes et asiatiques.',
    phonenum: '0661 99 32 77',
    location: 'Drean, El Tarf',
    image: 'https://cdn.autobip.com/600/photos/articles/1309/Photo1.webp',
    openTime: '08:00',
    closeTime: '16:30',
  },
  {
    name: 'Pièces Auto Ain El Assel',
    description:
      'Vente locale de pièces de rechange pour véhicules utilitaires.',
    phonenum: '0695 43 87 90',
    location: 'Ain El Assel, El Tarf',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTav4nRxAj78uBqT4PgSfNEDlsn6rDQ8fPceA&s',
    openTime: '08:00',
    closeTime: '17:00',
  },
  {
    name: 'Garage Bounaama',
    description:
      'Atelier mécanique avec vente de pièces et services d’entretien.',
    phonenum: '0560 88 12 34',
    location: 'Berrahal, Annaba',
    image:
      'https://cdn7.ouedkniss.com/400/medias/announcements/images/BL7Bzk/CTsZ0OuZW4UziwpuIuZ0QsznPoYKfTVklUV8h66y.jpg',
    openTime: '08:00',
    closeTime: '18:00',
  },
];
