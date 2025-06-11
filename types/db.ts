import { Mechanics } from '.';

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
