import { z } from "zod";

export type Referee = {
  name: string;
  pronouns: string;
  email: string;
  phoneNumber: string;
};
export type Application = {
  name: string;
  email: string;
  pronouns: string;
  workshops: string[];
  credits: string;
  emailPreference: boolean;
  phoneNumber: string;
  referee: Referee | undefined;
};

const ukPhoneNumberRegEx = new RegExp(
  /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/
);

export const ApplicationSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  pronouns: z.string().nonempty(),
  phoneNumber: z.string().regex(ukPhoneNumberRegEx),
  workshops: z.string().array(),
  credits: z.string(),
  emailPreference: z.boolean(),
  referee: z
    .object({
      name: z.string().nonempty(),
      email: z.string().email(),
      pronouns: z.string().nonempty(),
      phoneNumber: z.string().regex(ukPhoneNumberRegEx),
    })
    .optional(),
  // referee: z.union([
  //   z.object({
  //     name: z.string(),
  //     email: z.string().email(),
  //     pronouns: z.string(),
  //     phoneNumber: z.string().regex(ukPhoneNumberRegEx),
  //   }),
  //   z.undefined(),
  // ]),
});
