
var targetContainer = $(".historical-wrapper"),
template = $("#tmpl-activity-price-descriptions").html();
var searchTemplate = $("#tmpl-search-criteria").html();
var activityNames = { "ActivityNames": JSON.parse(window.localStorage.getItem("ActivityNames")) };
var activitiesSelected = { "QuestionnaireDetails": JSON.parse(window.localStorage.getItem("selectedActivitiesQS")) };
var quote = { "quote": JSON.parse(window.localStorage.getItem("quoteResult")) };
var quoteRequest = { "quoteRequest": JSON.parse(window.localStorage.getItem("quoteRequest")) };
window.onload = QuestionsAndContact();
var getQuote;
function QuestionsAndContact() {
    $.ajax({
        url: "../api/quotes/" + quote.quote.QuoteId + "?includeDetails=false&includeSuggestions=true&tefsInvoices=false",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                getQuote = results;
                groupQS(results);
                var html = Mustache.to_html(template, ActivityTravelServices);
                $(".historical-wrapper").html(html);
                if (providerType.ProviderType == 2) {
                    createPayBookBtn();
                }
            }
        },
    });
}
var searchClient = ["00"];
var ActivityTravelService = [];
var ActivityTravelServices = {};
function groupQS(results) {
    for (var i = 0; i < results.ActivityTravelServices.length; i++) {
        var ns = {};
        var Questionnaires = [];
        var passanger = [];
        var qsPassangerBased = [];
        var qsActivityBased = [];
        for (var j = 0; j < results.ActivityTravelServices[i].Rate.Questionnaires.length; j++) {
            if (results.ActivityTravelServices[i].Rate.Questionnaires[j].QuestionnaireBasisType == 1) {
                qsActivityBased.push(results.ActivityTravelServices[i].Rate.Questionnaires[j]);
            }
            else {
                qsPassangerBased.push(results.ActivityTravelServices[i].Rate.Questionnaires[j]);
            }
        }
        var count = results.ActivityTravelServices[i].Rate.NumberOfAdults +
            results.ActivityTravelServices[i].Rate.NumberOfChidren +
            results.ActivityTravelServices[i].Rate.NumberOfUnits - 1
        for (var k = 1; k <= count; k++) {
            passanger.push({ "id": i + "" + k, "Title": "", "FirstName": "", "MiddleName": "", "LastName": "", "PhoneNumber": "" })
            searchClient.push(i + "" + k);
        }
        var qsPassanger = { "qsPassangerBased": qsPassangerBased };
        var qsActivity = { "qsActivityBased": qsActivityBased };
        Questionnaires.push(qsPassanger);
        Questionnaires.push(qsActivity);
        ns["Questionnaires"] = Questionnaires;
        ns["passanger"] = passanger;
        ns["ActivityName"] = results.ActivityTravelServices[i].Detail.ActivityName;
        ns["TravelServiceId"] = results.ActivityTravelServices[i].TravelServiceId;
        ActivityTravelService.push(ns);
    }
    ActivityTravelServices["ActivityTravelServices"] = ActivityTravelService;
}

