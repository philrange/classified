numberOfCards = 2;
useExtremeDeck = false;
remainingCardsInDeck = [];
remainingNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]


function selectNormalDeck() {
    useExtremeDeck = false;
    selectDeck();
}

function selectExtremeDeck() {
    useExtremeDeck = true;
    selectDeck();
}

function selectDeck() {
    if (useExtremeDeck) {
        $('#deck').html("Extreme");
        $('#deck').addClass("badge-danger");
    } else {
        $('#deck').html("Normal");
        $('#deck').addClass("badge-success");
    }

    $('.menu-logo').addClass("d-none d-sm-inline");
    $('#deck-menu-item').toggle();
    $('#select-deck-container').slideToggle("slow", goToSelectNumber());
}

function goToSelectNumber() {
    $('#select-number-container').slideToggle();
    loadDeck();
}


function selectOne() {
    numberOfCards = 1;
    selectNumber();
}

function selectTwo() {
    numberOfCards = 2;
    selectNumber();
}

function selectNumber() {
    $('#number-of-objectives').html(numberOfCards);


    $('#number-of-objectives-menu-item').toggle();
    $('#select-number-container').slideToggle("slow", goToDiceRollOrRandom());
}

function goToDiceRollOrRandom() {

    // clear out drop downs
    $('#drop-down1').empty();
    $('#drop-down2').empty();

    //clear out card select
    $('#card-select').empty();

var count = 1;
    //populate drop downs
    $.each(remainingCardsInDeck, function(i, card) {

if ( card.used != "true" ) {

        var cardName = (i + 1) + ":" + card.objective;
        //console.log(cardName);
        $('#drop-down1').append('<option>' + cardName + '</option>');
        $('#drop-down2').append('<option' + (count === 2 ? ' selected ' : '') + '>' + cardName + '</option>');
        count++;
}
    });

    $('#dice-roll-or-random-container').slideToggle();
}

function show2selectedCards() {
    var card1 = $('#drop-down1').val();
    var card1number = card1.substring(0, card1.indexOf(":")) - 1;
    var card2 = $('#drop-down2').val();
    var card2number = card2.substring(0, card2.indexOf(":")) - 1;
    show2cards(card1number, card2number);
}

function show2randomCards() {
    var card1 = remainingNumbers[Math.floor(Math.random()*remainingNumbers.length)];

    //remove the card just picked from the deck    
     remainingNumbers.splice( $.inArray(card1, remainingNumbers), 1 );

    var card2 = remainingNumbers[Math.floor(Math.random()*remainingNumbers.length)];
    show2cards(card1, card2);
}

function show2cards(card1, card2) {

    $('#dice-roll-or-random-container').slideToggle();

    var card1div = getCardDiv(card1);
    var card2div = getCardDiv(card2);

    //$('#select-card-container').append("(" + card1 + " " + card2 + ") ");

    $('#card-select').append(card1div).append(card2div);
    goToSelectCard();
}

function getCardDiv(cardId) {

    var card = remainingCardsInDeck[cardId];
    var html = '<div class="card"><h5 class="card-header">' + card.objective + '</h5><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">REQUIREMENTS: ' + card.requirements + '</h6><p class="card-text">' + card.text + '</p><button type="button" class="btn btn-primary" onclick="selectCard(' + cardId + ')">Select this card</button></div></div>';

    return html;
}

function getCardDivWithoutSelectButton(cardId) {

    var card = remainingCardsInDeck[cardId];
    var html = '<div class="card mb-3"><h5 class="card-header">' + card.objective + '</h5><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">REQUIREMENTS: ' + card.requirements + '</h6><p class="card-text">' + card.text + '</p></div></div>';

    return html;
}

function goToSelectCard() {
    $('#select-card-container').slideDown();
    $('#cards-container').slideDown();
}

function selectCard(cardId) {
    console.log("Selected card " + cardId + " " + remainingCardsInDeck[cardId].objective);

    console.log(remainingCardsInDeck);
    console.log("removing " + cardId + " from deck");
    
   remainingCardsInDeck[cardId].used = "true";

remainingNumbers.splice( $.inArray(cardId, remainingNumbers), 1 );

    console.log(remainingCardsInDeck);

    //add card to bottom display
    var cardDiv = getCardDivWithoutSelectButton(cardId);
    $('#my-objectives-deck').prepend(cardDiv);

    $('#select-card-container').slideToggle();

    numberOfCards--;

    if (numberOfCards > 0) {

        goToDiceRollOrRandom();
    }
}


function loadDeck() {
    var deckName = useExtremeDeck ? "extreme" : "normal";

    $.ajax({
        type: "GET",
        crossDomain: true,
        dataType : "json",
        cache: false,
        url: "data/" + deckName + ".json", 
        beforeSend: function(xhr){
            if (xhr.overrideMimeType)
            {
                xhr.overrideMimeType("application/json");
            }
        },
        success: function (deck) { 

            remainingCardsInDeck = deck.cards;
            //            $.each(deck.cards, function(i, item) {
            //                console.log(i + 1);
            //                console.log(item);
            //            })  

        },
        error: function (argument) {
            // console.log(argument);
            $("#debug").append("Error loading file for " + deckName + "<br>");
        }  
    }); 
}