/**
 * @file 
 * Provides main Backbone view events and models.
 *
 * all te backbone events and models are presence here
 *
 * Author: Viniston Fernando
 */

function setOptions(act) {
    for (var j = 0; j < act.length; j++) {
        var activityCode = act[j].ActivityInfo.ActivityCode;
        for (var k = 0; k < act[j].ActivityInfo.ActivityOptions.length; k++) {
            for (var l = 0; l < act[j].ActivityInfo.ActivityOptions[k].OptionAvailabilities.length; l++) {

                var maxAdult = act[j].ActivityInfo.ActivityOptions[k].OptionAvailabilities[l].MaxAdultAllowed;
                var maxChild = act[j].ActivityInfo.ActivityOptions[k].OptionAvailabilities[l].MaxChildAllowed;
                var maxUnit = act[j].ActivityInfo.ActivityOptions[k].OptionAvailabilities[l].MaxUnitAllowed;
                if (maxUnit != 0) {
                    var options = '';
                    for (i = 1; i <= maxUnit; i++) {
                        options += '<option value="' + i + '">' + i + '</option>';
                    }
                    //return options;
                    var unitOptionId = "#ddlActivityUnits_" + activityCode;
                    var sel = $(unitOptionId);
                    sel.empty().append(options);
                }
                else {
                    var optionsForAdult = '';
                    var optionsForChild = '';
                    for (i = 1; i <= maxAdult; i++) {
                        optionsForAdult += '<option value="' + i + '">' + i + '</option>';
                    }
                    for (i = 0; i <= maxChild; i++) {
                        optionsForChild += '<option value="' + i + '">' + i + '</option>';
                    }
                    //return options;
                    //return optionsForChild;
                    var adultOptionId = "#ddlActivityAdults_" + activityCode;
                    var childOptionId = "#ddlActivityChilds_" + activityCode;
                    var sel1 = $(adultOptionId);
                    var sel2 = $(childOptionId);
                    sel1.empty().append(optionsForAdult);
                    sel2.empty().append(optionsForChild);
                }

            }


        }
    }
}
var act;
var ratings = { "rating": JSON.parse(window.localStorage.getItem("searchCriteria")) }

var changeInJsonResponseforAllOptionsWithDate = {};

//filter all date from all options

//function filterDateFromAllOptions(r) {

//    var a = [];
//    var newDtaes = [];
//    for (var i = 0; i < r.length; i++) {
//        for (var j = 0; j < r[i].OptionAvailabilities; j++) {

//            a.push(getDates(new Date(r[i].OptionAvailabilities[j].AvailableFromDate), new Date(r[i].OptionAvailabilities[j].AvailableToDate)));
//        }

//    }
//}

