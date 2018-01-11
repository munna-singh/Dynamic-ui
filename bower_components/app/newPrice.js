
var repriceOn = window.localStorage.getItem("repriceOn");
var targetContainer = $(".historical-wrapper"),

template = $("#tmpl-activity-price-descriptions").html();

QStemplate = $("#tmpl-activity-price-descriptions").html();

var searchTemplate = $("#tmpl-search-criteria").html();
var activitiesSelected = window.localStorage.getItem("selectedActivities");
var itemSelected = JSON.parse(activitiesSelected);
var activityNames = [];
for (var i = 0; i < itemSelected.length; i++) {
    activityNames.push(itemSelected[i].value.Name)
}
var searchqualifierSelected = JSON.parse(window.localStorage.getItem("selectedSearchQualifier"));
var newPostDataArray = [];
_.each(itemSelected, function (objValue) {
    var optionCodes = [];
    var objectItem = objValue.value;
    // alert('Alert code- '+objectItem.ActivityCode);
    var activityObject = new Object();
    activityObject.ProviderActivityCode = objectItem.ActivityCode;
    activityObject.ActivityDate = moment(new Date(objectItem.Date)).format("YYYY-MM-DDThh:mm:ss");
    activityObject.NumberOfAdults = objectItem.Adult;
    activityObject.NumberOfChildren = objectItem.Child;
    activityObject.NumberOfUnits = objectItem.Unit;
    activityObject.OptionCodes = new Array(objectItem.ActivityOption);
    newPostDataArray.push(activityObject);
});
//$("#btnQues").click(function () {
//    alert("OK");
//    //Storage.prototype.setObject("selectedActivitiesQS", selectedActivitiesQS);
//    //window.location = "../activity/Questionnaire.html";
//});
function onButtonClick() {
    Storage.prototype.setObject("selectedActivitiesQS", selectedActivitiesQS);
    window.location = "../activity/Questionnaire.html";
};
var ActivityPrice = {};
var selectedActivitiesQS = [];
//var activitiesSelected = JSON.parse(selectedActivitiesQS);
var providerType = JSON.parse(window.localStorage.getItem("searchCriteria"));
var token = JSON.parse(window.localStorage.getItem("token"));
var dataInput = { "Token": token, "ProviderType": providerType.ProviderType, "Activities": newPostDataArray };

//########//
var repriceOn = window.localStorage.getItem("REPRICEON");
var rePriceCheck = repriceOn === "true";

