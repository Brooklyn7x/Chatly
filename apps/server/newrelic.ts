"use strict";

import dotenv from "dotenv";
dotenv.config();

exports.config = {
  app_name: process.env.NEW_RELIC_APP_NAME,
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: "info",
  },
};
