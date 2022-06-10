const express = require("express");
const res = require("express/lib/response");
const app = express();
const https = require("https");
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
var _ = require('lodash');

// dbname = todolistDB
const uri = "";
try {
    mongoose.connect(uri);
} catch (error) {
    console.log("could not connect", err);
}

const date = require(__dirname + "/date.js");

app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.set('view engine', 'ejs');

const itemSchemma = new mongoose.Schema({
    name: String
})
const Item = mongoose.model('item', itemSchemma);


const welcome = new Item({
    name: 'Welcome to todoList app'
});
const opera = new Item({
    name: 'click checkbox to delete item'
});
defaultItems = [welcome, opera];


const listSchemma = new mongoose.Schema({
    name: String,
    items: [itemSchemma]
});
const List = mongoose.model('list', listSchemma);


app.get('/', (req, res) => {
    // day = date();
    Item.find({}, 'name', function (err, item) {
        if (err) res.send(err);
        else {
            if (item.length == 0) {
                Item.insertMany(defaultItems, function (err, res) {
                    if (err)
                        console.log(err);
                })
                res.redirect('/');
            } else {
                res.render('index', {
                    listTitle: 'Today',
                    newListItem: item
                });
            }
        }
    })
});


app.post('/', function (req, res) {
    const nme = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: nme
    });

    if (listName === 'Today') {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({
            name: listName
        }, function (err, resp) {
            if (!err) {
                resp.items.push(item);
                resp.save();

                res.redirect('/' + listName);
            }
        });
    }
})

app.post('/delete', function (req, res) {
    const checkedItemID = req.body.deleteId;
    const listName = req.body.list;

    if (listName === 'Today') {
        Item.findByIdAndRemove(checkedItemID, function (err, resp) {
            if (err) console.log(err);
        });
        res.redirect('/');
    } else {
        List.findOneAndUpdate({
                name: listName
            }, {
                $pull: {
                    items: {
                        _id: checkedItemID
                    }
                }
            },
            function (err, foundLst) {
                if (!err)
                    res.redirect('/' + listName);
            });

    }
});

app.get('/:name', function (req, res) {
    const customListName = _.capitalize(req.params.name);

    List.findOne({
        name: customListName
    }, function (err, resp) {
        if (!err) {
            if (!resp) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customListName);
            } else {
                res.render('index', {
                    listTitle: resp.name,
                    newListItem: resp.items
                });
            }
        }
    });

})

app.listen(port);