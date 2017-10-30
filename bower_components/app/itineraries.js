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
            $.ajax({
                url: "../api/quotes/" + result + "?includeDetails=false&includeSuggestions=true&tefsInvoices=false",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    if (results != null) {
                        Storage.prototype.setObject("getQuote", results);
                    }
                },
            });
        }
    });

var targetContainer = $(".historical-wrapper"),
  
    template = $("#tmpl-activity-price-descriptions").html();

    QStemplate = $("#tmpl-activity-price-descriptions").html();

    template = $("#tmpl-activity-summary").html();

    var activityNames = { "ActivityNames": JSON.parse(window.localStorage.getItem("ActivityNames")) };

    var  searchTemplate = $("#tmpl-search-criteria").html();
    var summary = JSON.parse(window.localStorage.getItem("getQuote"));

    for (var i = 0; i < summary.ActivityTravelServices.length; i++) {
        summary.ActivityTravelServices[i]["DisplayContactName"] = summary.Contact == null ? "" : summary.Contact.Title + " " + summary.Contact.DisplayName;
        summary.ActivityTravelServices[i]["ActivityName"] = activityNames.ActivityNames[i];
        summary.ActivityTravelServices[i]["ActivityDate"] = summary.ActivityTravelServices[i].ActivityDate.replace("T00:00:00", "");
        summary.ActivityTravelServices[i]["StartDate"] = summary.ActivityTravelServices[i].StartDate.replace("T00:00:00", "");
        summary.ActivityTravelServices[i]["EndDate"] = summary.ActivityTravelServices[i].EndDate.replace("T00:00:00", "");
    }

   var details = { "details": summary };
   var html = Mustache.to_html(template, details);
   $(".historical-wrapper").html(html);

   
