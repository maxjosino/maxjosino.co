import { EXPERIENCES } from "@/lib/site-data";

export function ExperienceSection() {
  return (
    <section className="experience">
      <h2 className="section-title">Experience</h2>
      <table aria-label="Selected experience">
        <tbody>
          {EXPERIENCES.map((experience) => (
            <tr key={`${experience.company}-${experience.role}`} className={experience.blurred ? "blur" : undefined}>
              <td>{experience.company}</td>
              <td>{experience.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