if (rePriceCheck) {
    var repriceResult = { "repriceResult": JSON.parse(window.localStorage.getItem("repriceResult")) };
    var Results = [];
    Results.push(repriceResult.repriceResult.ActivityRateDetails);
    var RESULT = JSON.stringify(repriceResult.repriceResult);
    var target = '"' + "ActivityRateDetails" + '":' + JSON.stringify(repriceResult.repriceResult.ActivityRateDetails);
    var value = '"' + "Results" + '":' + JSON.stringify(Results);
    RESULT = RESULT.replace(target, value);
    RESULT = JSON.parse(RESULT);
    var searchCriteria = JSON.parse(window.localStorage.getItem("searchCriteria"));

    var htmSearch = Mustache.render(searchTemplate, searchCriteria);

    var requiredQS = RESULT.Results;
    selectedActivitiesQS.push(requiredQS);
    self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
    _.each(RESULT.Results, function (act) {
        _.each(act.PricedActivityDetails, function (det) {
            det.successReprice = "Your activity is still available at the same price.";
        });
    });
    _.each(RESULT.Results, function (act) {
        _.each(act.PricedActivityDetails, function (det) {
            det.ActivityName = this.GetActivityName(det);
        });
    });
    _.each(RESULT.Results, function (act) {
        _.each(act.PricedActivityDetails, function (det) {
            det.ThumbUrl = this.GetThumbUrl(det);
        });
    });
    _.each(RESULT.Results, function (act) {
        _.each(act.PricedActivityDetails, function (det) {
            det.ShortDescription = this.GetShortDescription(det);
        });
    });
    _.each(RESULT.Results, function (act) {
        _.each(act.PricedActivityDetails, function (det) {
            det.ChildAgeOffer = this.GetChildAgeOffer(det);
        });
    });
    _.each(RESULT.Results, function (act) {
        _.each(act.PricedActivityDetails, function (det) {
            det.OptionName = this.GetOptionName(det);
        });
    });
    var html = Mustache.to_html(template, RESULT);
    $(".historical-wrapper").html(html);
    console.log(RESULT);
} else {
    $.ajax({
        url: "../api/catalog/activity/rates/",
        type: "POST",
        data: dataInput,
        success: function (RESULT) {
            // ActivityPrice=e.response.data
            var requiredQS = RESULT.Results;
            selectedActivitiesQS.push(requiredQS);
            var searchCriteria = JSON.parse(window.localStorage.getItem("searchCriteria"));
            var htmSearch = Mustache.render(searchTemplate, searchCriteria);
            self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
            _.each(RESULT.Results, function (act) {
                _.each(act.PricedActivityDetails, function (det) {
                    det.ActivityName = this.GetActivityName(det);
                });
            });
            _.each(RESULT.Results, function (act) {
                _.each(act.PricedActivityDetails, function (det) {
                    det.ThumbUrl = this.GetThumbUrl(det);
                });
            });
            _.each(RESULT.Results, function (act) {
                _.each(act.PricedActivityDetails, function (det) {
                    det.ShortDescription = this.GetShortDescription(det);
                });
            });
            _.each(RESULT.Results, function (act) {
                _.each(act.PricedActivityDetails, function (det) {
                    det.ChildAgeOffer = this.GetChildAgeOffer(det);
                });
            });
            _.each(RESULT.Results, function (act) {
                _.each(act.PricedActivityDetails, function (det) {
                    det.OptionName = this.GetOptionName(det);
                });
            });
            var html = Mustache.to_html(template, RESULT);
            $(".historical-wrapper").html(html);
            console.log(RESULT);
        },
        error: function (e, o, t) {
            //e.ActivityGroup = {};
            e.ErrorCoccured = true;
            var a = JSON.parse(e.responseText);
            var errorDetails = { errorData: a };
            var htm = Mustache.render(template, errorDetails);
            $("#activityholder").html(htm);
            console.log(e + "\n" + o + "\n" + t);
        }
    });
}

}



