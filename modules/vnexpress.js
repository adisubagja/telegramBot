const Parser = require('rss-parser');
const { default: axios } = require('axios');
const minWord = 30;
const maxWord = 170;
const linkRSS = 'https://vnexpress.net/rss/tin-moi-nhat.rss';
function getStr(str, start, end) {
    if(!str) return  null;

    let regex = start + "([\\s\\S]*?)" + end;
    let match = str.match(regex);

    return match ? match[1] : null
}

function getAllStr(str, start, end) {
    if(!str) return  null;

    let regex = new RegExp(start + '([\\s\\S]*?)' + end, 'g');
    let match = str.match(regex);

    if (match) {
        return match;
    }

    return null;
}
const getDescription = (content) => {
    let descriptions = getAllStr(content, '<p', '</p>');

    if (!descriptions) return null;
    let descReturn = '';
    let currentNumWord = 0;
    for(const description of descriptions) {
        let desc = description.replace(/(<([^>]+)>)/ig,"");
        let numWord = desc.split(' ').length;
        if (numWord >= minWord && !description.includes('videoplayer') && !description.includes('image')) {
            if (numWord + currentNumWord < maxWord) {
                descReturn += `${desc} `;
                currentNumWord += numWord;
            } else {
                break;
            }
        }
    }

    return descReturn ? descReturn.replace(/>/,'') : null;
}


module.exports = {
    getVnExpress: () => {
        return new Promise(async(resolve, reject) => {
            let parser = new Parser();
        let feed = await parser.parseURL(linkRSS);
        let news = [];
        for (const rss of feed.items) {
            if(rss.link.includes('https://vnexpress.net')) { //not get news from english/photo page
                let imgLink = getStr(rss.content, '<img src="','"');
                if (imgLink && !imgLink.includes('gif')) {
                    let response = await axios.get(rss.link);
                    let content = await response.data;
                    let article = getStr(content, '<article', '</article');
                    let description = getDescription(article);
                    if (description) {
                        description = description.replace(`  `,' ');
                        news.push({
                            title: rss.title,
                            img: imgLink,
                            description: description,
                        });
                    }
                }


            }
        }
        resolve(news);
        })
    }
}