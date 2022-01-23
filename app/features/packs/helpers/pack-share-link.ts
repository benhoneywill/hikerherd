import { Routes } from "blitz";

const APP_ORIGIN = process.env.BLITZ_PUBLIC_APP_ORIGIN;

const packShareLink = (id: string) => {
  return (
    APP_ORIGIN +
    Routes.PackSharePage({ packId: id }).pathname.replace("[packId]", id)
  );
};

export default packShareLink;