function GetOptionName(pd) {
    var activitiesSelected = window.localStorage.getItem("selectedActivities");
    var activity = _.find(JSON.parse(activitiesSelected), function (val) {
        return val.key == pd.ProviderActivityCode;
    });
    return activity.value.OptionName;
}
function GetActivityName(pd) {
    var activitiesSelected = window.localStorage.getItem("selectedActivities");
    var activity = _.find(JSON.parse(activitiesSelected), function (val) {
        return val.key == pd.ProviderActivityCode;
    });
    return activity.value.Name;
}
function GetChildAgeOffer(pd) {
    var activitiesSelected = window.localStorage.getItem("selectedActivities");
    var activity = _.find(JSON.parse(activitiesSelected), function (val) {
        return val.key == pd.ProviderActivityCode;
    });
    return activity.value.childAgeOffer;
}
function GetThumbUrl(pd) {
    var activitiesSelected = window.localStorage.getItem("selectedActivities");
    var activity = _.find(JSON.parse(activitiesSelected), function (val) {
        return val.key == pd.ProviderActivityCode;
    });
    return activity.value.image;
}
function GetShortDescription(pd) {
    var activitiesSelected = window.localStorage.getItem("selectedActivities");
    var activity = _.find(JSON.parse(activitiesSelected), function (val) {
        return val.key == pd.ProviderActivityCode;
    });
    return activity.value.shortDescription;
}
//beforeQuote
function beforeQuote() {

    var searchtoken = JSON.parse(window.localStorage.getItem("token"));
    var TravelServices = [];
    function formatDate(dt) {
        var date = new Date(dt);
        var newFormat = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
        return newFormat
    };

    if (rePriceCheck) {
        var actCode = JSON.parse(window.localStorage.getItem("ActivityCode"));
        var repriceSearchQualifier = "1_" + actCode;
        searchqualifierSelected.splice(0, searchqualifierSelected.length);
        searchqualifierSelected.push(repriceSearchQualifier);
    }

    for (var i = 0; i <= selectedActivitiesQS[0][0].PricedActivityDetails.length - 1; i++) {
        if (rePriceCheck) {
            if (actCode == selectedActivitiesQS[0][0].PricedActivityDetails[i].ProviderActivityCode) {


                TravelServices.push({
                    "TravelServiceTypeId": 8,
                    "ActivitySearchQualifier": searchqualifierSelected[i],
                    "ActivityCode": selectedActivitiesQS[0][0].PricedActivityDetails[i].ProviderActivityCode,
                    "ActivityDate": formatDate(selectedActivitiesQS[0][0].PricedActivityDetails[i].ActivityDate),
                    "OptionCodes": [selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionCode],
                    "OptionNames": [selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionName],
                    "FareUniTypeId": "1",

                    "TotalAdult": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfAdults,
                    "TotalChildren": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfChidren,
                    "TotalUnit": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfUnits,
                    "FarePrices": [],
                    "Questionnaires": selectedActivitiesQS[0][0].PricedActivityDetails[i].ActivityQuestionnaireDetails,
                    "Passengers": selectedActivitiesQS[0][0].PricedActivityDetails[i].PassengerDetails,
                    "AgentNotes": "",
                    "Token": searchtoken

                });

            }
        }
        else {
            TravelServices.push({
                "TravelServiceTypeId": 8,
                "ActivitySearchQualifier": searchqualifierSelected[i],
                "ActivityCode": selectedActivitiesQS[0][0].PricedActivityDetails[i].ProviderActivityCode,
                "ActivityDate": formatDate(selectedActivitiesQS[0][0].PricedActivityDetails[i].ActivityDate),
                "OptionCodes": [selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionCode],
                "OptionNames": [selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionName],
                "FareUniTypeId": "1",

                "TotalAdult": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfAdults,
                "TotalChildren": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfChidren,
                "TotalUnit": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfUnits,
                "FarePrices": [],
                "Questionnaires": selectedActivitiesQS[0][0].PricedActivityDetails[i].ActivityQuestionnaireDetails,
                "Passengers": selectedActivitiesQS[0][0].PricedActivityDetails[i].PassengerDetails,
                "AgentNotes": "",
                "Token": searchtoken

            });


        }
    }

    var quoteName = "";

    for (var i = 0; i <= selectedActivitiesQS[0][0].PricedActivityDetails.length - 1; i++) {
        if (rePriceCheck) {
            if (actCode == selectedActivitiesQS[0][0].PricedActivityDetails[i].ProviderActivityCode) {

                quoteName = quoteName + selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionName + "|";
            }
        }
        else {
            quoteName = quoteName + selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionName + "|";
        }
    }


    var quoteRequest = {
        "QuoteName": "ACTIVITIES - " + quoteName,
        "TravelServices": TravelServices,
        "AgentId": getSelectedAgents("user", "AgentId")
    };
    function getSelectedAgents(mainkey, subkey) {
        var name = mainkey + "=";
        var subCookie = subkey + "=";

        var firstString;
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                firstString = c.substring(name.length, c.length);
                break;
            }
        }
        if (firstString) {
            var cookieName = firstString.split('&');
            for (var k = 0; k < ca.length; k++) {
                var split = cookieName[k];
                if (split.indexOf(subCookie) === 0) {
                    return split.substring(subCookie.length, split.length);
                }
            }
        }
        return "";
    };
    return quoteRequest
}

//var activitiesSelected = JSON.parse(selectedActivitiesQS);
//for quote
//####
var onlyQuoteToQs = window.localStorage.getItem("ONLYQUOTETOQS");
var onlyQuoteToQsCheck = onlyQuoteToQs === "true";

var onlYQuote = window.localStorage.getItem("ONLYQUOTE");
var onlyQuoteCheck = onlYQuote === "true";