var dataA;
var counter = 1;
function generateReqForAddTraveler() {
    var dataForMultiTraveler = [];
    var dataForCommonTrav = {
        "TravelerId": 0,
        "Title": document.getElementById("Title").value,
        "FirstName": document.getElementById("FirstName").value + "_" + counter,
        "MiddleName": document.getElementById("MiddleName").value + "_" + counter,
        "LastName": document.getElementById("LastName").value + "_" + counter,
        "DateOfBirth": "1992-02-01T00:00:00",
        "Gender": "M",
        "Nationality": 840,
        "NationalityCountryCode": null,
        "RedressNumber": "",
        "KnownTravelerNumber": "",
        "TravelServices": [{
            "TravelServiceId": travelServID,
            "TravelServiceTypeId": 8,
            "Details": [{
                "TypeId": 3,
                "Operator": null,
                "Value": ""
            }, {
                "TypeId": 1,
                "Value": 1
            }, {
                "TypeId": 17,
                "Value": 1
            }, {
                "TypeId": 4,
                "TravelerDetailCategoryItemId": 143
            }]
        }],
        "Documents": [],
        "Age": null,
        "TravelerPricebreakdownInformation": null,
        "MappingMessages": [],
        "IsCachedCopy": false,
        "ValidationRules": [],
        "ReadOnlyHash": null,
        "ValidationRules": [],
        "ReadOnlyHash": null,
        "ValidationRuleset": [],
        "ReadOnlyRules": {
            "FirstName": true,
            "LastName": true
        },
        "ReadOnly": true
    };
    var index = getIndex();



    for (var j = 0; j < ActivityTravelServices.ActivityTravelServices[index].passanger.length; j++) {
        if (ActivityTravelServices.ActivityTravelServices[index].passanger.length == 0) {
            break;
        }
        var title = document.getElementById("Title" + travelServID + "_" + ActivityTravelServices.ActivityTravelServices[index].passanger[j].id).value;
        var fName = document.getElementById("FirstName" + travelServID + "_" + ActivityTravelServices.ActivityTravelServices[index].passanger[j].id).value;
        var lName = document.getElementById("LastName" + travelServID + "_" + ActivityTravelServices.ActivityTravelServices[index].passanger[j].id).value;
        var mName = document.getElementById("MiddleName" + travelServID + "_" + ActivityTravelServices.ActivityTravelServices[index].passanger[j].id).value;



        var dataForMultiTrav = {
            "TravelerId": 0,
            "Title": title,
            "FirstName": fName,
            "MiddleName": mName,
            "LastName": lName,
            "DateOfBirth": "1992-02-01T00:00:00",
            "Gender": "M",
            "Nationality": 840,
            "NationalityCountryCode": null,
            "RedressNumber": "",
            "KnownTravelerNumber": "",
            "TravelServices": [{
                "TravelServiceId": travelServID,
                "TravelServiceTypeId": 8,
                "Details": [{
                    "TypeId": 3,
                    "Operator": null,
                    "Value": ""
                }, {
                    "TypeId": 1,
                    "Value": 1
                }, {
                    "TypeId": 17,
                    "Value": 1
                }, {
                    "TypeId": 4,
                    "TravelerDetailCategoryItemId": 143
                }]
            }],
            "Documents": [],
            "Age": null,
            "TravelerPricebreakdownInformation": null,
            "MappingMessages": [],
            "IsCachedCopy": false,
            "ValidationRules": [],
            "ReadOnlyHash": "d41d8cd98f00b204e9800998ecf8427e",
            "ValidationRules": [],
            "ReadOnlyHash": null,
            "ValidationRuleset": [],
            "ReadOnlyRules": {
                "FirstName": true,
                "LastName": true
            },
            "ReadOnly": true
        };
        dataForMultiTraveler.push(dataForMultiTrav);
    }
    dataForMultiTraveler.splice(0, 0, dataForCommonTrav);
    counter++;
    dataA = dataForMultiTraveler;
}

function getIndex() {
    for (var i = 0; i < ActivityTravelServices.ActivityTravelServices.length; i++) {
        if (ActivityTravelServices.ActivityTravelServices[i].TravelServiceId == travelServID) {
            return i;
        }
    }
}
var travelServIDArray = [];
var Traveler = [];
var travelServID;

var providerType = JSON.parse(window.localStorage.getItem("searchCriteria"));

function createPayBookBtn() {
    var idBook = "#SaveTravelers";
    var sel1 = $(idBook);

    sel1.empty().append("Pay & Book");
}

var searchtoken = JSON.parse(window.localStorage.getItem("token"))

function bookBtnClick() {

    if (fnCheck() != false) {
        var btnID = "SaveTravelers"
        btnSpin(btnID);
        travelerForMultipleTravelService(true, searchtoken);
    }
}
function quoteBtnClickQs() {
    if (fnCheck() != false) {
        var btnID = "quoteBtn"
        btnSpin(btnID);
        travelerForMultipleTravelService(false, null);
    }
}

