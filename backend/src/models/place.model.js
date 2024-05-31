"use strict";

const { Schema, model } = require("mongoose");
const { PROVINCES } = require("../constant/vietnameseProvinces");
const DOCUMENT_NAME = "Place";
const COLLECTION_NAME = "Places";

const places_type = [
  "airport",
  "amusement_park",
  "aquarium",
  "art_gallery",
  "bakery",
  "beach",
  "coffee",
  "hotel",
  "museum",
  "park",
  "restaurant",
  "shopping_mall",
  "tourist_attraction",
  "transportation",
  "travel_agency",
];
const placeSchema = new Schema(
  {
    name: { type: String, required: true },
    place_id: { type: String, required: true },
    type: { type: String, required: true, enum: places_type },
    address: { type: String, required: true },

    website: { type: String, default: "" },
    phone: { type: String, default: "" },
    images: {
      type: Array,
      default: [
        "https://cdn4.iconfinder.com/data/icons/user-interface-131/32/sad_store-512.png",
      ],
    },
    province: { type: String, required: true, enum: PROVINCES },
    city: { type: String },
    operating_hours: { type: Object, default: {} },
    facilities: { type: Schema.Types.Mixed, default: {} },
    geolocation: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    tags: { type: [Schema.Types.ObjectId], ref: "Tag" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

placeSchema.index({ name: "text", address: "text" });
placeSchema.index({ geolocation: "2dsphere" });

const coffeeSchema = new Schema(
  {
    menus: { type: Array, default: [] },
  },
  {
    collection: "Coffees",
    timestamps: true,
  }
);

const tourAttractionSchema = new Schema(
  {},
  {
    collection: "TourAttractions",
    timestamps: true,
  }
);

module.exports = {
  PlaceModel: model(DOCUMENT_NAME, placeSchema),
  CoffeeModel: model("Coffee", coffeeSchema),
  TourAttractionModel: model("TourAttraction", tourAttractionSchema),
};

// _id: Types.ObjectId;

// @Prop({ type: String, required: true })
// name: string;

// @Prop({ type: String, required: true })
// placeId: string;

// @Prop({ type: String })
// phone: string;

// @Prop({ type: String })
// website: string;

// @Prop({ type: Object })
// operating_hours: Record<string, string>;

// @Prop({
//   type: String,
//   default:
//     'https://cdn4.iconfinder.com/data/icons/user-interface-131/32/sad_store-512.png',
// })
// thumbnail: string;

// @Prop({ type: [String], default: [] })
// images: string[];

// @Prop({ type: Number, required: true })
// latitude: number;

// @Prop({ type: Number, required: true })
// longitude: number;

// @Prop({ type: Number })
// latitudeDelta: number;

// @Prop({ type: Number })
// longtitudeDelta: number;

// @Prop({ type: Number, default: 0 })
// rating: number;

// @Prop({ type: String, enum: PlaceCategory, default: PlaceCategory.UNKOWN })
// category: string;

// @Prop({ type: Number, default: 0 })
// reviews: number;

// @Prop({ type: Number, default: 0 })
// viewCount: number;

// @Prop({ type: Object })
// service_options: Record<string, boolean>;

// @Prop({ type: String, required: true })
// province: string;

// @Prop({ type: String })
// city: string;