$(document)
    .ready(function () {
        var searchQualifierList = [];
        /**
         * Backbone view.
         **/
        var quoteName;
        var selectedActivities = [];
        window.AppView = Backbone.View.extend({
            el: $(".totalstaybooking"),
            // Main initialization entry point...
            initialize: function () {
                this.doAvailabilitySearch();
            },
            initControls: function () {
                $('select').select2();
            },
            getParameterByName: function (name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },

            //filter all date from all options
            findAvailabilityDates: function (activityOptions) {
                // filterDateFromAllOptions(activityOptions);
                var a = [];
                var newDates = [];

                for (var i = 0; i < activityOptions.length; i++) {
                    for (var j = 0; j < activityOptions[i].OptionAvailabilities.length; j++) {

                        a.push(getDates(new Date(activityOptions[i].OptionAvailabilities[j].AvailableFromDate), new Date(activityOptions[i].OptionAvailabilities[j].AvailableToDate)));
                    }

                }
                //for (var i = 0; i < activityOptions.length; i++) {

                //    a.push(getDates(new Date(activityOptions[i].AvailableFromDate), new Date(activityOptions[i].AvailableToDate)));


                //    //a.push(activityOptions[i].AvailableFromDate);
                //    //a.push(activityOptions[i].AvailableToDate);                                     
                //    //a = _.pluck(activityOptions[i], 'AvailableFromDate')
                //    //a.push(_.pluck(activityOptions[i], 'AvailableToDate')[0]);
                //}
                for (var j = 0; j < a.length; j++) {
                    for (var k = 0; k < a[j].length; k++) {

                        

                        newDates.push(moment(new Date(a[j][k])).format("MMM DD YYYY [(]ddd[)]"));

                    }

                }
                return _.uniq(newDates).sort();

            },
            groupActivityCategory: function (activities) {
                var self = this, activityOption = {};
                activities = activities.Results;
                act = activities;
                var activityGroupColection = [], toJsonModel = { ActivityGroup: [] }, activity = {}, i;
                for (i = 0; i < activities.length; i++) {
                    var isExist = $.grep(activityGroupColection,
                        function (group) {
                            return group.CategoryName === activities[i].ActivityInfo.CategoryName;
                        });
                    var c;
                    if (isExist.length === 0) {
                        var c = 0;
                        activity = {};
                        if (activities[i].ActivityInfo.ActivityOptions &&
                            activities[i].ActivityInfo.ActivityOptions.length > 0) {
                            activityOption = activities[i].ActivityInfo.ActivityOptions[0];
                        }
                        activity.CategoryName = activities[i].ActivityInfo.CategoryName;
                        activity.ActivityInfo = [];
                        activity.ShowAdultPrice = activityOption && activityOption.OptionType !== 1;
                        activity.ShowUnitPrice = activityOption && activityOption.OptionType === 1;
                        activity.ShowDiscount = activities[i].ActivityInfo.SpecialOffer ? true : false;
                        activity.ShowChildPrice = activityOption && activityOption.OptionType !== 1;
                        activity.ActivityInfo.push(activities[i].ActivityInfo);
                        activity.ActivityInfo[c].AvailabilityDates = self.findAvailabilityDates(activities[i].ActivityInfo.ActivityOptions);
                        activityGroupColection.push(activity);
                        c++;
                    } else {
                        isExist[0].ActivityInfo.push(activities[i].ActivityInfo);
                        activity.ActivityInfo[c].AvailabilityDates = self.findAvailabilityDates(activities[i].ActivityInfo.ActivityOptions);
                        // 
                        c++;
                    }
                }
                toJsonModel.ActivityGroup = activityGroupColection;



                changeInJsonResponseforAllOptionsWithDate = JSON.parse(JSON.stringify(toJsonModel)); //Parsing by Value

                for (var t = 0; t < toJsonModel.ActivityGroup.length; t++) {
                    for (var y = 0; y < toJsonModel.ActivityGroup[t].ActivityInfo.length; y++) {
                        for (var u = 0; u < toJsonModel.ActivityGroup[t].ActivityInfo[y].ActivityOptions.length; u++) {

                            toJsonModel.ActivityGroup[t].ActivityInfo[y].ActivityOptions[u].OptionAvailabilities.length = 1;


                        }

                    }

                }

                return toJsonModel;
            },
            doAvailabilitySearch: function (e) {
                var template,
                    searchTemplate,
                    self = this;
                template = $("#tmpl-activity").html();
                searchTemplate = $("#tmpl-search-criteria").html();
                var dataInput = {
                    "MinPrice": null,
                    "MaxPrice": null,
                    "MinRating": ratings.rating.MinRating,
                    "MaxRating": ratings.rating.MaxRating,
                    "MinDistance": null,
                    "MaxDistance": null,
                    "ActivityName": "",
                    "pageSize": 100,
                    "pageNumber": 1,
                    "ActivityType": [0],
                    "ApplyFiltering": true
                };
                $.ajax({
                    url: "../api/catalog/activity/availability/" + self.getParameterByName('CriteriaToken'),
                    type: "POST",
                    data: dataInput,
                    success: function (e) {
                        if (e != null) {
                            //Search criteria
                            Storage.prototype.setObject("token", self.getParameterByName('CriteriaToken'));
                            var searchCriteria = Storage.prototype.getObject("searchCriteria");
                            var htmSearch = Mustache.render(searchTemplate, searchCriteria);
                            self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
                            var htm = Mustache.render(template, self.groupActivityCategory(e));
                            self.$("#activityholder").html(htm);
                            //
                            arrangeOptionsAccordingToDate();
                            setOptions(act);
                            self.applyActivityOptionsAlternateRowColor();
                            self.initControls();
                            var elems = document.getElementsByClassName("btn-activity-shortlist");
                            for (var i = 0; i < elems.length; i++) {
                                elems[i].disabled = true;
                            }
                        }
                    },
                    error: function (e, o, t) {
                        e.ActivityGroup = {};
                        e.ErrorCoccured = true;
                        e.errorDto = JSON.parse(e.responseText);
                        var errorDetails = { errorData: e };
                        var htm = Mustache.render(template, errorDetails);
                        self.$("#activityholder").html(htm);
                        console.log(e + "\n" + o + "\n" + t);
                    }
                });
                return true;
            },
            applyActivityOptionsAlternateRowColor: function () {
                this.$('.activityOptionstbody').each(function () {
                    $(this).find('tr:even').addClass('Activities_line_color');
                });
            },
            doCheckout: function () {
                if (selectedActivities.length === 0) {
                    alert("Please short list one activity");
                    return;
                }
                //CONDITION

                Storage.prototype.setObject("selectedSearchQualifier", _.uniq(searchQualifierList));
                Storage.prototype.setObject("selectedActivities", selectedActivities);
                Storage.prototype.setObject("ONLYQUOTE", false);
                Storage.prototype.setObject("ONLYQUOTEWITHQS", false);
                Storage.prototype.setObject("REPRICEON", false);
                Storage.prototype.setObject("ONLYQUOTETOQS", false);
                Storage.prototype.setObject("hasQSANS", false);
                window.location = "../activity/ActivityRateDetails.html";
            },
            shortlistActivity: function (e) {
                var anyOptionSelected,
                    activityCode,
                    clsToLoop,
                    activityDate,
                    adultCount,
                    childCount,
                    unitCount,
                    activityName,
                    thumbUrl,
                    shortDescription,
                    childAgeOffer,
                    optionName
                SearchQualifierV = e.currentTarget.getAttribute("searchqualifier");
                searchQualifierList.push(SearchQualifierV);
                activityName = e.currentTarget.getAttribute("activityname");
                thumbUrl = e.currentTarget.getAttribute("ThumbUrl");
                shortDescription = e.currentTarget.getAttribute("ShortDescription");
                childAgeOffer = e.currentTarget.getAttribute("ChildAgeOffer");
                anyOptionSelected = false;
                activityCode = e.currentTarget.getAttribute("activityCode");
                clsToLoop = $("input.rdo-" + activityCode);
                var a = "Radio_" + activityCode;
                optionName = $('input[name= a]:checked').val();
                if (clsToLoop.filter(':checked').length == 0) {
                    alert("Please select an option.");
                    return;
                }
                activityDate = $('#ddlActivityAvailableDates_' + activityCode)["0"].value;
                if ($('#ddlActivityAdults_' + activityCode)["0"]) {
                    adultCount = $('#ddlActivityAdults_' + activityCode)["0"].value;
                    childCount = $('#ddlActivityChilds_' + activityCode)["0"].value;
                }
                if ($('#ddlActivityUnits_' + activityCode)["0"]) {
                    unitCount = $('#ddlActivityUnits_' + activityCode)["0"].value;
                }
                function modifyArray(actCode, obj) {
                    if (selectedActivities.length == 0) {
                        selectedActivities.push({
                            key: actCode,
                            value: obj
                        });
                    }
                    else {
                        if (selectedActivities[selectedActivities.length - 1].key == actCode) {
                            selectedActivities.splice(selectedActivities.length - 1, 1, {
                                key: actCode,
                                value: obj
                            })
                        }
                        else {
                            selectedActivities.push({
                                key: actCode,
                                value: obj
                            });
                        }
                    }
                }
                _.each(clsToLoop, function (rdo) {
                    if ($(rdo).is(':checked')) {
                        var myObject = new Object();
                        myObject.ActivityCode = activityCode;
                        myObject.ActivityOption = rdo.value;
                        myObject.OptionName = rdo.id;
                        myObject.Date = activityDate;
                        myObject.Adult = adultCount;
                        myObject.Child = childCount;
                        myObject.Unit = unitCount;
                        myObject.Name = activityName;
                        //quoteName = quoteName + activityName + "|";
                        myObject.image = thumbUrl;
                        myObject.shortDescription = shortDescription;
                        myObject.childAgeOffer = childAgeOffer;
                        modifyArray(e.currentTarget.getAttribute("activityCode"), myObject)
                        anyOptionSelected = true;
                    }
                })
                $(e.currentTarget).attr("disabled", true);
                // selectedActivities.push({ quoteName });
            },
            // Backbone View events ...
            events: {
                "click #btnCheckout": "doCheckout",
                "click .btn-activity-shortlist": "shortlistActivity"
            }
        });
        var appview = new AppView();
    });
