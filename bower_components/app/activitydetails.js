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




            var maxAdult = act[j].ActivityInfo.ActivityOptions[k].MaxAdultAllowed;
            var maxChild = act[j].ActivityInfo.ActivityOptions[k].MaxChildAllowed;
            var maxUnit = act[j].ActivityInfo.ActivityOptions[k].MaxUnitAllowed;



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

var act;

var ratings = { "rating": JSON.parse(window.localStorage.getItem("searchCriteria")) }
$(document)
    .ready(function() {
            var searchQualifierList = [];

        /**
         * Backbone view.
         **/
        var quoteName;

		var selectedActivities = [];
        window.AppView = Backbone.View.extend({
            el: $(".totalstaybooking"),

            // Main initialization entry point...

            initialize: function() {
                this.doAvailabilitySearch();
            },

            initControls: function () {
                $('select').select2();
            },

            getParameterByName:function(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },

            findAvailabilityDates: function(activityOptions) {
                return _.uniq(_.pluck(activityOptions, 'AvailableFromDate'));
            },

            groupActivityCategory: function (activities) {
                var self = this, activityOption = {};
                activities = activities.Results;
                act = activities;
                var activityGroupColection = [], toJsonModel = { ActivityGroup: [] }, activity = {}, i;
                for (i = 0; i < activities.length; i++) {
                    var isExist = $.grep(activityGroupColection,
                        function(group) {
                            return group.CategoryName === activities[i].ActivityInfo.CategoryName;
                        });
                    if (isExist.length === 0) {
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
                        //if (activity.ShowUnitPrice == true) {
                        //    var a = setOptions(activities);
                        //    activity.unitOption = a;
                        //}
                       
                        activity.AvailabilityDates = self.findAvailabilityDates(activities[i].ActivityInfo.ActivityOptions);

                        
                        activity.ActivityInfo.push(activities[i].ActivityInfo);
                        activityGroupColection.push(activity);
                    } else {
                        isExist[0].ActivityInfo.push(activities[i].ActivityInfo);
                    }
                }
                toJsonModel.ActivityGroup = activityGroupColection;
               
                return toJsonModel;
            },

           

            doAvailabilitySearch: function(e) {
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
                    success: function(e) {
                        if (e != null) {
														
							//Search criteria

                            Storage.prototype.setObject("token", self.getParameterByName('CriteriaToken'));

							var searchCriteria = Storage.prototype.getObject("searchCriteria");
							 var htmSearch = Mustache.render(searchTemplate, searchCriteria);
							 self.$("#SearchCriteriaPlaceHolder").html(htmSearch);
                            
                             var htm = Mustache.render(template, self.groupActivityCategory(e));
                            
                            self.$("#activityholder").html(htm);
                            setOptions(act);
                            self.applyActivityOptionsAlternateRowColor();
                            self.initControls();
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
                this.$('.activityOptionstbody').each(function() {
                    $(this).find('tr:even').addClass('Activities_line_color');
                });
                
            },

            

			doCheckout: function(){
				if(selectedActivities.length === 0){
					alert("Please short list one activity");
					return;
                }

                Storage.prototype.setObject("selectedSearchQualifier", searchQualifierList);
                
				Storage.prototype.setObject("selectedActivities",selectedActivities);
                window.location = "../activity/ActivityRateDetails.html";
			},
			shortlistActivity: function(e){
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
				if( clsToLoop.filter(':checked').length == 0){
					alert("Please select an option.");
					return;
				}
				
				activityDate = $('#ddlActivityAvailableDates_' + activityCode)["0"].value;
				if($('#ddlActivityAdults_' + activityCode)["0"]){
					adultCount = $('#ddlActivityAdults_' + activityCode)["0"].value;
					childCount = $('#ddlActivityChilds_' + activityCode)["0"].value;
				}
				if($('#ddlActivityUnits_' + activityCode)["0"]){
					unitCount = $('#ddlActivityUnits_' + activityCode)["0"].value;
				}
               
                    _.each(clsToLoop, function (rdo) {
					if($(rdo).is(':checked')){
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
						selectedActivities.push({
							key:   e.currentTarget.getAttribute("activityCode"),
							value: myObject
						});
						anyOptionSelected = true;
					}					
                    }
                    )
                   
				
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