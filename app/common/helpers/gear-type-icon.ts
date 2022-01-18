import type { GearType } from "@prisma/client";

import { FaShoePrints, FaShapes, FaCookieBite } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdBackpack } from "react-icons/md";
import {
  GiCampingTent,
  GiNightSleep,
  GiWaterDrop,
  GiCookingPot,
  GiSoap,
  GiElectric,
  GiClothes,
} from "react-icons/gi";

const gearTypeIcon = (type: GearType) => {
  switch (type) {
    case "PACK":
      return MdBackpack;
    case "SHELTER":
      return GiCampingTent;
    case "SLEEP":
      return GiNightSleep;
    case "WATER":
      return GiWaterDrop;
    case "COOKWARE":
      return GiCookingPot;
    case "TOILETRIES":
      return GiSoap;
    case "ELECTRONICS":
      return GiElectric;
    case "CLOTHING":
      return GiClothes;
    case "FOOTWARE":
      return FaShoePrints;
    case "CONSUMABLES":
      return FaCookieBite;
    case "MISCELLANEOUS":
      return FaShapes;
    case "OTHER":
      return BsPatchQuestionFill;
    default:
      return BsPatchQuestionFill;
  }
};

export default gearTypeIcon;
