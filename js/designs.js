//////////////////////////////State of the page///////////////////////////////////////   
let numberFailed = 0;
let imageError = function () {
    numberFailed++;
    $("#howmanyfailed").empty().append(`Unfortunately, ${numberFailed} image(s) didn't load due to broken or outdated URLs :(`);
};

let currentClass = "All";
let currentCost = "anycost";
let currentRace = "Any";

let costStatus = false;
let classStatus = false;
let raceStatus = false;

//////////////////////////////Header filter dropdown appearance///////////////////////////////////////   
let start = function () {
    $(document).ready(function () {
        let hideCost = function () {
            if (costStatus === true) {
                $("#costdrop").addClass("hide");
                $("#costarrow").removeClass("fa-rotate-180");
                $("#costcontainer").removeClass("darken");
                $("#costcontainer").removeClass("darken2");
                costStatus = false;
            }
        }
        let showCost = function () {
            if (costStatus === false) {
                $("#costdrop").removeClass("hide");
                $("#costarrow").addClass("fa-rotate-180");
                $("#costcontainer").addClass("darken");
                $("#costcontainer").addClass("darken2");
                costStatus = true;
            }
        }
        let hideClass = function () {
            if (classStatus === true) {
                $("#classdrop").addClass("hide");
                $("#classarrow").removeClass("fa-rotate-180");
                $("#classcontainer").removeClass("darken");
                $("#classcontainer").removeClass("darken2");
                classStatus = false;
            }
        }
        let showClass = function () {
            if (classStatus === false) {
                $("#classdrop").removeClass("hide");
                $("#classarrow").addClass("fa-rotate-180");
                $("#classcontainer").addClass("darken");
                $("#classcontainer").addClass("darken2");
                classStatus = true;
            }
        }
        let hideRace = function () {
            if (raceStatus === true) {
                $("#racedrop").addClass("hide");
                $("#racearrow").removeClass("fa-rotate-180");
                $("#racecontainer").removeClass("darken");
                $("#racecontainer").removeClass("darken2");
                raceStatus = false;
            }
        }
        let showRace = function () {
            if (raceStatus === false) {
                $("#racedrop").removeClass("hide");
                $("#racearrow").addClass("fa-rotate-180");
                $("#racecontainer").addClass("darken");
                $("#racecontainer").addClass("darken2");
                raceStatus = true;
            }
        }

        $("#costcontainer").click(function () {
            event.stopPropagation();
            if (costStatus === false) {
                showCost();
                hideClass();
                hideRace();
            } else {
                hideCost();
            }
        });

        $("#classcontainer").click(function () {
            event.stopPropagation();
            if (classStatus === false) {
                showClass();
                hideCost();
                hideRace();
            } else {
                hideClass();
            }
        });
        $("#racecontainer").click(function () {
            event.stopPropagation();
            if (raceStatus === false) {
                showRace();
                hideClass();
                hideCost();
            } else {
                hideRace();
            }
        });
        $("body").click(function () {
            hideRace();
            hideClass();
            hideCost();
        });
    })
}
start();


