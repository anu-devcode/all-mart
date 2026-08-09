/** Public-facing All Mart contact & socials (from business listings). */
export const companyContact = {
  brandName: "All Mart",
  tagline: "Digital retail across Addis Ababa — live stock, free pickup.",
  email: "Ethio.allmart@gmail.com",
  /** Mobile (Facebook listing) */
  phoneMobile: "099 149 1959",
  phoneMobileTel: "+251991491959",
  /** Gerji landline (Google listing) */
  phoneLandline: "011 629 5876",
  phoneLandlineTel: "+251116295876",
  website: "https://allmartethiopia.com",
  websiteLabel: "allmartethiopia.com",
  hqAddress: "Gerji Mebrat Hayel, Addis Ababa, Ethiopia",
  city: "Addis Ababa, Ethiopia",
  hoursNote: "Most branches open from 7–8 AM",
} as const;

export type SocialLink = {
  id: "facebook" | "tiktok" | "website" | "email";
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/search/top?q=ALL%20MART%20Gerji%20Mebrat%20Hayel",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@allmartsupermarket1",
  },
  {
    id: "website",
    label: "Website",
    href: companyContact.website,
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${companyContact.email}`,
  },
];
