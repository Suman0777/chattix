import {v2 as cloudary} from "cloudinary";

cloudary.config({
    cloud_name: process.env.cLOUDINARY_CLOUD_NAME,
    api_key: process.env.cLOUDINARY_API_KEY,
    api_secret: process.env.cLOUDINARY_API_SECRET
});

export default cloudary;
