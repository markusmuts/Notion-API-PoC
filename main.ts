import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("NOTION_TOKEN loaded:", !!process.env.NOTION_TOKEN);
  console.log("Token value:", process.env.NOTION_TOKEN ? "set" : "not set");
  const notion = new Client({
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