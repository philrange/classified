numberOfCards = 2;
communalCards = 0;
useExtremeDeck = false;
remainingCardsInDeck = [];
remainingNumbers = [];


function loadDecks() {

//$("#debug").append(timestamp());

    normalDeck = normal.cards;
    extremeDeck = extreme.cards;

    resetRemainingNumbers();
    
    addSecureHvtObjective();
}

function resetRemainingNumbers() {
    remainingNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
}

function restart() {
    //$("#debug").append("test");

    //hide stuff
    $('.initially-hidden').hide();

    //clear data
    resetRemainingNumbers();

    $('#card-select').empty();
    $('#my-objectives-deck').empty();
    addSecureHvtObjective();

    $('#communal-objectives-deck').empty();

    $.each(normalDeck, function (i, card) {
        card.used = "false";
    });

    $.each(extremeDeck, function (i, card) {
        card.used = "false";
    });

 $('#timestamp').empty();

    //show logo
    $('.menu-logo').removeClass("d-none d-sm-inline");

    //show initial page
    $('#select-deck-container').show();
}

function addSecureHvtObjective() {
    var cardDiv = getSecureHvtCardDiv();
    $('#my-objectives-deck').append(cardDiv);
}

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
        remainingCardsInDeck = extremeDeck;

        // remainingCardsInDeck = extremeDeck.map(card => Object.assign({}, card, { "used": "false" }));
    } else {
        $('#deck').html("Normal");
        $('#deck').addClass("badge-success");
        remainingCardsInDeck = normalDeck;
    }


    //$("#debug").append(remainingNumbers.toString());
    //$("#debug").append(remainingCardsInDeck.toString());
    //$("#debug").append(JSON.stringify(normalDeck));

    $('.menu-logo').addClass("d-none d-sm-inline");
    $('#deck-menu-item').toggle();
    $('#restart-menu-item').toggle();

    $('#select-deck-container').slideToggle("slow", goToSelectNumber());
}

function goToSelectNumber() {
    $('#select-number-container').slideToggle();
    //loadDeck();
}


function selectOne() {
    numberOfCards = 1;
    selectNumber();
}

function selectTwo() {
    numberOfCards = 2;
    selectNumber();
}

function selectThree() {
    numberOfCards = 3;
    selectNumber();
}

function selectHighlyClassified() {
    numberOfCards = 1;
    communalCards = 4;

    $('#number-of-objectives').html('<span class="d-none d-sm-inline">HIGHLY CLASSIFIED</span><span class="d-sm-none">HC</span>');
    $('#number-of-objectives-menu-item').toggle();

    $('#select-number-container').slideToggle("slow", goToDiceRollOrRandomHighlyClassified());
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

    populateDropDown($('#drop-down1'), 1);
    populateDropDown($('#drop-down2'), 2);

    $('#dice-roll-or-random-container').slideToggle();
}

function goToDiceRollOrRandomHighlyClassified() {

    populateDropDown($('#hc-drop-down1'), 1);
    populateDropDown($('#hc-drop-down2'), 2);
    populateDropDown($('#hc-drop-down3'), 3);
    populateDropDown($('#hc-drop-down4'), 4);

    $('#dice-roll-or-random-container-hc').slideToggle();
}


function populateDropDown(dropDown, dropDownNumber) {

    var count = 1;
    //populate drop downs
    $.each(remainingCardsInDeck, function(i, card) {

        if ( card.used != "true" ) {

            var cardName = (i + 1) + " : " + card.objective;
            //            console.log(cardName);
            //            $('#drop-down1').append('<option>' + cardName + '</option>');
            dropDown.append('<option' + (count === dropDownNumber ? ' selected ' : '') + '>' + cardName + '</option>');
            count++;
        }
    });
}

function use4selectedCards() {

    $('#cards-container-hc').slideDown();
    $('#dice-roll-or-random-container-hc').slideToggle();


    var card1 = $('#hc-drop-down1').val();
    var card1number = card1.substring(0, card1.indexOf(":")) - 1;
    selectCard(card1number, true);
    var card2 = $('#hc-drop-down2').val();
    var card2number = card2.substring(0, card2.indexOf(":")) - 1;
    selectCard(card2number, true);
    var card3 = $('#hc-drop-down3').val();
    var card3number = card3.substring(0, card3.indexOf(":")) - 1;
    selectCard(card3number, true);
    var card4 = $('#hc-drop-down4').val();
    var card4number = card4.substring(0, card4.indexOf(":")) - 1;
    selectCard(card4number, true);
}