function onQuoteButtonClick() {
    var btnID = "Quote"
    btnSpin(btnID);

    if ((!onlyQuoteCheck || !onlyQuoteToQsCheck) && !rePriceCheck) {
        var quoteRequest = beforeQuote();
        $.ajax({
            url: "../api/quotes",
            type: "POST",
            data: JSON.stringify(quoteRequest),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                quoteResult = results;
                Storage.prototype.setObject("quoteRequest", quoteRequest);
                Storage.prototype.setObject("quoteResult", quoteResult);
                Storage.prototype.setObject("ActivityNames", activityNames);
                Storage.prototype.setObject("ONLYQUOTETOQS", true);
                window.location = "../activity/Questionnaire.html?itineraries=" + results.QuoteId;
            },

        });
    }
    else if (onlyQuoteCheck || onlyQuoteToQsCheck) {
        var r = window.localStorage.getItem("RepriceQuoteID");
        window.location = "../activity/Questionnaire.html?itineraries=" + r;
    }

}
//OnlyQuote And navigate to TSP;

function onlyQuote() {
    var btnID = "onlyQuoteNoTraveller"
    btnSpin(btnID);
    var quoteRequest = beforeQuote();
    $.ajax({
        url: "../api/quotes",
        type: "POST",
        data: JSON.stringify(quoteRequest),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results, status) {

            quoteResult = results;
            Storage.prototype.setObject("quoteRequest", quoteRequest);
            Storage.prototype.setObject("quoteResult", quoteResult);
            Storage.prototype.setObject("ActivityNames", activityNames);
            Storage.prototype.setObject("ONLYQUOTE", true);
            window.location = "../activity/itineraries.html?QuoteId=" + results.QuoteId;
        },
    });


}

    var btnID = "Quote"
    btnSpin(btnID);
    var searchtoken = JSON.parse(window.localStorage.getItem("token"));
    var TravelServices = [];
    function formatDate(dt) {
        var date = new Date(dt);
        var newFormat = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
        return newFormat
    };
    //
    if (noContactQuoteCheck && rePriceCheck) {
        for (var i = 0; i <= searchqualifierSelected.length - 1; i++) {
            TravelServices.push({
                "TravelServiceTypeId": 8,
                "ActivitySearchQualifier": searchqualifierSelected[i],
                "ActivityCode": selectedActivitiesQS[0][0].PricedActivityDetails[i].ProviderActivityCode,
                "ActivityDate": formatDate(selectedActivitiesQS[0][0].PricedActivityDetails[i].ActivityDate),
                "OptionCodes": [selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionCode],
                "OptionNames": [selectedActivitiesQS[0][0].PricedActivityDetails[i].OptionName],
                "FareUniTypeId": "1",

                "TotalAdult": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfAdults,
                "TotalChildren": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfChidren,
                "TotalUnit": selectedActivitiesQS[0][0].PricedActivityDetails[i].NumberOfUnits,

var quoteResult = {};
//var newQS = [];
//var Questions = { "Questionnaire": newQS};
var a;
var groupQS = [];


function checkGroupQS() {
    if (groupQS.length == quoteResult.TravelServiceIds.length) {
        Storage.prototype.setObject("selectedActivitiesQS", groupQS);
        Storage.prototype.setObject("ActivityNames", activityNames);
    }

}
//new code //


//
function qSValidation() {

    for (var i = 0; i < quoteResult.TravelServiceIds.length; i++) {

        $.ajax({
            url: "../api/validation/activity?quoteId=" + quoteResult.QuoteId + "&travelServiceId=" + quoteResult.TravelServiceIds[i] + "&squash=false",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                if (results != null) {
                    results.shift();
                    groupQS.push(results);
                    checkGroupQS();                  
                    Storage.prototype.setObject("quoteResult", quoteResult);
                    window.location = "../activity/Questionnaire.html";
                }               
            },
        });
    }
}
//Reprice
//function reprice(quoteID, tsID) {
//    $.ajax({
//        url: "../api/quotes/" + quoteID + "/travelservices/" + repriceTravelService + "/activity/reprice",
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (results, status) {
//            if (results != null && status === "success") {
               
                
//            }
//        },
//    });
//}






