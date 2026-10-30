"use client";

import { ArrowUpRight, Flower2, Gift, MapPin, QrCode } from "lucide-react";
import { basketLocations, basketSlots, type FlowerBasket } from "@/lib/activities";
import { ActivityImage } from "./activity-image";
import { ActivityCover } from "./activity-cover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function BasketDetails({ basket }: { basket: FlowerBasket }) {
  return (
    <>
      <header className="basket-dialog-heading">
        <DialogTitle>{basket.name}</DialogTitle>
      </header>
      <div className="basket-dialog-scroll">
        <dl className="basket-facts">
          <div>
            <dt>
              <MapPin size={15} />
              摆放位置
            </dt>
            <dd>{basketLocations[basket.location]}</dd>
          </div>
        </dl>
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
                  {image.caption && <figcaption>{image.caption}</figcaption>}
                </figure>
              ))
            ) : (
              <div className="media-placeholder">
                <Flower2 size={34} />
                <span>花篮详细图待补充</span>
              </div>
            )}
          </section>
          <div className="basket-detail-aside">
            <section className="basket-giveaways">
              <h3>
                <Gift size={17} />
                花篮无料
              </h3>
              {basket.giveawayImage ? (
                <ActivityImage
                  image={basket.giveawayImage}
                  sizes="(max-width: 700px) calc(100vw - 72px), 390px"
                />
              ) : (
                <p className="community-muted">无料展示图待补充</p>
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
        <h2>应援花篮</h2>
        <span className="collection-count">
          {String(filled).padStart(2, "0")} / {basketSlots.length} 个展示位
        </span>
      </div>
      <div className="basket-locations" aria-label="花篮摆放地点">
        {Object.values(basketLocations).map((location) => (
          <span key={location}>
            <MapPin size={14} aria-hidden="true" />
            {location}
          </span>
        ))}
      </div>
      <div className="basket-grid">
        {basketSlots.map(({ number, basket }) =>
          basket ? (
            <Dialog key={number}>
              <DialogTrigger asChild>
                <button
                  className="basket-card"
                  aria-label={`查看${basket.name}详情`}
                >
                  <ActivityCover kind="flower-baskets" />
                  <div className="basket-card-copy">
                    <span className="community-eyebrow">
                      NO. {String(number).padStart(2, "0")} · 应援花篮
                    </span>
                    <h3>
                      {basket.name}
                      <ArrowUpRight size={20} />
                    </h3>
                    <p>{basketLocations[basket.location]}</p>
                    <span className="basket-open">详细图 · 无料 · 交流群</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
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
              <p>花篮信息待公布</p>
            </div>
          ),
        )}
      </div>
    </>
  );
}