(function () {
    //////////////////////////////Function for what to do with Get request when it succeeds///////////////////////////////////////   
    function handleSuccess() {
        $("#loading").addClass("hide");
        $("#loadingtext").addClass("hide");
        $("#random").removeClass("hide");
        $("#welcome").removeClass("hide");
        $("#welcometext").removeClass("hide");
        let allCards = JSON.parse(this.responseText);
        console.log(allCards["Mean Streets of Gadgetzan"][144]);
        let allCategories = ["Basic", "Blackrock Mountain", "Classic", "Credits", "Goblins vs Gnomes", "Hall of Fame", "Hero Skins", "Journey to Un'Goro", "Knights of the Frozen Throne", "Kobolds & Catacombs", "Mean Streets of Gadgetzan", "Missions", "Naxxramas", "One Night in Karazhan", "Tavern Brawl", "The Grand Tournament", "The League of Explorers", "The Witchwood", "Whispers of the Old Gods"];

        //////////////////////////////Called every time search button is clicked OR search filter changed///////////////////////////////////////
        let search = function () {
            event.preventDefault;
            $("body").removeClass("stop-scrolling");
            numberFailed = 0;
            $("#random").addClass("hide");
            $("#welcome").addClass("hide");
            $("#welcometext").addClass("hide");
            $("#howmanyfailed").empty();
            let numberOfResults = 0; 
            let searchValue = $("#search").val();
            let searchValueLower = searchValue.toLowerCase();
            $("#results").empty();
            $(".center").removeClass("hide");
            let allCounter = 0,
                druidCounter = 0,
                hunterCounter = 0,
                mageCounter = 0,
                neutralCounter = 0,
                paladinCounter = 0,
                priestCounter = 0,
                rogueCounter = 0,
                shamanCounter = 0,
                warlockCounter = 0,
                warriorCounter = 0;
            let arrayOfResultObjects = []; ///////////////This array holds all search result objects and resets every search/////////////////////

            //////////////////////////////When a card is clicked from the results of the search///////////////////////////////////////
            let clickCard = function () {
                $(".toblur").addClass("blur");
                let top = (scrollY + (innerHeight) / 4);
                $("#details").empty();
                for (let x = 0; x < arrayOfResultObjects.length; x++) {
                    if (arrayOfResultObjects[x].cardId === $(this).attr('id')) {
                        console.log(arrayOfResultObjects[x].flavor);
                        let flavor = "No flavor text available for this card."
                        if (arrayOfResultObjects[x].flavor !== undefined) {
                            flavor = arrayOfResultObjects[x].flavor;
                        }
                        let artist = "unknown artist";
                        if (arrayOfResultObjects[x].artist !== undefined) {
                            artist = arrayOfResultObjects[x].artist;
                        }
                        let gold = arrayOfResultObjects[x].img;
                        if (arrayOfResultObjects[x].imgGold !== undefined) {
                            gold = arrayOfResultObjects[x].imgGold;
                        }

                        $("#details").append(`<div id="activeCard"><span id="close">X</span><div id="content">
                                                <img src="${arrayOfResultObjects[x].img}" id="activeImage">
                                                <img src="${gold}" id="goldImage" class="hide"><div id="detailsText">
                                                <p id="name">${arrayOfResultObjects[x].name}</p></p>
                                                <p id="cardSet">${arrayOfResultObjects[x].cardSet} Card Set</p>
                                                <p id="artist">Art by ${artist}</p>
                                                <p id="flavor"><em>${flavor}</em></p></div></div>
                                            </div>`)
                        $("#cover").removeClass("hide");
                        $("#activeCard").css("top", top);
                        $("body").addClass("stop-scrolling");
                    }
                };
                $("#close").click(function () {
                    $("body").removeClass("stop-scrolling");
                    $("#details").empty();
                    $(".toblur").removeClass("blur");
                    $("#cover").addClass("hide");
                });
                ///////////////#cover adds a layer between the card details popup and the background to click on (to exit) and block image interaction///////////////////
                $("#cover").click(function () {
                    $("body").removeClass("stop-scrolling");
                    $("#details").empty();
                    $(".toblur").removeClass("blur");
                    $("#cover").addClass("hide");
                });
                ///////////////When you click on the active card, it changes to the gold version if available////////////////////
                $("#activeImage").click(function () {
                    $("#activeImage").addClass("hide");
                    $("#goldImage").removeClass("hide");
                });
                $("#goldImage").click(function () {
                    $("#activeImage").removeClass("hide");
                    $("#goldImage").addClass("hide");
                });
            };

            ///////////////Meat of the search function. Loops through each card in each category for search text matching in card body and name////////////////////
            for (let a = 0; a < allCategories.length; a++) {
                let category = allCategories[a];
                let categoryLength = allCards[category].length;
                for (let b = 0; b < categoryLength; b++) {
                    let cardID = allCards[category][b].cardId;
                    let cardName = allCards[category][b].name.toLowerCase();
                    let cardDescription = "";
                    let cardRace = "";
                    let imageGold = allCards[category][b].imgGold;
                    let cardCost = `cost${allCards[category][b].cost}`;
                    if (allCards[category][b].text !== undefined) {
                        cardDescription = allCards[category][b].text.toLowerCase();
                    }
                    if (allCards[category][b].race !== undefined) {
                        cardRace = allCards[category][b].race.toLowerCase();
                    }
                    if (allCards[category][b].imgGold === undefined) {
                        imageGold = allCards[category][b].img;
                    }

                    if (cardName.includes(searchValueLower) || cardDescription.includes(searchValueLower) || cardRace.includes(searchValueLower)) {
                        ///////////////There are three groups of cards that do not have a class, but rather have 3 under "multiClassGroup"////////////////////
                        if (allCards[category][b].multiClassGroup === "Jade Lotus") {
                            druidCounter++;
                            rogueCounter++;
                            shamanCounter++;
                            neutralCounter++;
                            allCounter++;
                            if (currentClass === "Shaman" || currentClass === "Rogue" || currentClass === "Druid" || currentClass === "Neutral" || currentClass === "All") {
                                if (currentCost === "anycost" || currentCost === cardCost) {
                                    if (currentRace === "Any" || currentRace === allCards[category][b].race) {
                                        $("#results").append(`<img src = "${allCards[category][b].img}" alt="${allCards[category][b].name}" id = "${cardID}" onerror="imageError()">`);
                                        numberOfResults++;
                                        arrayOfResultObjects.push(allCards[category][b]);
                                        $(`#${cardID}`).click(clickCard);
                                    }
                                }
                            }
                        } else if (allCards[category][b].multiClassGroup === "Grimy Goons") {
                            hunterCounter++;
                            paladinCounter++;
                            warriorCounter++;
                            neutralCounter++;
                            allCounter++;
                            if (currentClass === "Hunter" || currentClass === "Paladin" || currentClass === "Warrior" || currentClass === "Neutral" || currentClass === "All") {
                                if (currentCost === "anycost" || currentCost === cardCost) {
                                    if (currentRace === "Any" || currentRace === allCards[category][b].race) {
                                        $("#results").append(`<img src = "${allCards[category][b].img}" alt="${allCards[category][b].name}" id = "${cardID}" onerror="imageError()">`);
                                        numberOfResults++;
                                        arrayOfResultObjects.push(allCards[category][b]);
                                        $(`#${cardID}`).click(clickCard);
                                    }
                                }
                            }
                        } else if (allCards[category][b].multiClassGroup === "Kabal") {
                            mageCounter++;
                            priestCounter++;
                            warlockCounter++;
                            neutralCounter++;
                            allCounter++;
                            if (currentClass === "Mage" || currentClass === "Priest" || currentClass === "Warlock" || currentClass === "Neutral" || currentClass === "All") {
                                if (currentCost === "anycost" || currentCost === cardCost) {
                                    if (currentRace === "Any" || currentRace === allCards[category][b].race) {
                                        $("#results").append(`<img src = "${allCards[category][b].img}" alt="${allCards[category][b].name}" id = "${cardID}" onerror="imageError()">`);
                                        numberOfResults++;
                                        arrayOfResultObjects.push(allCards[category][b]);
                                        $(`#${cardID}`).click(clickCard);
                                    }
                                }
                            }
                        } else { ////////If the card is none of the three weird groups of cards that has multiple classes, i.e. almost all of the cards//////////////////
                            allCounter++;
                            if (allCards[category][b].playerClass === "Druid") druidCounter++;
                            if (allCards[category][b].playerClass === "Hunter") hunterCounter++;
                            if (allCards[category][b].playerClass === "Mage") mageCounter++;
                            if (allCards[category][b].playerClass === "Neutral") neutralCounter++;
                            if (allCards[category][b].playerClass === "Paladin") paladinCounter++;
                            if (allCards[category][b].playerClass === "Priest") priestCounter++;
                            if (allCards[category][b].playerClass === "Rogue") rogueCounter++;
                            if (allCards[category][b].playerClass === "Shaman") shamanCounter++;
                            if (allCards[category][b].playerClass === "Warlock") warlockCounter++;
                            if (allCards[category][b].playerClass === "Warrior") warriorCounter++;

                            if (currentClass === "All") {
                                if (currentCost === "anycost" || currentCost === cardCost) {
                                    if (currentRace === "Any" || currentRace === allCards[category][b].race) {
                                        $("#results").append(`<img src = "${allCards[category][b].img}" alt="${allCards[category][b].name}" id = "${cardID}" onerror="imageError()">`);
                                        arrayOfResultObjects.push(allCards[category][b]);
                                        numberOfResults++;
                                        $(`#${cardID}`).click(clickCard);
                                    }
                                }

                            } else if (allCards[category][b].playerClass === currentClass) {
                                if (currentCost === "anycost" || currentCost === cardCost) {
                                    if (currentRace === "Any" || currentRace === allCards[category][b].race) {
                                        $("#results").append(`<img src = "${allCards[category][b].img}" alt="${allCards[category][b].name}" id = "${cardID}" onerror="imageError()">`);
                                        numberOfResults++;
                                        arrayOfResultObjects.push(allCards[category][b]);
                                        $(`#${cardID}`).click(clickCard);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            let costInt = currentCost.substring(4);
            let shortRace = `${currentRace} `;
            if (currentRace === "Any") shortRace = "";
            
            if (currentClass !== "All") {
                if (currentCost === "anycost") {
                    if (numberOfResults === 1) {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${currentClass}</b></span> class <span><b>${shortRace}</span></b>card found containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    } else {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${currentClass}</b></span> class <span><b>${shortRace}</span></b>cards found containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    }
                } else {
                    if (numberOfResults === 1) {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${currentClass}</b></span> class <span><b>${shortRace}</span></b>card found with cost <span><b>${costInt}</b></span> containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    } else {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${currentClass}</b></span> class <span><b>${shortRace}</span></b>cards found with cost <span><b>${costInt}</b></span> containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    }
                }


            } else {
                if (currentCost === "anycost") {
                    if (numberOfResults === 1) {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${shortRace}</span></b>card found containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    } else {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${shortRace}</span></b>cards found containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    }
                } else {
                    if (numberOfResults === 1) {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${shortRace}</span></b>card found with cost <span><b>${costInt}</b></span> containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    } else {
                        $("#howmany").empty().append(`${numberOfResults} <span><b>${shortRace}</span></b>cards found with cost <span><b>${costInt}</b></span> containing the search term <span><b><em>${searchValue}</em></b></span>.`);
                    }
                }
            }

            ///////////////Change the labels of the radio buttons to add the number of results per class////////////////////
           /* $("label[for='All']").text(`All (${allCounter})`);
            $("label[for='Druid']").text(`Druid (${druidCounter})`);
            $("label[for='Hunter']").text(`Hunter (${hunterCounter})`);
            $("label[for='Mage']").text(`Mage (${mageCounter})`);
            $("label[for='Neutral']").text(`Neutral (${neutralCounter})`);
            $("label[for='Paladin']").text(`Paladin (${paladinCounter})`);
            $("label[for='Priest']").text(`Priest (${priestCounter})`);
            $("label[for='Rogue']").text(`Rogue (${rogueCounter})`);
            $("label[for='Shaman']").text(`Shaman (${shamanCounter})`);
            $("label[for='Warlock']").text(`Warlock (${warlockCounter})`);
            $("label[for='Warrior']").text(`Warrior (${warriorCounter})`);
*/
            return false;
        }

        $("#submit").click(search);
        
        $("#hamburger").click(function() {
            $("#hamburgermenu").toggleClass("moveMenu");
            $("#hamburger").toggleClass("darken");
        });


        $("input[name=classbox]").on("change", function () {
            currentClass = $(this).attr("id");
            search();
        })

        $("input[name=costbox]").on("change", function () {
            currentCost = $(this).attr("id");
            search();
        })

        $("input[name=racebox]").on("change", function () {
            currentRace = $(this).attr("id");
            search();
        })
    }

    //////////////////////////////If Get request fails///////////////////////////////////////
    function handleError() {
        alert('There is a problem with the Hearthstone API!');
    }

    //////////////////////////////Get request///////////////////////////////////////
    const asyncRequestObject = new XMLHttpRequest();
    asyncRequestObject.open('GET', "https://omgvamp-hearthstone-v1.p.mashape.com/cards");
    asyncRequestObject.setRequestHeader("X-Mashape-Key", "WIA35hViBqmshY4lRwkZU9m4I02Pp1MUmFtjsn9t3oMXaQeIkY");
    asyncRequestObject.onload = handleSuccess;
    asyncRequestObject.onerror = handleError;
    asyncRequestObject.send();

})();
