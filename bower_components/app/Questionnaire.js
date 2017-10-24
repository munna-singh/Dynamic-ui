
var targetContainer = $(".historical-wrapper"),

    template = $("#tmpl-activity-price-descriptions").html();

var searchTemplate = $("#tmpl-search-criteria").html();

var activityNames = { "ActivityNames": JSON.parse(window.localStorage.getItem("ActivityNames")) };
var activitiesSelected = { "QuestionnaireDetails": JSON.parse(window.localStorage.getItem("selectedActivitiesQS")) };
//activitiesSelected["ActivityNames"] = activityNames.ActivityNames;

//window.onload = function () { formatqs() };
//function formatqs() {
   // var counter=0;

var success = {};
var newQS =[];
for (var k = 0; k < activitiesSelected.QuestionnaireDetails.length; k++) {
    var l = activitiesSelected.QuestionnaireDetails[k].length;
   
     var q = 1;
    for (var i = 1; i < activitiesSelected.QuestionnaireDetails[k].length; i++) {
        
        activitiesSelected.QuestionnaireDetails[k][i]["id"] = q;
        activitiesSelected.QuestionnaireDetails[k][i - 1]["Answer"] = activitiesSelected.QuestionnaireDetails[k][i];
        i++;
        q++;
    }

    for (var j = 1; j <= l / 2; j++) {
        activitiesSelected.QuestionnaireDetails[k].splice(j, 1);

    }
    var newQ = [];
    var temp = {
                 "ActivityName": activityNames.ActivityNames[k],
                 "details": activitiesSelected.QuestionnaireDetails};
    
    newQ.push(temp);
    newQS.push(newQ);
    success = newQS;
   // var temp = { "ActivityName":{"name": activityNames.ActivityNames[k] } };

   // activitiesSelected.QuestionnaireDetails[k].push(temp);

}


   

    
//}



var quote = { "quote": JSON.parse(window.localStorage.getItem("quoteResult")) }; 


_.each(activitiesSelected.QuestionnaireDetails, function (question, index) {
    question.isQuestion = _.filter(question.Rules, function (rule) {
        return rule.ValidationType == "RequiredDefault" ||
            rule.ValidationType == "ReadOnlyValidator";
    }).length > 0;
});


//var searchqualifierSelected = JSON.parse(window.localStorage.getItem("selectedSearchQualifier"));
var searchtoken = JSON.parse(window.localStorage.getItem("token"));

window.onload = function () { title() };
window.onload = function () { findClients() };
window.onload = function () {
    var searchCriteria = Storage.prototype.getObject("searchCriteria");
    var htmSearch = Mustache.render(searchTemplate, searchCriteria);
    self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
}

function title() {
    var searchCriteria = Storage.prototype.getObject("searchCriteria");
    var htmSearch = Mustache.render(searchTemplate, searchCriteria);
    self.$("#SearchCriteriaPlaceHolder").html(htmSearch);

}

//var deatails = {};
//var Ql = [];
////var Questionnaire = [];

//_.each(activitiesSelected[0], function (act) {    
//    _.each(act.PricedActivityDetails, function (det) {
//        deatails = {};
//        //deatails.QuestionnaireDetails = [];
//       // 
//        //Questionnaire.push(det.ActivityQuestionnaireDetails);
//        deatails.activityName = det.ActivityName;
//        deatails.QuestionnaireDetails= det.ActivityQuestionnaireDetails;  
//        Ql.push(deatails);
//    });   



//});

//var html = Mustache.to_html(template, qustionaries);
var html = Mustache.to_html(template, success);
$(".historical-wrapper").html(html);

var client = [];
function onSearchButtonClick() {
    
    $.ajax({
        url: "../api/clients?searchCriteria=" + document.getElementById('clientSearch').value,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                client.push(results);
                addClientToQuote();
            }
            //    results.shift();
            //    //  Questions['Questionnaire'].push({ results});
            //    //newQS.push(results);
            //    a = results;
            //    insertActivityName();
            //    Storage.prototype.setObject("selectedActivitiesQS", a);

            //    window.location = "../activity/Questionnaire.html";
            //}



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
        url: "../api/quotes/"+id+"/contact",
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
          
            //"ContactId": 95896,
            //    "FirstName": "Pritam",
            //        "MiddleName": "",
            //            "LastName": "Samantaray",
            //                "Title": "Mr.",
            //                    "DisplayName": "Pritam Samantaray",
            //                        "DateOfBirth": "1993-05-17T00:00:00",
            //                            "Age": 24,
            //                                "Gender": "M",
            //                                    "IsContactTraveling": false,
            //                                        "PrimaryPhone": "00001111010",
            //                                            "PrimaryEmail": null,
            //                                                "IsCorporateClient": false


        },

    });


}
function onBookButtonClick() {
    var searchtoken = JSON.parse(window.localStorage.getItem("token"));
    var dataInputAddClientToBook = {
                                    "SessionId":null,
                                    "QuoteId":id,
                                    "TravelServiceIds": quote.quote.TravelServiceIds,
                                    "Token": searchtoken ,
                                    "ContactTravelerId": client[0][0].Id
                                            };

    $.ajax({
        url: "../api/quotes/" + quote.quote.QuoteId + "/travelservices/" + quote.quote.TravelServiceIds[0]+"/activity/book" ,
        type: "POST",
        data: JSON.stringify(dataInputAddClientToBook),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                getQuoteBooked();
            }
        },
        error: function (result) {
            getQuoteNoBook();

        }

    });

}

function getQuoteBooked() {
    $.ajax({
        url: "../api/quotes/" + quote.quote.QuoteId + "?includeDetails=false&includeSuggestions=true&tefsInvoices=false",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            if (results != null) {
                Storage.prototype.setObject("getQuote", results);

                window.location = "../activity/itineraries.html";
            }



        },
       
    });

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
