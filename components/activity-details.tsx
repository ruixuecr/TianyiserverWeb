import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Gift,
  MapPin,
  Package,
  Soup,
} from "lucide-react";
import {
  haidilaoActivity,
  placeSearchUrl,
  serviceStation,
  type ActivityLocation,
  type Giveaway,
} from "@/lib/activities";
import { ActivityImage } from "./activity-image";

function LocationCard({ location }: { location: ActivityLocation }) {
  return (
    <section className="station-location community-panel">
      <div className="location-emblem" aria-hidden="true">
        <MapPin size={38} strokeWidth={1.2} />
      </div>
      <div>
        <span className="community-eyebrow">活动位置</span>
        <h2>{location.name}</h2>
        <p>{location.address}</p>
        {location.mapQuery ? (
          <a
            className="community-link"
            href={placeSearchUrl(location.mapQuery)}
            target="_blank"
            rel="noreferrer"
          >
            在高德查看位置 <ArrowUpRight size={17} />
            <span className="sr-only">（新窗口）</span>
          </a>
        ) : (
          <span className="pending-label">确认点位后开放导航</span>
        )}
      </div>
    </section>
  );
}

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
      <div className="collection-note">
        <Gift size={20} />
        <div>
          <h3>领取说明</h3>
          <p>{serviceStation.collection}</p>
        </div>
      </div>
    </div>
  );
}

export function HaidilaoDetails() {
  return (
    <div className="activity-detail-content">
      <div className="station-overview">
        <LocationCard location={haidilaoActivity.location} />
        <section className="community-panel station-time">
          <h2>活动时间</h2>
          <dl>
            <div>
              <dt>
                <CalendarDays size={17} />
                日期
              </dt>
              <dd>{haidilaoActivity.date}</dd>
            </div>
            <div>
              <dt>
                <Clock3 size={17} />
                时段
              </dt>
              <dd>{haidilaoActivity.hours}</dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="community-panel hotpot-arrangement">
        <Soup size={38} strokeWidth={1.1} />
        <div>
          <h2>活动内容与参与方式</h2>
          <p>{haidilaoActivity.participation}</p>
        </div>
      </section>
      <div className="community-bottom-link">
        <Link className="community-link" href="/recommendations">
          美食与商场推荐 <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
