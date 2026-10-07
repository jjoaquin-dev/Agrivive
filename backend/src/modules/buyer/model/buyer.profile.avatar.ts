import { t } from "elysia";

export const buyerProfileAvatarModel = t.Object({
  file: t.File({
    type: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024,
  }),
});

export type BuyerProfileAvatarDTO = {
  file: File;
};
