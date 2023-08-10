import { question } from "readline-sync";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();
//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function movieSearch() {
  await client.connect();
  console.log("Conection successful");
  let moviename = "";
  const text =
    "Select  id, name, date, runtime, budget, revenue, vote_average, votes_count from movies Where name ilike $1 Order By vote_average desc Limit 10";
  while (true) {
    moviename = question("Search for what movie? (or 'q' to quit): ");
    if (moviename == "q") {
      break;
    }
    let values = [`%${moviename}%`];
    const result = await client.query(text, values);
    console.table(result.rows);
  }

  await client.end();
}

movieSearch();

// async function questionAnswer() {
//   let moviename = "";
//   do {
//     moviename = question("Search for what movie? (or 'q' to quit): ");
//     console.log("The movie name is " + moviename);
//   } while (moviename != "q");
// }

// questionAnswer();

console.log("Welcome to search-movies-cli!");
