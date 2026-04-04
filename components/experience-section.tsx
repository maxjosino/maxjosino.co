import { EXPERIENCES } from "@/lib/site-data";

const COMPANY_LINKS: Record<string, { href: string; brandClassName?: string }> = {
  Ground: {
    href: "https://joinground.com/",
    brandClassName: "is-ground"
  },
  Fast: {
    href: "",
    brandClassName: "is-fast"
  },
  Creditas: {
    href: "https://creditas.com/",
    brandClassName: "is-creditas"
  },
  Nubank: {
    href: "https://nubank.com/",
    brandClassName: "is-nubank"
  }
};

export function ExperienceSection() {
  return (
    <section className="experience">
      <h2 className="section-title">Experience</h2>
      <table aria-label="Selected experience">
        <tbody>
          {EXPERIENCES.map((experience) => {
            const companyLink = COMPANY_LINKS[experience.company];
            const rowClassName = [experience.blurred ? "blur" : null, companyLink?.brandClassName]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={`${experience.company}-${experience.role}`} className={rowClassName || undefined}>
                <td>
                  {companyLink?.href ? (
                    <a
                      className="experience-company-link"
                      href={companyLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {experience.company}
                    </a>
                  ) : (
                    experience.company
                  )}
                </td>
                <td>{experience.role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
