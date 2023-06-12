export type Workshop = {
  instructorName: string;
  key: string;
  imgPath?: string;
  desc: string[];
  type: string;
  date: string;
  time: string;
  price: string;
  link: string;
};

export function getWorkshopByKey(key: string): Workshop | undefined {
  return workshops.find((w) => w.key === key);
}

export const workshops = [
  {
    instructorName: "Lucy Jane Atkinson",
    key: "LUCY_JANE_ATKINSON",
    imgPath: "/headshots/thumbnail_LucyJaneAtikinston.jpg",
    desc: [
      "The Sleeping Sword - Watermill Theatre",
      "Barrier(s) - National Theatre",
      "Meat - Theatre 503",
      "(AD) Middle - National Theatre",
    ],
    type: "Scene Study",
    date: "Saturday 8th July",
    time: " 10AM - 1PM",
    price: "£26.95",
    link: "https://lucyjaneatkinson.com",
  },
  {
    instructorName: "Michelle Payne",
    key: "MICHELLE_PAYNE",
    desc: [
      "To Have & To Hold - Mercury Theatre, The Bush",
      " Mind Over Matter - Theatre Peckham",
      "My Three Sisters - The Bush",
      "Bugsy Malone - Alexander Palace & UK Tour",
    ],
    imgPath: "/headshots/thumbnail_MichellePayne.jpeg",
    type: "Scene Study",
    date: "Saturday 15th July",
    time: " 10AM - 1PM",
    price: "£26.95",
    link: "https://www.michelle-payne.co.uk",
  },
  {
    instructorName: "Simon Greiff",
    key: "SIMON_GREIFF",
    desc: [
      "Blippi The Musical - Lyric Theatre",
      "A Song Cycle for Soho - Soho Theatre",
      "Rumpy Pumpy - Theatre Royal Windsor",
      "(Assoc Dir) A Christmas Carol - The Old Vic",
    ],
    imgPath: "/headshots/thumbnail_SimonGreiff.jpg",
    type: "Scene Study",
    date: "Saturday 22nd July",
    time: " 10AM - 1PM",
    price: "£26.95",
    link: "http://www.simongreiff.com",
  },
  {
    instructorName: "Emma Baggott",
    key: "EMMA_BAGGOTT",
    desc: [
      "Stiletto Beach - Queens Theatre Hornchurch",
      "She Is Fierce - The Swirl, RSC",
      "10 Scenes for Women - Theatre Royal Haymarket",
      "(Assoc Dir) The Sound of Yellow - Young Vic",
    ],
    imgPath: "/headshots/thumbnail_EmmaBaggot.jpg",
    type: "Scene Study",
    date: "Saturday 29th July",
    time: " 10AM - 1PM",
    price: "£26.95",
    link: "http://emmabaggott.co.uk",
  },
] as Workshop[];
