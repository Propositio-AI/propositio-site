const items = [
  { heading: "Email", body: <>info@propositio.com</> },
  {
    heading: "Address",
    body: (
      <>
        〒610-0394
        <br />
        京田辺市多々羅都谷1-3
        <br />
        同志社ローム記念館 RM208
      </>
    ),
  },
  { heading: "Provided by", body: <>Propositio AI</> },
];

const ContactInfo = () => {
  return (
    <div className="flex flex-col gap-5">
      {items.map(({ heading, body }) => (
        <div key={heading}>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            {heading}
          </p>
          <p className="mt-1.5 text-base font-semibold leading-relaxed text-slate-900">{body}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