function travelerForMultipleTravelService(isBookOrPay, token) {



    var travelerID = {};
    var multiRes = [];
    function travelerCollection() {
        for (var i = 0; i < multiRes.length; i++) {
            var tId = [];
            for (var z = 0; z < multiRes[i].length; z++) {
                tId.push(multiRes[i][z].TravelerId);
                var temp = {
                    "TravelSrviceId": travelServIDArray[i],
                    "TravelerIds": tId
                }
            }
            Traveler.push(temp);
        }
    }
    for (var i = 0; i < ActivityTravelServices.ActivityTravelServices.length; i++) {
        travelServID = ActivityTravelServices.ActivityTravelServices[i].TravelServiceId;
        travelServIDArray.push(ActivityTravelServices.ActivityTravelServices[i].TravelServiceId);
        generateReqForAddTraveler();

        $.ajax({
            url: "../api/quotes/" + quote.quote.QuoteId + "/travelservices/" + ActivityTravelServices.ActivityTravelServices[i].TravelServiceId + "/travelers",
            type: "PUT",
            data: JSON.stringify(dataA),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results, status) {
                if (results != null && status === "success") {
                    multiRes.push(results);
                    if (multiRes.length == ActivityTravelServices.ActivityTravelServices.length &&
                        ActivityTravelServices.ActivityTravelServices.length == i && status === "success") {
                        travelerCollection();
                        updateQuestionnaire();

                        if (isBookOrPay) {
                            if (providerType.ProviderType == 1) {
                                onBookButtonClick();
                            }
                            else if (providerType.ProviderType == 2) {
                                if (ActivityTravelServices.ActivityTravelServices.length > 1) {
                                    location.href = "../itineraries/" + quote.quote.QuoteId + "/payments";
                                } else {
                                    location.href = "../itineraries/" + quote.quote.QuoteId + "/payments?Token=" + searchtoken + "&tsId=" + ActivityTravelServices.ActivityTravelServices[0];
                                }
                            }
                        }
                        else {

                            location.href = "../activity/itineraries.html?QuoteId=" + quote.quote.QuoteId;
                        }
                    }
                }
            },
        });

    }
    setTimeout(function () {
    }, 500);


}

var success = {};
var newQS = [];

var seqKey;