function use4randomCards() {

    $('#cards-container-hc').slideDown();
    $('#dice-roll-or-random-container-hc').slideToggle();

    var card1 = selectRandomCard();
    selectCard(card1, true);
    var card2 = selectRandomCard();
    selectCard(card2, true);
    var card3 = selectRandomCard();
    selectCard(card3, true);
    var card4 = selectRandomCard();
    selectCard(card4, true);
}

function show2selectedCards() {
    var card1 = $('#drop-down1').val();
    var card1number = card1.substring(0, card1.indexOf(":")) - 1;
    var card2 = $('#drop-down2').val();
    var card2number = card2.substring(0, card2.indexOf(":")) - 1;
    show2cards(card1number, card2number);
}

function show2randomCards() {
    var card1 = selectRandomCard();

    var card2 = selectRandomCard();
    show2cards(card1, card2);
}

function selectRandomCard() {
    var card = remainingNumbers[Math.floor(Math.random()*remainingNumbers.length)];

    //remove the card just picked from the deck    
    remainingNumbers.splice( $.inArray(card, remainingNumbers), 1 );

    return card;
}

function show2cards(card1, card2) {

    $('#dice-roll-or-random-container').slideToggle();

    var card1div = getCardDiv(card1);
    var card2div = getCardDiv(card2);

    $('#card-select').append(card1div).append(card2div);
    goToSelectCard();
}

function getCardDiv(cardId) {

    var card = remainingCardsInDeck[cardId];
//    var intelcom = '<span class="infotech">' + card.infotech + '</span>';
    var intelcom = '';
//    var icons = getIconHtml(card.icons);
    var icons = '';
    var html = '<div class="card"><h5 class="card-header">' + card.objective + intelcom + icons + '</h5><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">REQUIREMENTS: ' + card.requirements + '</h6><p class="card-text">' + card.text + '</p></div><div class="card-footer"><button type="button" class="btn btn-primary" onclick="selectCard(' + cardId + ', false)">Select this card</button></div></div>';

    return html;
}

function getCardDivWithoutSelectButton(cardId) {

    var card = remainingCardsInDeck[cardId];
    //    var intelcom = '<span class="infotech">' + card.infotech + '</span>';
    var intelcom = '';
    //    var icons = getIconHtml(card.icons);
    var icons = '';
    var html = '<div class="card mb-3"><h5 class="card-header">' + card.objective + intelcom + icons + '</h5><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">REQUIREMENTS: ' + card.requirements + '</h6><p class="card-text">' + card.text + '</p></div></div>';

    return html;
}

function getSecureHvtCardDiv() {

    var html = '<div class="card text-white bg-dark mb-3"><h5 class="card-header">' + securehvt.objective + '</h5><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">REQUIREMENTS: ' + securehvt.requirements + '</h6><p class="card-text">' + securehvt.text + '</p></div></div>';

    return html;
}

function getIconHtml(icons) {

var html = '';
if (icons != null) {
	icons.forEach(icon => {
	html += '<span class="icon">' + icon + '</span>'
	});
}

	return html;
}


function goToSelectCard() {
    $('#select-card-container').slideDown();

    $('#cards-container').slideDown();
}

function selectCard(cardId, communal) {
    console.log(cardId, communal);
    console.log("Selected card " + cardId + " " + remainingCardsInDeck[cardId].objective);

    console.log(remainingCardsInDeck);
    console.log("removing " + cardId + " from deck");

    remainingCardsInDeck[cardId].used = "true";

    remainingNumbers.splice( $.inArray(cardId, remainingNumbers), 1 );

    //    console.log(remainingCardsInDeck);

    //add card to bottom display
    var cardDiv = getCardDivWithoutSelectButton(cardId);

    if (communal) {
        $('#communal-objectives-deck').prepend(cardDiv);
        communalCards--;
    } else {
        $('#select-card-container').slideToggle();
        $('#my-objectives-deck').prepend(cardDiv);
        numberOfCards--;
    }

    if (numberOfCards > 0 && communalCards === 0) {

        goToDiceRollOrRandom();
    } else {
    	 $('#timestamp-container').show();
    	 $('#timestamp').append("Objectives selected at " + timestamp());
    }
}

function timestamp() {
	 var dt = new Date();
var timestamp = padZeros(dt.getHours()) + ":" + padZeros(dt.getMinutes()) + ":" + padZeros(dt.getSeconds());
    	 return timestamp;
}

function padZeros(number) {
return ('0' + number).slice(-2);
}