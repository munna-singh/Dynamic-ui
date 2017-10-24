

var targetContainer = $(".historical-wrapper"),
  
    template = $("#tmpl-activity-price-descriptions").html();

QStemplate = $("#tmpl-activity-price-descriptions").html();

template = $("#tmpl-activity-summary").html();

   var activityNames = { "ActivityNames": JSON.parse(window.localStorage.getItem("ActivityNames")) };

   var  searchTemplate = $("#tmpl-search-criteria").html();
   var summary = JSON.parse(window.localStorage.getItem("getQuote"));

   for (var i = 0; i < summary.ActivityTravelServices.length; i++) {

       summary.ActivityTravelServices[i]["DisplayContactName"] = summary.Contact.Title + " " + summary.Contact.DisplayName;
       summary.ActivityTravelServices[i]["ActivityName"] = activityNames.ActivityNames[i];
       summary.ActivityTravelServices[i]["ActivityDate"] = summary.ActivityTravelServices[i].ActivityDate.replace("T00:00:00", "");
       summary.ActivityTravelServices[i]["StartDate"] = summary.ActivityTravelServices[i].StartDate.replace("T00:00:00", "");
       summary.ActivityTravelServices[i]["EndDate"] = summary.ActivityTravelServices[i].EndDate.replace("T00:00:00", "");


   }




   var details = { "details": summary };
   var html = Mustache.to_html(template, details);
   $(".historical-wrapper").html(html);

   
