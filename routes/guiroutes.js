const express = require('express');
const router = express.Router();
const User = require('../models/Card');
const url = require('url');
const myUrl = new URL('http://localhost:5000/card/:bolen/:id/:a');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/blockaccess.js');



router.get('/card/:deck/:bol/:id/:wrongcount/:error', ensureAuthenticated, async (req, res) => {
    let error = req.params.error;
    let card;
    let deck = req.params.deck;
    let bol = req.params.bolen;
    let cardIndex = parseInt(req.params.id);
    let wrg_count = parseInt(req.params.wrongcount);
    let requestedQ = undefined;
    let requestedA = undefined;
    let currentId = undefined;
    let deckqanda = [];
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        console.log('important thing', subcollection);
        for(let i = 0; i < subcollection.length; i++){
            console.log('logging subcollection index', subcollection[i].deck);
            console.log('user selected deck', deck);
            if(subcollection[i].deck == deck){
                console.log('logging subcollection index', subcollection[i].deck);
                console.log('user selected deck', deck);
                deckqanda.push(subcollection[i]);
                                
            }
            
        }
        console.log(deckqanda);
        requestedQ = deckqanda[cardIndex].question;
        console.log(requestedQ);
        requestedA = deckqanda[cardIndex].answer;
        console.log(requestedA);
        currentId = deckqanda[cardIndex]._id;
        console.log(currentId);
        res.render('qanda', {
            question: requestedQ,
            answer: requestedA,
            count : cardIndex,
            tries: wrg_count,
            sectwo: deck,
            secthree: bol,
            currentId,
            error
        });
            
    }catch{
        if (card == null){
            res.redirect(`http://localhost:5000/card/${deck}`);
            console.log('Questions not found');
        }else{
            console.log('issue with gathering data');
        }
    }
        
    
});

router.get('/card', ensureAuthenticated, (req, res) => {
    res.render('card.ejs');
});

router.get('/card/deck', async (req, res) => {
    let card;
    let subcollection;
    let idlist = [];
    let nodup = [];
    let count = 0;
    let found = false;
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        for(let i = 0; i < subcollection.length; i++){
            console.log(subcollection[i].deck);
            idlist.push(subcollection[i].deck);
        }
        console.log(idlist);
        for( i = 0; i < idlist.length; i++){
            for( y = 0; y < nodup.length; y++){
                if(idlist[i] == nodup[y]){
                    console.log('orginal', idlist[i], 'checked', nodup[y]);
                    found = true;
                }
            }
            count++;
            if(count == 1  && found == false){
                nodup.push(idlist[i]);
                console.log('pushed data', idlist[i]);
            }
            count = 0;
            found = false;
        }
        console.log("new list");
        console.log('No Duplicates', nodup);
        res.render('deck.ejs',{
            deckname : nodup
        });
        console.log("Info gathered");
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Questions not found');
        }else{
            console.log('issue with gathering data');
        }
    }
    console.log(card);
})



router.get('/gui', ensureAuthenticated, async (req, res) => {
    let card;
    let subcollection;
    
    
    //console.log(card);
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        console.log('important thing', subcollection);
        
        res.render('gui.ejs',{
            alldata : subcollection
        });
        console.log("Info gathered");
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Questions not found');
        }else{
            console.log('issue with gathering data');
        }
    }
});
router.post('/gui', ensureAuthenticated, async (req, res) => {
    const {question, answer, deck} = req.body;
    let cards;
    //console.log(req.body);
    if(!question || !answer || !deck) {
        console.log("Please fill in all fields");
    }else{
        try{
            console.log(req.user.name);
            card = await User.findOne({name: req.user.name});
            console.log(card);
            subcollection = card.decks;
            console.log('important thing', subcollection);
            subcollection.push({
                question: question,
                answer: answer,
                deck: deck
            });
            await card.save();
            res.render('gui.ejs',{
                alldata : subcollection
            });
            console.log("Info gathered");
        }catch{
            if (card == null){
                res.redirect('http://localhost:5000/gui');
                console.log('Questions not found');
            }else{
                console.log('issue with gathering data');
            }
        }
        
    }
    
});

router.get('/gui/edit', ensureAuthenticated, async (req, res) => {
    let cards;
    let id;
    try{
        console.log(req.user.name);
        cards = await User.findOne({name: req.user.name});
        console.log(cards);
        subcollection = cards.decks;
        console.log('important thing', subcollection, 'stop');
        res.render('edit.ejs',{
            choiceedit : subcollection
        });
    }catch{
        if (cards == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change isiah');
        }else{
            console.log('another issue with gathering data');
        }
    }
});

