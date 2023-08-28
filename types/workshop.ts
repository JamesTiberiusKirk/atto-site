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
  // {
  //   instructorName: "Lucy Jane Atkinson",
  //   key: "LUCY_JANE_ATKINSON",
  //   imgPath: "/headshots/thumbnail_LucyJaneAtikinston.jpg",
  //   desc: [
  //     "The Sleeping Sword - Watermill Theatre",
  //     "Barrier(s) - National Theatre",
  //     "Meat - Theatre 503",
  //     "(AD) Middle - National Theatre",
  //   ],
  //   type: "Scene Study",
  //   date: "Saturday 8th July",
  //   time: " 10AM - 1PM",
  //   price: "£26.95",
  //   link: "https://lucyjaneatkinson.com",
  // },
  // {
  //   instructorName: "Emma Baggott",
  //   key: "EMMA_BAGGOTT",
  //   desc: [
  //     "Neville's Island. Misfits. Stiletto Beach - Oueens Theatre Hornchurch",
  //     "The Wonderful World of Dissocia - Theatre Royal Stratford East",
  //     "Face The Music: The Social Care Workers Play - Almeida Theatre",
  //     "(Associate Director) This House - National Theatre / Headlong",
  //   ],
  //   imgPath: "/headshots/thumbnail_EmmaBaggot.jpg",
  //   type: "Scene Study",
  //   date: "Saturday 29th July",
  //   time: " 10AM - 1PM",
  //   price: "£26.95",
  //   link: "http://emmabaggott.co.uk",
  // },
  // {
  //   instructorName: "Michelle Payne",
  //   key: "MICHELLE_PAYNE",
  //   desc: [
  //     "To Have & To Hold - Mercury Theatre, The Bush",
  //     " Mind Over Matter - Theatre Peckham",
  //     "My Three Sisters - The Bush",
  //     "Bugsy Malone - Alexander Palace & UK Tour",
  //   ],
  //   imgPath: "/headshots/thumbnail_MichellePayne.jpeg",
  //   type: "Scene Study",
  //   date: "Saturday 15th July",
  //   time: " 10AM - 1PM",
  //   price: "£26.95",
  //   link: "https://www.michelle-payne.co.uk",
  // },
  // {
  //   instructorName: "Scott Le Crass",
  //   key: "SCOTT_LE_CRASS",
  //   desc: [
  //     "Rose - Ambassador’s Theatre",
  //     "Sid - York Theatre Royal",
  //     "An Audience With Margaret’s Wardrobe - Jermyn Street Theatre",
  //     "Things That Make no Sense - Birmingham Rep",
  //     "The Dialogue Project - Almeida Theatre",
  //   ],
  //   imgPath: "/headshots/Scott_le_crass.png",
  //   type: "Scene Study - Constellations by Nick Payne & <br/> Beginning/Middle by David Eldridge",
  //   date: "Saturday 26th August",
  //   time: " 10AM - 1PM",
  //   price: "£25",
  //   link: "https://www.mandy.com/uk/c/scott-le-crass",
  // },
  // {
  //   instructorName: "Simon Greiff",
  //   key: "SIMON_GREIFF",
  //   desc: [
  //     "Blippi The Musical - Lyric Theatre",
  //     "A Song Cycle for Soho - Soho Theatre",
  //     "Rumpy Pumpy - Theatre Royal Windsor",
  //     "(Assoc Dir) A Christmas Carol - The Old Vic",
  //   ],
  //   imgPath: "/headshots/thumbnail_SimonGreiff.jpg",
  //   type: "Scene Study - A Christmas Carol by Jack Thorne",
  //   date: "Saturday 19th August",
  //   time: " 10AM - 1PM",
  //   price: "£25",
  //   link: "http://www.simongreiff.com",
  // },

  {
    instructorName: "Oscar Toeman",
    key: "OSCAR_TOEMAN",
    desc: [
      "The Sugar Syndrome - Orange Tree Theatre (nominated 4 off west end awards)",
      "Actually - Trafalgar Studios",
      "After October - Finborough Theatre (nominated 3 off west end awards)",
      "What They Took With Them: A List - National Theatre",
    ],
    imgPath: "/headshots/oscar_headshot.jpg",
    type: "Scene Study",
    date: "Saturday 23rd September",
    time: " 10AM - 1PM",
    price: "£25",
    link: "https://www.unitedagents.co.uk/oscar-toeman",
  },
  {
    instructorName: "Lucy Jane Atkinson",
    key: "LUCY_JANE_ATKINSON",
    desc: [
      "Barrier(s) - National Theatre",
      "The Sleeping Sword - Watermill Theatre",
      "Meat - Theatre 503",
      "A Hundred Words for Snow - Trafalgar Studios",
    ],
    imgPath: "/headshots/thumbnail_LucyJaneAtikinston.jpg",
    type: "Scene Study ",
    date: "Saturday 30th September",
    time: " 10AM - 1PM",
    price: "£25",
    link: "https://lucyjaneatkinson.com",
  },
] as Workshop[];
