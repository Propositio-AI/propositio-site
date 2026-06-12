type NumberedCardProps = {
  index: number;
  title: string;
  body: string;
};

/** 「01 / 02 / 03」の番号付きカード。課題やバリューの列挙に使う */
const NumberedCard = ({ index, title, body }: NumberedCardProps) => {
  return (
    <div className="hover-lift h-full rounded-[22px] border border-slate-100 bg-slate-50 p-8">
      <span className="font-heading text-[15px] font-extrabold text-blue-400">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="mt-3.5 text-[19px] font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-[15px] leading-[1.95] text-slate-500">{body}</p>
    </div>
  );
};

export default NumberedCard;