function fnCheck() {
    for (var i = 0; i < getQuote.ActivityTravelServices.length; i++) {
        for (var j = 0; j < getQuote.ActivityTravelServices[i].Rate.Questionnaires.length; j++) {
            var temp = getQuote.ActivityTravelServices[i].Rate.Questionnaires[j].QuestionnaireId;
            if (document.getElementById("ans_" + temp).value.trim() == "") {
                alert('Fill all fields before booking');
                document.getElementById("ans_" + temp).focus();
                return false;
            }
        }
    }
}
function generateReqUpadateQuote(x, k) {
    var Questionnaires = [];
    var PricedActivityDetails = [];
    var Questionnaires = [];
    if (x == getQuote.ActivityTravelServices[k].TravelServiceId) {
        var newQ = { "Questionnaires": getQuote.ActivityTravelServices[k].Rate.Questionnaires };
        PricedActivityDetails.push(newQ);
        var rates = { "PricedActivityDetails": PricedActivityDetails }
    }
    var a = {
        "TravelServiceType": 8,
        "TravelServiceTypeId": 8,
        "ActivitySearchQualifier": quoteRequest.quoteRequest.TravelServices[k].ActivitySearchQualifier,
        "ActivityCode": quoteRequest.quoteRequest.TravelServices[k].ActivityCode,
        "ActivityDate": quoteRequest.quoteRequest.TravelServices[k].ActivityDate,
        "TotalAdult": quoteRequest.quoteRequest.TravelServices[k].TotalAdult,
        "TotalChildren": quoteRequest.quoteRequest.TravelServices[k].TotalChildren,
        "TotalUnit": quoteRequest.quoteRequest.TravelServices[k].TotalUnit,
        "OptionCodes": quoteRequest.quoteRequest.TravelServices[k].OptionCodes,
        "Rates": rates,
        "ActivityNotes": "", "AgentNotes": "",
        "Token": searchtoken
    }
    for (var k = 0; k < a.Rates.PricedActivityDetails[0].Questionnaires.length; k++) {
        a.Rates.PricedActivityDetails[0].Questionnaires[k].Value = document.getElementById("ans_" + a.Rates.PricedActivityDetails[0].Questionnaires[k].QuestionnaireId).value;
    }
    function returnTraveler() {
        for (var t = 0; t < Traveler.length; t++) {
            if (x == Traveler[t].TravelSrviceId) {
                return Traveler[t].TravelerIds;
            }
        }
    }
    var count = 0;
    for (var l = 0; l < a.Rates.PricedActivityDetails[0].Questionnaires.length; l++) {
        if (a.Rates.PricedActivityDetails[0].Questionnaires[l].QuestionnaireSeqKey > 0) {
            var w = returnTraveler();
            if (seqKey == a.Rates.PricedActivityDetails[0].Questionnaires[l].QuestionnaireSeqKey) {
                count--;
                a.Rates.PricedActivityDetails[0].Questionnaires[l].TravelerId = w[count];
            }
            else {
                a.Rates.PricedActivityDetails[0].Questionnaires[l].TravelerId = w[count];
            }
            seqKey = a.Rates.PricedActivityDetails[0].Questionnaires[l].QuestionnaireSeqKey;
            count++;
        }
    }
    return a;
}
function updateQuestionnaire() {
    for (var i = 0; i < quote.quote.TravelServiceIds.length; i++) {
        $.ajax({
            url: "../api/quotes/" + quote.quote.QuoteId + "/travelservices/" + getQuote.ActivityTravelServices[i].TravelServiceId,
            type: "PUT",
            data: JSON.stringify(generateReqUpadateQuote(quote.quote.TravelServiceIds[i], i)),//JSON.stringify(dataA),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                if (results != null) {
                    //if (i == ActivityTravelServices.ActivityTravelServices.length - 1) {
                    //    document.getElementById("Save Travelers").disabled = true;
                    // }
                }
            },
        });
    }
}
_.each(activitiesSelected.QuestionnaireDetails, function (question, index) {
    question.isQuestion = _.filter(question.Rules, function (rule) {
        return rule.ValidationType == "RequiredDefault" ||
            rule.ValidationType == "ReadOnlyValidator";
    }).length > 0;
});
var searchtoken = JSON.parse(window.localStorage.getItem("token"));
window.onload = function () { title() };
window.onload = function () { findClients() };
window.onload = function () {
    $("#personalInformationPlaceHolder").hide();
    $("#phoneNumberPlaceHolder").hide();
    var searchCriteria = Storage.prototype.getObject("searchCriteria");
    var htmSearch = Mustache.render(searchTemplate, searchCriteria);
    self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
}
function title() {
    var searchCriteria = Storage.prototype.getObject("searchCriteria");
    var htmSearch = Mustache.render(searchTemplate, searchCriteria);
    self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
}
function a() {
    var j = event.currentTarget.id;
    onSearchButtonClick(j);
}
var client = [];
function onSearchButtonClick() {
    client.splice(0, client.length)

    $.ajax({
        url: "../api/clients?searchCriteria=" + document.getElementById('clientSearch00').value,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                $("#personalInformationPlaceHolder").show();
                $("#phoneNumberPlaceHolder").show();
                client.push(results);
                addClientToQuote();
            }




        },

    });

}


function onsubmitQSButtonClick() {

}
var id;
function addClientToQuote() {
    id = quote.quote.QuoteId;
    var dataInputAddClientToQuote = { "ContactClientId": client[0][0].Id };
    $.ajax({
        url: "../api/quotes/" + id + "/contact",
        type: "PUT",
        data: JSON.stringify(dataInputAddClientToQuote),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                document.getElementById("FirstName").value = results.FirstName;
                document.getElementById("LastName").value = results.LastName;
                document.getElementById("PhoneNumber").value = results.PrimaryPhone;
                document.getElementById("Title").value = results.Title;
                if (results.Gender == "M") {
                    document.getElementById("GenderM").checked = true;
                    document.getElementById("GenderM").disabled = true;
                    document.getElementById("GenderF").disabled = true;


                }
                var date = new Date(results.DateOfBirth);
                var dd = date.getDate(); document.getElementById("dd").value = dd; document.getElementById("dd").disabled = true;
                var mm = date.getMonth(); document.getElementById("mm").value = mm; document.getElementById("mm").disabled = true;
                var yy = date.getFullYear(); document.getElementById("yyyy").value = yy; document.getElementById("yyyy").disabled = true;
                document.getElementById("MiddleName").disabled = true;
                document.getElementById("FirstName").disabled = true;
                document.getElementById("LastName").disabled = true;
                document.getElementById("PhoneNumber").disabled = true;
                document.getElementById("PhoneNumber").disabled = true;
                document.getElementById("Title").disabled = true;
                document.getElementById("bookbtn").disabled = false;
            }
        },
    });


}

