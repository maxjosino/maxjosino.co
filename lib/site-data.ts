interface ExperienceItem {
  company: string;
  role: string;
  blurred?: boolean;
}

export const GITHUB_USERNAME = "maxjosino";
export const GITHUB_PROFILE_URL = "https://github.com/maxjosino";

export const EXPERIENCES: ExperienceItem[] = [
  { company: "Ground", role: "Founding Product Designer & Engineer" },
  { company: "Fast", role: "Senior Product Designer" },
  { company: "Creditas", role: "Senior Product Designer" },
  { company: "Nubank", role: "Senior Product Designer / Engineer" },
  { company: "Guidebook", role: "UI Designer", blurred: true },
  { company: "Soda Virtual", role: "Designer", blurred: true }
];
