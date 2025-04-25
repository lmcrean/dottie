import express from "express";

// Import route files
import createRouter from "./create/routes.js";
import listRouter from "./getList/routes.js";
import detailRouter from "./getDetail/routes.js";
import updateRouter from "./update/routes.js";
import deleteRouter from "./delete/routes.js";

const router = express.Router();

// Mount individual route handlers
router.use(createRouter);
router.use(listRouter);
router.use(detailRouter);
router.use(updateRouter);
router.use(deleteRouter);

export default async function (context, req) {
    context.res = {
        status: 200,
        body: { status: "ok", message: "Server is running" }
    };
}