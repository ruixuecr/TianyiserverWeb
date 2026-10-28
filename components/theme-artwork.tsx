import { Music2 } from "lucide-react";

const motifs = {
  ribbon: { src: "blue-gold-ribbon", width: 591, height: 374 },
  petals: { src: "blue-petals", width: 939, height: 987 },
  infinity: { src: "infinity", width: 922, height: 910 },
  note: { src: "winged-note", width: 1280, height: 625 },
};

export function ThemeMotif({
  kind,
  className = "",
}: {
  kind: keyof typeof motifs;
  className?: string;
}) {
  const motif = motifs[kind];
  return (
    <span
      className={`theme-motif motif-${kind} ${className}`}
      aria-hidden="true"
    >
      <img
        src={`/images/theme/${motif.src}.jpg`}
        width={motif.width}
        height={motif.height}
        alt=""
        draggable={false}
      />
    </span>
  );
}

export function TimeArtwork() {
  return (
    <figure className="time-artwork">
      <div className="time-orbit" aria-hidden="true">
        <div className="time-orbit-ticks" />
        <span className="orbit-numeral numeral-twelve">XII</span>
        <span className="orbit-numeral numeral-three">III</span>
        <span className="orbit-numeral numeral-six">VI</span>
        <span className="orbit-numeral numeral-nine">IX</span>
      </div>
      <ThemeMotif kind="petals" className="artwork-petals" />
      <img
        className="piano-duet"
        src="/images/theme/piano-duet.jpg"
        alt="蓝白衣装的角色坐在钢琴琴键上，身旁环绕花簇与飘带"
        width={1280}
        height={663}
        fetchPriority="high"
      />
      <figcaption>
        <span className="artwork-caption-rule" />
        <Music2 size={13} strokeWidth={1.5} />
        <span>有些瞬间，值得无限回放。</span>
      </figcaption>
      <span className="artwork-edition" aria-hidden="true">
        MOMENTS / MELODIES
      </span>
    </figure>
  );
}