function returnBookRequest(TravelServiceId) {

    var searchtoken = JSON.parse(window.localStorage.getItem("token"));

    var dataInputAddClientToBook = {
        "SessionId": null,
        "QuoteId": quote.quote.QuoteId,
        "TravelServiceId": TravelServiceId,
        "Token": searchtoken,
        "ContactTravelerId": client[0][0].Id
    };
    return dataInputAddClientToBook;
}

var numOfBooking = 0;
function onBookButtonClick() {


    for (var i = 0; i < quote.quote.TravelServiceIds.length; i++) {


        $.ajax({
            url: "../api/quotes/" + quote.quote.QuoteId + "/travelservices/" + quote.quote.TravelServiceIds[i] + "/activity/book",
            type: "POST",
            data: JSON.stringify(returnBookRequest(quote.quote.TravelServiceIds[i])),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results, status) {
                if (results != null && status === "success") {
                    numOfBooking++;
                }
                if (numOfBooking == quote.quote.TravelServiceIds.length) {
                    getQuoteBooked();
                }
            },
            error: function (result) {
                getQuoteNoBook();

            }

        });
    }


}

function getQuoteBooked() {

    window.location = "../activity/itineraries.html?QuoteId=" + quote.quote.QuoteId;

}

function getQuoteNoBook() {
    $.ajax({
        url: "../api/quotes/" + quote.quote.QuoteId + "?includeDetails=false&includeSuggestions=true&tefsInvoices=false",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                Storage.prototype.setObject("getQuote", results);

                window.location = "../activity/itinerariesNoBook.html";

            }
        },
    });

}


function findClients() {
    var map = {};
    $('[id*=clientSearch]')
        .typeahead({
            hint: true,
            highlight: true,
            minLength: 3,
            source: function (request, response) {
                var items = [];
                var data = $.grep(clients,
                    function (client) {
                        // client = client.properties;
                        if (request.length === 3) {
                            return client.FirstName.toLowerCase().startsWith(request);
                            //return client.FirstName.toLowerCase() === request.toLowerCase() ||
                            //    client.LastName.toLowerCase() === request.toLowerCase() ||
                            //    client.Phone.toLowerCase() === request.toLowerCase();
                        }
                        //else {
                        //    var spaceterm = request;
                        //    return airport.Name.toLowerCase().startsWith(spaceterm) ||
                        //        client.Name.toLowerCase().indexOf(spaceterm.toLowerCase()) !== -1 ||
                        //        client.IATACode.toLowerCase().startsWith(spaceterm) ||
                        //        client.IATACityCode.toLowerCase().startsWith(spaceterm) ||
                        //        client.MACCode.toLowerCase().startsWith(spaceterm);
                        //}
                    });
                $.each(data,
                    function (i, item) {

                        var First = item.FirstName;
                        var Last = item.LastName;
                        var name = First + " " + Last;
                        var Number = item.Phone;

                        map[name] = { "FirstName": First, "LastName": Last, "PhoneNumber": Number };
                        items.push(name, Number);

                        //var First = item.FirstName;
                        //var Last = item.LastName;




                    });
                response(items);
                $(".dropdown-menu").css("height", "auto");
            },



            updater: function (item) {
                $('[id*=FirstName]').val(map[item].FirstName);
                $('[id*=LastName]').val(map[item].LastName);
                $('[id*=PhoneNumber]').val(map[item].PhoneNumber);

                return item;
            }
        });


}
