// var restify = require('restify-plugins'),
var moment = require('moment'),
    fs = require('fs'),
    yesterday = moment().hour(-24).format('YYYY-MM-DD').toString();

var axios = require('axios');

let express = require('express');
let app = express();
const port = 3000

app.get('/top100', (req, res) => {
    let str = ''
    search(object, (result) => {
        console.log(result, '123')
        res.send(result)
    })
})
app.post('/test', (req, res) => res.send('Test Hello World!'))


var object = {
    q: 'created:' + yesterday,
    sort: 'stars',
    order: 'desc',
    per_page: '100',
    page: '1'
};


function search(object, callback) {
    if (object.q) {
        // var client = app.get({
        //     url: 'https://api.github.com',
        // });

        var path = 'https://api.github.com/search/repositories?q=' + object.q;
        if (object.sort) path = path + '&sort=' + object.sort;
        if (object.order) path = path + '&order=' + object.order;
        if (object.per_page) path = path + '&per_page=' + object.per_page;
        if (object.page) path = path + '&page=' + object.page;

        // console.log(object, 'obj')
        // console.log(path, object, '')
        axios.get(path).then(function(response) {
            var items = response.data.items
            var content = "语言|star|项目名称|描述\n---|---|---|---\n";
            for (var i = 0; i < items.length; i++) {
                var text = (items[i].language || " ") + "|" + (items[i].stargazers_count || " ") + "|[" + (items[i].full_name || " ") + "](" + items[i].html_url + ")|" + (items[i].description || " ") + "\n";
                content = content + text;
            }
            // console.log(content, 'content')
            fs.writeFile('./' + yesterday + '.md', content, function(err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });
            callback && callback(response.data)
        });
        // axios.get(path, function(err, req_, res_, obj) {
        //     console.log(path, obj, '123')
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         var items = obj.items;
        //         var content = "语言|star|项目名称|描述\n---|---|---|---\n";
        //         for (var i = 0; i < items.length; i++) {
        //             var text = (items[i].language || " ") + "|" + (items[i].stargazers_count || " ") + "|[" + (items[i].full_name || " ") + "](" + items[i].html_url + ")|" + (items[i].description || " ") + "\n";
        //             content = content + text;
        //         }
        //         console.log(content, 'content')
        //         fs.writeFile('./Top100/Top100_' + yesterday + '.md', content, function(err) {
        //             if (err) throw err;
        //             console.log('It\'s saved!');
        //         });
        //     }
        // });
    }
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))