router.get('/gui/edit/:cardid', ensureAuthenticated, async (req, res) => {
    console.log(req.params.cardid);
    let cardinfo = req.params.cardid;
    console.log(cardinfo);
    let card;
    
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        console.log('important thing', subcollection);
        for(let i = 0; i < subcollection.length; i++){
            console.log('logging subcollection index', subcollection[i]._id);
            if(subcollection[i]._id == cardinfo){
                console.log('logging subcollection index Pt2', subcollection[i]._id);
                let selectedEdit = subcollection[i];
                let editQ = selectedEdit.question;
                let editA = selectedEdit.answer;
                let editD = selectedEdit.deck;
                res.render('lastedit.ejs',{
                    editQ,
                    editA,
                    editD,
                    cardinfo
                });
            }else{
                console.log('Subcollection Requested ID Not Found');
            }
        }
        
    }catch{
        if (card == null){
            console.log(titty);
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change 1');
        }else{
            console.log('another issue with gathering data');
        }
    }
});

router.get('/gui/delete', ensureAuthenticated, async (req, res) => {
    let cards;
    try{
        cards = await User.findOne({name: req.user.name});
        console.log(cards);
        subcollection = cards.decks;
        console.log('important thing', subcollection, 'stop');
        res.render('delete.ejs',{
            allinfo : subcollection
        });
    }catch{
        if (cards == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to select to delete isiah');
        }else{
            console.log('another issue with gathering data');
        }
    };
});


router.put('/gui/edit/:cardid', ensureAuthenticated, async (req, res) => {
    let card;
    let id = req.params.cardid;
    console.log(id);
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        console.log('important thing', subcollection);
        for(let i = 0; i < subcollection.length; i++){
            console.log('logging subcollection index', subcollection[i]._id);
            if(subcollection[i]._id == id){
                console.log('logging subcollection index Pt2', subcollection[i]._id);
                let selectedEdit = subcollection[i];
                selectedEdit.question = req.body.question;
                console.log(selectedEdit.question);
                selectedEdit.answer = req.body.answer;
                console.log(selectedEdit.answer);
                selectedEdit.deck = req.body.deck;
                console.log(selectedEdit.deck);
                await card.save();
                console.log(card);
                res.redirect('http://localhost:5000/gui');
                console.log("Info changed");
            }else{
                console.log('Subcollection Requested ID Not Found');
            }
        }
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change 2');
        }else{
            console.log('another issue with updating');
        }
    }
});

router.get('/gui/delete/:deleteid', ensureAuthenticated, async (req, res) => {
    console.log(req.params.deleteid);
    let cardinfo = req.params.deleteid;
    console.log(cardinfo);
    let card;
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        console.log('important thing', subcollection);
        for(let i = 0; i < subcollection.length; i++){
            console.log('logging subcollection index', subcollection[i]._id);
            if(subcollection[i]._id == cardinfo){
                console.log('logging subcollection index Pt2', subcollection[i]._id);
                let selectedEdit = subcollection[i];
                let editQ = selectedEdit.question;
                let editA = selectedEdit.answer;
                let editD = selectedEdit.deck;
                res.render('lastdelete.ejs',{
                    editQ,
                    editA,
                    editD,
                    cardinfo
                });
            }else{
                console.log('Subcollection Requested ID Not Found');
            }
        }
    }catch{
        if (card == null){
            console.log(titty);
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change 1');
        }else{
            console.log('another issue with gathering data');
        }
    }
})

router.delete('/gui/delete/:deleteid', ensureAuthenticated, async (req, res) => {
    let card;
    try{
        console.log(req.user.name);
        card = await User.findOne({name: req.user.name});
        console.log(card);
        subcollection = card.decks;
        console.log('important thing', subcollection);
        for(let i = 0; i < subcollection.length; i++){
            console.log('logging subcollection index', subcollection[i]._id);
            if(subcollection[i]._id == req.params.deleteid){
                console.log('logging subcollection index Pt2', subcollection[i]._id);
                console.log(i);
                subcollection.splice(i, 1);
                await card.save();
                res.redirect('http://localhost:5000/gui');
            }else{
                console.log('Subcollection Requested ID Not Found');
            }
        }
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to delete');
        }else{
            console.log('another issue with updating');
        }
    }
});



module.exports = router;