$(document)
    .ready(function () {
        if (location.search.substr(1) != null) {
            var result = null,
                tmp = [];
            var items = location.search.substr(1).split("&");
            for (var index = 0; index < items.length; index++) {
                tmp = items[index].split("=");
                if (tmp[0] === "QuoteId") result = decodeURIComponent(tmp[1]);
            }
            setTimeout(function () {
            }, 500);

            $.ajax({
                url: "../api/quotes/" + result + "?includeDetails=false&includeSuggestions=true&tefsInvoices=false",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    if (results != null) {
                        //Storage.prototype.setObject("getQuote", results);
                        //console.log(results);

                        getQuoteRes(results);
                    }
                },
            });
        }
    });

var quoteID;
var contactId;

function getQuoteRes(results) {
    var targetContainer = $(".historical-wrapper"),
        template = $("#tmpl-activity-price-descriptions").html();
    QStemplate = $("#tmpl-activity-price-descriptions").html();
    template = $("#tmpl-activity-summary").html();
    var activityNames = { "ActivityNames": JSON.parse(window.localStorage.getItem("ActivityNames")) };
    var searchTemplate = $("#tmpl-search-criteria").html();
    var summary = results;
    quoteID = summary.QuoteId;
    if (summary.Contact != null) {
        contactId = summary.Contact.ContactId;
    }
    for (var i = 0; i < summary.ActivityTravelServices.length; i++) {
        var status = this.GetBookingStatus(summary.ActivityTravelServices[i].TravelServiceStatusId);
        summary.ActivityTravelServices[i]["Status"] = status[0];
        summary.ActivityTravelServices[i]["Color"] = status[1];
        summary.ActivityTravelServices[i]["IsBookEnable"] = summary.ActivityTravelServices[i].TravelServiceStatusId === 1;
        summary.ActivityTravelServices[i]["IsCancelEnable"] = summary.ActivityTravelServices[i].TravelServiceStatusId === 3 || summary.ActivityTravelServices[i].TravelServiceStatusId === 23;
        summary.ActivityTravelServices[i]["DisplayContactName"] = summary.Contact == null ? "" : summary.Contact.Title + " " + summary.Contact.DisplayName;
        summary.ActivityTravelServices[i]["ActivityName"] = summary.ActivityTravelServices[i].Detail.ActivityName;
        summary.ActivityTravelServices[i]["ActivityDate"] = summary.ActivityTravelServices[i].ActivityDate.replace("T00:00:00", "");
        summary.ActivityTravelServices[i]["StartDate"] = summary.ActivityTravelServices[i].StartDate.replace("T00:00:00", "");
        summary.ActivityTravelServices[i]["EndDate"] = summary.ActivityTravelServices[i].EndDate.replace("T00:00:00", "");
    }
    var details = { "details": summary };
    var html = Mustache.to_html(template, details);
    $(".historical-wrapper").html(html);
}
function GetBookingStatus(statuId) {
    var serviceStatus = [];

    switch (statuId) {
        case 1:
            serviceStatus.push("OFFERED");
            serviceStatus.push("#c688bb");
            break;
        case 3:
            serviceStatus.push("BOOKED");
            serviceStatus.push("#822678");
            break;
        case 23:
            serviceStatus.push("BOOKED-NOPAY");
            serviceStatus.push("#822678");
            break;
        case 5:
            serviceStatus.push("CANCELED");
            serviceStatus.push("#afb8bd");
            break;
        case 22:
            serviceStatus.push("BOOKEDRESERVED");
            serviceStatus.push("#afb8bd");
            break;
        case 16:
            serviceStatus.push("PENDING CANCEL");
            serviceStatus.push("#d9534f");
            break;
    }
    return serviceStatus;
}
function actualTSP() {
    window.open("../itineraries/" + quoteID, '_blank');
}
function returnBookRequest(TravelServiceId) {
    var searchtoken = JSON.parse(window.localStorage.getItem("token"));
    var dataInputAddClientToBook = {
        "SessionId": null,
        "QuoteId": quoteID,
        "TravelServiceId": TravelServiceId,
        "Token": searchtoken,
        "ContactTravelerId": contactId
    };
    return dataInputAddClientToBook;
}
var numOfBooking = 0;
function onBookButtonClick(tsid) {
    $.ajax({
        url: "../api/quotes/" + quoteID + "/travelservices/" + tsid + "/activity/book",
        type: "POST",
        data: JSON.stringify(returnBookRequest(tsid)),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results, status) {
            if (results != null && status === "success") {
                window.location = "../activity/itineraries.html?QuoteId=" + quoteID;
            }
        },
        error: function (result) {
            window.location = "../activity/itineraries.html?QuoteId=" + quoteID;
        }
    });
}
var repriceTravelService;

function bookFromTSP(e) {
 
    var activityCode = e.getAttribute("ActivityCode");
    Storage.prototype.setObject("ActivityCode", activityCode);
    var tsID = e.getAttribute("id");
    Storage.prototype.setObject("tsIDReprice", tsID);
    repriceTravelService = tsID;
    btnSpin(tsID);
    
    reprice(quoteID, tsID);
}
function reprice(quoteID, tsID) {
    $.ajax({
        url: "../api/quotes/" + quoteID + "/travelservices/" + tsID + "/activity/reprice",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results, status) {
            if (results != null && status === "success") {
                Storage.prototype.setObject("REPRICEON", true);
                if (results.HasAvailAtSamePrice) {
                    Storage.prototype.setObject("repriceResult", results);
                    Storage.prototype.setObject("RepriceQuoteID", quoteID);
                    window.location = "../activity/ActivityRateDetails.html?QuoteId=" + quoteID + "&ServiceId=" + tsID;
                }
                else {
                    var searchtoken = JSON.parse(window.localStorage.getItem("token"));
                    window.location = "../activity/activityresults.html?CriteriaToken=" + searchtoken;

                }
            }
        },
    });
}

var a = { "Remarks": "cancel" }
function doCancel(cn) {
    var tsID = cn.getAttribute("id");
    btnSpin(tsID);
    $.ajax({
        url: "../api/quotes/" + quoteID + "/travelservices/" + tsID + "/activity/cancelpnr",
        type: "POST",
        data: JSON.stringify(a),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results, status) {
            if (results != null && status === "success") {
                window.location = "../activity/itineraries.html?QuoteId=" + quoteID;
            }
        },
        error: function (result) {
            window.location = "../activity/itineraries.html?QuoteId=" + quoteID;
        }
    });
}


//function createRateCallRqForRepriceTS(e) {
//    var rateCallRqForRepriceTS = {
//        "Token": e.CriteriaToken,
//        "ProviderType": e.Criteria.ProviderType,
//        "Activities": [{
//            "ProviderActivityCode": e.ActivityRateDetails.PricedActivityDetails,
//            "ActivityDate": "2017-12-23T00:00:00",
//            "NumberOfAdults": "1",
//            "NumberOfChildren": "0",
//            "NumberOfUnits": 0,
//            "OptionCodes": ["15199384"]
//        }]
//    }

//}







