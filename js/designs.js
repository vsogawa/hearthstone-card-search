//////////////////////////////State of the page///////////////////////////////////////   
let numberFailed = 0;

function imageError(imageID) {
    numberFailed++;
    //    $("#howmanyfailed").empty().append(`Unfortunately, <u id="failedImgs">${numberFailed} image(s)</u> didn't load due to broken or outdated URLs :(`);
    $(imageID).remove();
    //$("#resultscount").empty().append(numberOfResults - numberFailed);
};

let numberOfResults = 0;

let currentClass = "All";
let currentCost = "anycost";
let currentRace = "Any";

let costStatus = false;
let classStatus = false;
let raceStatus = false;

let resultsPerPage = 20;
let pageNum = 1;
let currentResultsCounter = 0;
let totalPages = 1;
let arrayOfResultObjects = [];

//////////////////////////////Header filter dropdown appearance///////////////////////////////////////   
let start = function () {
    $(document).ready(function () {
        let hideCost = function () {
            if (costStatus === true) {
                $("#costdrop").addClass("hide");
                $("#costarrow").removeClass("fa-rotate-180");
                $("#costcontainer").removeClass("darken darken2");
                costStatus = false;
            }
        }
        let showCost = function () {
            if (costStatus === false) {
                $("#costdrop").removeClass("hide");
                $("#costarrow").addClass("fa-rotate-180");
                $("#costcontainer").addClass("darken darken2");
                costStatus = true;
            }
        }
        let hideClass = function () {
            if (classStatus === true) {
                $("#classdrop").addClass("hide");
                $("#classarrow").removeClass("fa-rotate-180");
                $("#classcontainer").removeClass("darken darken2");
                classStatus = false;
            }
        }
        let showClass = function () {
            if (classStatus === false) {
                $("#classdrop").removeClass("hide");
                $("#classarrow").addClass("fa-rotate-180");
                $("#classcontainer").addClass("darken darken2");
                classStatus = true;
            }
        }
        let hideRace = function () {
            if (raceStatus === true) {
                $("#racedrop").addClass("hide");
                $("#racearrow").removeClass("fa-rotate-180");
                $("#racecontainer").removeClass("darken darken2");
                raceStatus = false;
            }
        }
        let showRace = function () {
            if (raceStatus === false) {
                $("#racedrop").removeClass("hide");
                $("#racearrow").addClass("fa-rotate-180");
                $("#racecontainer").addClass("darken darken2");
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

        let appendResults = function (index, resultsPerPage, page) {
            for (index; index < (resultsPerPage * page); index++) {
                if (arrayOfResultObjects[index] !== undefined) {
                    $("#results").append(`<img src="${arrayOfResultObjects[index].img}" alt="${arrayOfResultObjects[index].name}" id = "${arrayOfResultObjects[index].cardId}" onerror="imageError(${arrayOfResultObjects[index].cardId})">`);
                    $(`#${arrayOfResultObjects[index].cardId}`).click(clickCard);
                } else {
                    break;
                }
            }
            $(".pageID").empty().append(`Page ${pageNum} of ${totalPages}`);
        };

        //////////////////////////////When a card is clicked from the results of the search///////////////////////////////////////
        let clickCard = function () {
            $(".toblur").addClass("blur");
            let top = (scrollY + (innerHeight) / 4);
            $("#details").empty();
            for (let x = 0; x < arrayOfResultObjects.length; x++) {
                if (arrayOfResultObjects[x].cardId === $(this).attr('id')) {
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

        //////////////////////////////Called every time search button is clicked OR search filter changed///////////////////////////////////////
        let search = function () {
            event.preventDefault;
            $("body").removeClass("stop-scrolling");
            numberFailed = 0;
            $("#random").addClass("hide");
            $("#welcome").addClass("hide");
            $("#welcometext").addClass("hide");
            $(".left").removeClass("hide");
            $(".right").removeClass("hide");
            $(".pageNav").removeClass("hide");
            $("#howmanyfailed").empty();
            numberOfResults = 0;
            let searchValue = $("#search").val();
            let searchValueLower = searchValue.toLowerCase();
            $("#results").empty();
            $(".center").removeClass("hide");
            currentResultsCounter = 0;
            pageNum = 1;
            totalPages = 1;

            arrayOfResultObjects = []; ///////////////This array holds all search result objects and resets every search/////////////////////


            ///////////////Meat of the search function. Loops through each card in each category for search text matching in card body and name////////////////////
            for (let a = 0; a < allCategories.length; a++) {
                let category = allCategories[a];
                let categoryLength = allCards[category].length;
                for (let b = 0; b < categoryLength; b++) {
                    let cardID = String(allCards[category][b].cardId);
                    let cardName = allCards[category][b].name.toLowerCase();
                    let cardNameTag = toString(allCards[category][b].name);
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
                    let appendAndCountResults = function () {
                        numberOfResults++;
                        arrayOfResultObjects.push(allCards[category][b]);
                    }

                    if ((cardName.includes(searchValueLower) || cardDescription.includes(searchValueLower) || cardRace.includes(searchValueLower)) && (currentCost === "anycost" || currentCost === cardCost) && (currentRace === "Any" || currentRace === allCards[category][b].race) && allCards[category][b].type !== "Enchantment" && allCards[category][b].img !== undefined) {
                        ///////////////There are three groups of cards that do not have a class, but rather have 3 under "multiClassGroup"////////////////////
                        if (allCards[category][b].multiClassGroup === "Jade Lotus" && (currentClass === "Shaman" || currentClass === "Rogue" || currentClass === "Druid" || currentClass === "Neutral" || currentClass === "All")) {
                            appendAndCountResults();
                        } else if (allCards[category][b].multiClassGroup === "Grimy Goons" && (currentClass === "Hunter" || currentClass === "Paladin" || currentClass === "Warrior" || currentClass === "Neutral" || currentClass === "All")) {
                            appendAndCountResults();
                        } else if (allCards[category][b].multiClassGroup === "Kabal" && (currentClass === "Mage" || currentClass === "Priest" || currentClass === "Warlock" || currentClass === "Neutral" || currentClass === "All")) {
                            appendAndCountResults();
                        } else { ////////If the card is none of the three weird groups of cards that has multiple classes, i.e. almost all of the cards//////////////////
                            if (currentClass === "All") {
                                appendAndCountResults();
                            } else if (allCards[category][b].playerClass === currentClass) {
                                appendAndCountResults();
                            }
                        }
                    }
                }
            }

            totalPages = Math.ceil(arrayOfResultObjects.length / resultsPerPage);

            if (totalPages === 1) {
                $(".left").addClass("hide");
                $(".right").addClass("hide");
            };

            if (totalPages === 0 || numberOfResults === 0) {
                $(".pageNav").addClass("hide");
            };

            appendResults(currentResultsCounter, resultsPerPage, pageNum);

            let shortClass = ` <span><b>${currentClass}</b></span> class`;
            if (currentClass === "All") shortClass = "";

            let shortRace = ` <span><b>${currentRace}</span></b> `;
            if (currentRace === "Any") shortRace = "";

            let no = "";
            if (numberOfResults === 0) no = "No ";

            let cardvscards = " cards";
            if (currentClass === "All" && currentRace === "Any") cardvscards = "Cards";
            if (numberOfResults === 1) cardvscards = " card";

            let resultCount = ` with cost <span><b>${currentCost.substring(4)}</b></span>`;
            if (currentCost === "anycost") resultCount = "";

            let checkSearch = ` containing the search term <span><b><em>${searchValue}</em></b></span>`;
            if (searchValue === "" || searchValue === " ") checkSearch = "";

            $("#howmany").empty().append(`${no}${shortClass}${shortRace}${cardvscards}${resultCount}${checkSearch} <b>:</b>`);
            $(".pageID").empty().append(`Page ${pageNum} of ${totalPages}`);

            return false;
        }

        $("#submit").click(search);

        $("#hamburger").click(function () {
            $("#hamburger").toggleClass("darken");
            if ($("#hamburger").hasClass("darken")) {
                $("#hamburgermenu").css("display", "flex");
            } else {
                $("#hamburgermenu").css("display", "none");
            }
            $("#hamburgermenu").toggleClass("moveMenu");
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

        $(".right").click(function () {
            if (pageNum < totalPages) {
                pageNum = pageNum + 1;
                currentResultsCounter = currentResultsCounter + resultsPerPage;
                $("#results").empty();
                appendResults(currentResultsCounter, resultsPerPage, pageNum);
                $(".pageID").empty().append(`Page ${pageNum} of ${totalPages}`);
            }
        });

        $(".left").click(function () {
            if (pageNum > 1) {
                pageNum = pageNum - 1;
                currentResultsCounter = currentResultsCounter - resultsPerPage;
                $("#results").empty();
                appendResults(currentResultsCounter, resultsPerPage, pageNum);
                $(".pageID").empty().append(`Page ${pageNum} of ${totalPages}`);
            }
        });
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
