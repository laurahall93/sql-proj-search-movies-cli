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
  while (true) {
    let userInput = question(
      " [1] Search \n [2] See favorites ? \n [3] to quit: "
    );
    if (userInput == "3") {
      console.log("All done!");
      break;
    } else if (userInput == "1") {
      let moviename = question("Enter the movie name: ");
      const result = await searchMovie(moviename);
      console.table(result.rows);
      let whichRow = question(
        "Select the movie number, which you want to add as favorite: "
      );
      insertFavorites(result.rows[parseInt(whichRow)].id);
    } else if (userInput == "2") {
      const result = await searchFavorites();
      console.table(result.rows);
    }
  }
  await client.end();
}

async function searchMovie(moviename: string) {
  const text =
    "Select  id, name, date, runtime, budget, revenue, vote_average, votes_count from movies Where name ilike $1 Order By vote_average desc Limit 10";
  let values = [`%${moviename}%`];
  const result = await client.query(text, values);
  return result;
}

async function searchFavorites() {
  const text =
    "Select movies.id, name, date, runtime, budget, revenue, vote_average, votes_count From movies Join favorites on movies.id = favorites.movie_id";
  const result = await client.query(text);
  return result;
}

async function insertFavorites(movie_id: number) {
  const values = [movie_id];
  const text = "Insert into favorites (movie_id) values ($1)";
  const result = await client.query(text, values);
  if (result.rowCount != 0) {
    console.log("favorites added");
  } else {
    console.log("insert failed");
  }
}

console.log("Welcome to search-movies-cli!");
movieSearch();
