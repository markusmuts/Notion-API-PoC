"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@notionhq/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function main() {
    console.log("NOTION_TOKEN loaded:", !!process.env.NOTION_TOKEN);
    console.log("Token value:", process.env.NOTION_TOKEN ? "set" : "not set");
    const notion = new client_1.Client({
        auth: process.env.NOTION_TOKEN,
    });
    console.log("Client created");
    const response = await notion.databases.query({
        database_id: "30be54c4a0ac80f4bd5ae00024d1599d",
    });
    console.log("Got response:", response);
    console.log("Done");
}
main()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
