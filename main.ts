import { Client, isFullDatabase, isFullPage } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

// Peame andmeid lisama Notion API kaudu (sponsoreeritud tooted ja turunduse juhised)

console.log("NOTION_TOKEN loaded:", !!process.env.NOTION_TOKEN);
console.log("Token value:", process.env.NOTION_TOKEN ? "set" : "not set");
const notion = new Client({ auth: process.env.NOTION_TOKEN, });

async function listAllDatabases() {
  const response = await notion.search({
    filter: {
      value: 'database',
      property: 'object'
    }
  });

  const databases = response.results.map(db => {
    // Type guard to ensure we are looking at a full Database object
    if (!isFullDatabase(db)) return null;

    return {
      id: db.id,
      // Notion titles are arrays; we join them to get the full string
      name: db.title.map(t => t.plain_text).join("")
    };
  }).filter(Boolean); // Remove nulls from partial objects

  console.log("Found Databases:", databases);
  return databases;
}

async function listAllEntries(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId
  });

  const entries = response.results.map(page => {
    // Type guard: Ensures the page has all properties loaded
    if (!isFullPage(page)) return null;

    return {
      id: page.id,
      url: page.url,
      properties: page.properties,
    };
  }).filter(Boolean);

  console.log(entries);
  entries.forEach(entry => {
    const nameProperty = entry?.properties.Name;
    if (nameProperty && nameProperty.type === "title" && nameProperty.title.length > 0) {
      console.log("Entry Name:", nameProperty.title[0].plain_text);
    } else {
      console.log("Entry Name: (No title found)");
    }
  });

}

async function createEntry(databaseId: string, eventPageId: string) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        "Name": {
          title: [{ text: { content: "pette" } }]
        },
        "Select": {
          select: { name: "Not started" }
        },
        "Event": {
          relation: [
            { id: eventPageId } // The ID of the related event page
          ]
        },
        "Due date": {
          date: { start: "2026-02-26" }
        },
        "Description": {
        rich_text: [
          {
            text: {
              content: "This is a detailed description added via the API."
            }
          }
        ]
      },

      },
    });

    console.log("Success! Entry created with ID:", response.id);
  } catch (error) {
    console.error("Error adding entry:", error);
  }
}


async function main() {
  console.log("Client created");
  const databases = await listAllDatabases();
  if (databases.length > 0 && databases[0]) {
    await listAllEntries(databases[0].id);
    await createEntry(databases[0].id, "310e54c4-a0ac-8008-b3b9-eebbc831b970"); 
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });