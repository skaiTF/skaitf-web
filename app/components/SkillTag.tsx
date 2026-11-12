interface SkillTagProps {
  name: string;
  /** Simple Icons slug (https://simpleicons.org), e.g. "typescript". Omit for no logo. */
  icon?: string;
}

export default function SkillTag({ name, icon }: SkillTagProps) {
  return (
    <span className="hud-tag">
      {icon && (
        <span
          className="skill-icon"
          style={{ maskImage: `url(https://cdn.simpleicons.org/${icon})`, WebkitMaskImage: `url(https://cdn.simpleicons.org/${icon})` }}
          aria-hidden="true"
        />
      )}
      {name}
    </span>
  );
}
