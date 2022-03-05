const config = require('../config')
const fs = require('fs');
const readline = require('readline');
const fetch = require("node-fetch")

module.exports = {
    execute: async function(log){
        await processLineByLine()
    }
}

async function processLineByLine() {
    var itemsProcessed = 0;
    const fileStream = fs.createReadStream('input.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    ItemCount = rl.length;
    console.log(ItemCount);
    for await (const line of rl) {
        itemsProcessed++;
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);
        let movie = line;
        if(movie){
            MovieDBgrabber(movie)
        }
        if(itemsProcessed === rl.length) {
            callback();
        }
    }
}


async function MovieDBgrabber(search){
    //const search = args.join("-")
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${config.MovieKey}&language=en-US&query=${search}&page=1&include_adult=false`).then(response => {
        //console.log(response)
        return response.json()
    }).then(data => {
        const result = data.results[0]
        if(!result.title){
            return
        }
        const title = result.title
        const Reviews = result.vote_average
        const image = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${result.poster_path}`
        //const relase_date = result.relase_date
        fetch(`https://api.themoviedb.org/3/movie/${result.id}?api_key=${config.MovieKey}&language=en-US`).then(response => {
            return response.json()
        }).then(DB => {
            //console.log(DB)
            const production_companies = DB.production_companies[0].name
            let genres = ""
            for (let i = 0; i < DB.genres.length; i++) {
                const element = DB.genres[i].name.replace(/\s/g, '');;
                genres = genres + ` #${element},`
            }
            const relase_date = DB.release_date
            fetch(`https://api.themoviedb.org/3/movie/${result.id}/credits?api_key=${config.MovieKey}&language=en-US`).then(response => {
                return response.json()
            }).then(credits => {
                let Author = "Unknow"
                //const genres = DB.genres[0].name
                const crew = credits.crew
                //console.log(crew)
                for (let i = 0; i < crew.length; i++) {
                    if(crew[i].job === "Director"){
                        Author = crew[i].name
                    }

                }
                const filename=title.replace(/[^a-z\d\s]+/gi, "")
                let text = `---\nimage: ${image}\ntags: in/movies\naliases: ${filename}\ncssclass: null\n---\n## Title: { ${title} }\n### Metadata tags:: ${genres}\ntype::{\nDirector:: ${Author}\nReleaseDate:: ${relase_date}\nRating:: ${Reviews}\n}\n `
                let msg = `\`\`\`\n ${text}\`\`\``
                //console.log(msg)
                fs.writeFile(`${config.outputDir}${filename}.md`, text, function (err) {
                    console.log(`${config.outputDir}${filename}.md done`)
                    if (err) throw err;
                    console.log('File is created successfully.');
                  });
            })
        })
    })
}