This program generate movie data to be used on obsidian.

It is based on Christian Bager Bach Houmann https://twitter.com/chrisbbh/status/1489327905511555073 book template

The data is grabbed using https://developers.themoviedb.org/3/getting-started/introduction

and you will need an api key from it.

To use this script create a rename `configExample.js` to `config.js` and change data with your folder you want to export to and your API key from MovieDB.

fill in `input.txt` with your movie list

Then do `npm i` and `node index.js` 

In the file you want to view the movies put in:

```
---
cssClasses: 
- cards
- cards-cover
---
\`\`\`dataview
TABLE without ID
	("![]("+image +")") as Cover,
	file.link,
	Director,
	ReleaseDate,
	(padleft("", Rating/2, "✰")) as ratings
from #in/movies
\`\`\`

```
