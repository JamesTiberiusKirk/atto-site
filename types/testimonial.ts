export type Testimonial = {
  headshot: string | null
  quote: string
  from: string
  display: boolean
}

export type Quotes = {
  quote: string,
  display: boolean,
}

export type Picture = {
  link: string,
  display: boolean,
}

export type CarouselData = {
  quotes: Quotes[],
  pictures: Picture[],
}