var flag = 0;


//Date Array

Date.prototype.addDays = function (days) {

    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(moment(new Date(currentDate)).format("YYYY-MM-DDThh:mm:ss"));
        //console.log(this);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

var tarGetDATE;
function checkDateAvailaibility(targetDate, startDate, stopDate) {
    tarGetDATE = targetDate;

    if (getDates(startDate, stopDate).indexOf(moment(new Date(tarGetDATE)).format("YYYY-MM-DDThh:mm:ss")) > -1) {
        return true;

    }
}

//new
function SelectActivityDate(e) {

    var targetDate;

    for (var i = 0; i < changeInJsonResponseforAllOptionsWithDate.ActivityGroup.length; i++) {
        for (var j = 0; j < changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo.length; j++) {
            if (changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityCode == e) {

                var dropdownID = "ddlActivityAvailableDates_" + e;
                targetDate = document.getElementById(dropdownID).value;
                for (var k = 0; k < changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions.length; k++) {

                    var optionID = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionId;

                    for (var l = 0; l < changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities.length; l++) {

                        //new Date(activityOptions[i].AvailableFromDate)


                        if (checkDateAvailaibility(new Date(targetDate), new Date(changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[l].AvailableFromDate),
                            new Date(changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[l].AvailableToDate))) {



                            for (var c = 0; c < changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities.length; c++) {
                                //Adult
                                if (changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].AdultPrice.Amount != 0) {
                                    var adultPriceID = "#Adult_" + optionID;
                                    priceChangeForAdult = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].AdultPrice.Symbol + ' ' +
                                        changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].AdultPrice.Amount;// + '&nbsp';
                                    var adult = $(adultPriceID);
                                    adult.empty().append(priceChangeForAdult);
                                }


                                //Child
                                if (changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].ChildPrice.Amount != 0) {
                                    var childPriceID = "#Child_" + optionID;
                                    priceChangeForChild = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].ChildPrice.Symbol + ' ' +
                                        changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].ChildPrice.Amount;// + '&nbsp';
                                    var child = $(childPriceID);
                                    child.empty().append(priceChangeForChild);
                                }


                                //Unit
                                if (changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].UnitPrice.Amount != 0) {
                                    var unitPriceID = "#Unit_" + optionID;
                                    priceChangeForUnit = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].UnitPrice.Symbol + ' ' +
                                        changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionAvailabilities[c].UnitPrice.Amount;//+ '&nbsp';
                                    var unit = $(unitPriceID);
                                    unit.empty().append(priceChangeForUnit);
                                }
                            }
                            var optID_radio = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionId;

                            var optNametext = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionId;

                            adultPriceField = "Adult_" + optID_radio;
                            childPriceField = "Child_" + optID_radio;
                            unitPriceField = "Unit_" + optID_radio;

                            $("#" + optID_radio + "_radio").show();
                            $("#" + optNametext + "_text").show();
                            $("#" + adultPriceField).show();
                            $("#" + childPriceField).show();
                            $("#" + unitPriceField).show();

                            break;
                        }

                        else {

                            var optID_radio = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionId;

                            var optNametext = changeInJsonResponseforAllOptionsWithDate.ActivityGroup[i].ActivityInfo[j].ActivityOptions[k].OptionId;

                            adultPriceField = "Adult_" + optID_radio;
                            childPriceField = "Child_" + optID_radio;
                            unitPriceField = "Unit_" + optID_radio;

                            $("#"+optID_radio +"_radio").hide();
                            $("#"+optNametext+"_text").hide();
                            $("#"+adultPriceField).hide();
                            $("#"+childPriceField).hide();
                            $("#"+unitPriceField).hide();
                        }

                    }

                }
            }

        }
    }

}


//arrange options according to date after rendering
function arrangeOptionsAccordingToDate() {
    for (var i = 0; i < act.length; i++) {
        SelectActivityDate(act[i].ActivityInfo.ActivityCode);
       
    }
}



function enableShortlistBTN(e) {

    var optionID = e.getAttribute('value');

    var radioNameACTcode = e.getAttribute('name').replace("Radio_", "");

    var dateSelectionDropdown = "#ddlActivityAvailableDates_" + radioNameACTcode;

    var dropdownChange = $(dateSelectionDropdown);
    dropdownChange.attr("OptionId", optionID);
    var a = e.getAttribute('name');

    //Radio_1460007 //searchqualifier
    //ddlActivityAvailableDates_1357650
    var providerType = JSON.parse(window.localStorage.getItem("searchCriteria"));
    //a = a.replace("Radio", "1");

    //modified code
    if (providerType.ProviderType == 1) {
        a = a.replace("Radio", "1");
    }
    else if (providerType.ProviderType == 2) {
        a = a.replace("Radio", "2_1");
    }





    var target = document.getElementById(a);
    if (target.disabled) {
        target.disabled = false;
    }
}