"use client";

import {
  ArrowUpRight,
  Clock3,
  Flower2,
  Gift,
  MapPin,
  QrCode,
  Ticket,
} from "lucide-react";
import { basketSlots, type FlowerBasket } from "@/lib/activities";
import { ActivityImage } from "./activity-image";
import { ActivityCover } from "./activity-cover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function BasketDetails({ basket }: { basket: FlowerBasket }) {
  return (
    <>
      <header className="basket-dialog-heading">
        <span className="community-eyebrow">
          FLOWERS FOR YOU {basket.sample && " / 展示示例"}
        </span>
        <DialogTitle>{basket.name}</DialogTitle>
        <DialogDescription>{basket.description}</DialogDescription>
      </header>
      <div className="basket-dialog-scroll">
        <div className="basket-dialog-grid">
          <section className="basket-detail-photos" aria-label="花篮详细图">
            <h3>
              <Flower2 size={17} />
              花篮详细图
            </h3>
            {basket.images.length ? (
              basket.images.map((image) => (
                <figure key={image.src}>
                  <ActivityImage
                    image={image}
                    sizes="(max-width: 700px) calc(100vw - 72px), 520px"
                  />
                  <figcaption>{image.caption || basket.name}</figcaption>
                </figure>
              ))
            ) : (
              <div className="media-placeholder">
                <Flower2 size={34} />
                <span>花篮详细图待补充</span>
              </div>
            )}
            <dl className="basket-facts">
              <div>
                <dt>
                  <MapPin size={15} />
                  摆放位置
                </dt>
                <dd>{basket.location}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={15} />
                  活动时间
                </dt>
                <dd>{basket.time}</dd>
              </div>
              <div>
                <dt>花篮发起人</dt>
                <dd>{basket.organizer}</dd>
              </div>
            </dl>
          </section>
          <div className="basket-detail-aside">
            <section className="basket-giveaways">
              <h3>
                <Gift size={17} />
                花篮无料
              </h3>
              <p className="community-muted">{basket.giveawayNote}</p>
              <ul>
                {basket.giveaways.map((item) => (
                  <li key={item.name}>
                    {item.image ? (
                      <ActivityImage image={item.image} sizes="240px" />
                    ) : (
                      <Ticket size={25} strokeWidth={1.2} />
                    )}
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {!basket.giveaways.length && (
                <p className="community-muted">无料清单待公布</p>
              )}
            </section>
            <section className="basket-group">
              <h3>
                <QrCode size={17} />
                花篮交流群
              </h3>
              {basket.groupQr ? (
                <div className="basket-qr">
                  <ActivityImage image={basket.groupQr} sizes="200px" qr />
                </div>
              ) : (
                <div className="qr-pending">
                  <QrCode size={30} strokeWidth={1.2} aria-hidden="true" />
                  <span>群二维码待补充</span>
                </div>
              )}
              <p className="community-muted">{basket.groupNote}</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export function BasketGallery() {
  const filled = basketSlots.filter((slot) => slot.basket).length;
  return (
    <>
      <div className="community-section-heading">
        <div>
          <span className="community-eyebrow">THE FLOWER COLLECTION</span>
          <h2>每一份心意，都有自己的花期。</h2>
        </div>
        <span className="collection-count">
          {String(filled).padStart(2, "0")} / {basketSlots.length} 个展示位
        </span>
      </div>
      <div className="basket-grid">
        {basketSlots.map(({ number, basket }) =>
          basket ? (
            <Dialog key={number}>
              <DialogTrigger asChild>
                <button
                  className="basket-card"
                  aria-label={`查看${basket.name}花篮详情`}
                >
                  <ActivityCover kind="flower-baskets" />
                  <div className="basket-card-copy">
                    <span className="community-eyebrow">
                      NO. {String(number).padStart(2, "0")}{" "}
                      {basket.sample ? "· 展示示例" : "· 应援花篮"}
                    </span>
                    <h3>
                      {basket.name}
                      <ArrowUpRight size={20} />
                    </h3>
                    <p>{basket.location}</p>
                    <span className="basket-open">详细图 · 无料 · 交流群</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <BasketDetails basket={basket} />
              </DialogContent>
            </Dialog>
          ) : (
            <div
              className="basket-slot-pending"
              key={number}
              aria-label={`花篮 ${number} 号位置待公布`}
            >
              <span className="basket-slot-number">
                {String(number).padStart(2, "0")}
              </span>
              <Flower2 size={32} strokeWidth={1} />
              <h3>静候花开</h3>
              <p>花篮信息待公布</p>
            </div>
          ),
        )}
      </div>
    </>
  );
}
