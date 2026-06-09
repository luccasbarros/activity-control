type PageHeadingProps = {
  actions?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeading({
  actions,
  eyebrow,
  title,
  description,
}: PageHeadingProps) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}
