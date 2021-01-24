var moment = require('moment'),
    fs = require('fs'),
    // yesterday = moment().hour(-2).format('YYYY-MM-DD').toString();
    yesterday = 2017
var axios = require('axios');

var language = ''
let express = require('express');
let app = express();
const port = 3000

app.get('/top100', (req, res) => {
    let str = ''
    search(object, (result) => {
        console.log(result, yesterday, '123')
        res.send(result)
    })
})
app.get('/test', (req, res) => res.send('Test Hello World!'))


var object = {
    q: 'created:' + yesterday,
    sort: 'stars',
    order: 'desc',
    per_page: '100',
    page: '1'
};


function search(object, callback) {
    if (object.q) {
        var path = 'https://api.github.com/search/repositories?q=' + object.q;
        if (object.sort) path = path + '&sort=' + object.sort;
        if (object.order) path = path + '&order=' + object.order;
        if (object.per_page) path = path + '&per_page=' + object.per_page;
        if (object.page) path = path + '&page=' + object.page;
        if (object.language) path = path + '&language=' + object.language;

        console.log(path, 'path')
        axios.get(path).then(function(response) {
            var items = response.data.items
            var content = "语言|star|项目名称|描述\n---|---|---|---\n";
            for (var i = 0; i < items.length; i++) {
                var text = (items[i].language || "无") + "|" + (items[i].stargazers_count || "无") + "|[" + (items[i].full_name || "无") + "](" + items[i].html_url + ")|" + (items[i].description || "无") + "\n";
                content = content + text;
            }
            fs.writeFile('./' + yesterday + language + '.md', content, function(err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });
            callback && callback(response.data)
        });
    }
}


// function aaa() {

// }
// aaa()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))