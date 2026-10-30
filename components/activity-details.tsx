import { ArrowUpRight, CalendarDays, Clock3, Gift, Package } from "lucide-react";
import { serviceStation, type Giveaway } from "@/lib/activities";
import { ActivityImage } from "./activity-image";

function DistributionList({
  title,
  items,
  materials = false,
}: {
  title: string;
  items: Giveaway[];
  materials?: boolean;
}) {
  const Icon = materials ? Package : Gift;
  return (
    <section className="community-panel distribution-panel">
      <h2>
        <Icon size={21} strokeWidth={1.5} />
        {title}
      </h2>
      {items.length ? (
        <ul className="distribution-list">
          {items.map((item) => (
            <li key={item.name}>
              {item.image && (
                <ActivityImage
                  image={item.image}
                  sizes="(max-width: 700px) 80vw, 480px"
                />
              )}
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="distribution-pending">
          <Icon size={34} strokeWidth={1} />
          <h3>{materials ? "发放物资待公布" : "无料清单待公布"}</h3>
        </div>
      )}
    </section>
  );
}

export function ServiceStationDetails() {
  return (
    <div className="activity-detail-content">
      <div className="station-overview station-overview-illustrated">
        <section
          className="community-panel station-location-guide"
          aria-labelledby="station-location-heading"
        >
          <h2 id="station-location-heading">服务站位置示意</h2>
          <div className="station-location-images">
            {serviceStation.locationImages.map((image) => (
              <figure key={image.src}>
                <ActivityImage
                  image={image}
                  sizes="(max-width: 850px) calc(100vw - 84px), 620px"
                />
                <figcaption>
                  <span>{image.caption}</span>
                  <a
                    href={image.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`查看${image.caption}大图（新窗口）`}
                  >
                    查看大图 <ArrowUpRight size={14} />
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <div className="station-service-panels">
          <section className="community-panel station-time" aria-label="服务时间">
            <dl>
              <div>
                <dt>
                  <CalendarDays size={17} />
                  日期
                </dt>
                <dd>{serviceStation.date}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={17} />
                  时段
                </dt>
                <dd>{serviceStation.hours}</dd>
              </div>
            </dl>
          </section>
          <DistributionList
            title="免费服务"
            items={serviceStation.supplies}
            materials
          />
          <DistributionList title="发放无料" items={serviceStation.giveaways} />
        </div>
      </div>
    </div>
  );
}
