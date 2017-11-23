/**
 * @file 
 * Provides main Backbone view events and models.
 *
 * all te backbone events and models are presence here
 *
 * Author: Viniston Fernando
 */
$(document)
    .ready(function() {

        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a,
                function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
            return o;
        };

        /**
        * Backbone view model.
        **/
        var searchModel = Backbone.Model.extend({
            defaults: {
                ArrivalDate: moment().format(),
                Duration: 1,
                MinStarRating: 1,
                Adults: 1,
                Children: 0,
                Infants: 0,
                RegionId: 72
            }
        });

        /**
         * Backbone view.
         **/

        window.AppView = Backbone.View.extend({
            el: $(".totalstaybooking"),

            // Main initialization entry point...

            initialize: function() {
                this.initInputForm();
				this.getQuotes();
            },

            initInputForm: function() {
				var self= this;
                $('select').select2();
                $('.activitydate')
                    .datepicker({
                        format: "mm/dd/yyyy",
                        language: 'en',
                        autoclose: true,
                        defaultDate: moment().toDate()
                    })
                    .on('changeDate',
                        function(ev) {
                            $('.activitydate').datepicker('hide');
                        });
                $("#startdate").datepicker('setDate', moment().add(1, 'months').toDate());
                $("#enddate").datepicker('setDate', moment().add(3, 'days').add(1, 'month').toDate());
				
				try {
                    autocomplete = new google.maps.places.Autocomplete(this.$('.destination-typeahead')[0]);

                    autocomplete.addListener('place_changed', function () {
                        var place, location, state, country;
                        place = autocomplete.getPlace();
                        if (!place.geometry) {
                            window.alert("Information not returned by google.");
                            return;
                        }
						self.model = new Backbone.Model();
						location = _.find(place.address_components, function(addr){return addr.types.indexOf("locality") > -1; });
						state = _.find(place.address_components, function(addr){return addr.types.indexOf("administrative_area_level_1") > -1; });
						country = _.find(place.address_components, function(addr){return addr.types.indexOf("country") > -1; });
						 
                        self.model.set({
                            Destination: {
                                FormattedName: place.formatted_address,
                                DestinationType: 2,//EnumTypes.HotelSearchTypeTypes.GeoLocation
								Name:location?location.long_name:null,
								State:state?state.long_name:null,
								Country:country?country.long_name:null
                            },
                            Location: {
                                Latitude: place.geometry.location.lat(),
                                Longitude: place.geometry.location.lng()
                            }
                        });
                    });
                } catch (e) {//ignore jslint
                    // Ignore this.
                }
				
            },

			getSelectedAgents: function (mainkey, subkey) {
                var name = mainkey + "=";
				var subCookie = subkey + "=";
				
				var firstString;
				var ca = document.cookie.split(';');
				for(var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						firstString =  c.substring(name.length, c.length);
						break;
					}
				}
				if(firstString){
					var cookieName = firstString.split('&');
					for(var k = 0; k < ca.length; k++){
						var split = cookieName[k];
						if(split.indexOf(subCookie) === 0){
							return split.substring(subCookie.length, split.length);
						}
					}
				}
				return "";
            },
			
            doAvailabilitySearch: function(e) {
                var template,
                    dataObj,
                    self = this;
                dataObj = this.$('#RegMetadata').serializeObject();
                var dataInput = {
                    "Destination": self.model.get("Destination"),
					"Location": self.model.get("Location"),
                    "ActivityType": dataObj.ActivityType,
                    "StartDate": dataObj.StartDate,
                    "EndDate": dataObj.EndDate,
                    "MinRating": dataObj.MinRating,
                    "MaxRating": dataObj.MaxRating,
                    "AgentId": self.getSelectedAgents("user","AgentId"),
                    "Currency": "USD",
                    "ProviderType": dataObj.ProviderType,
                    "QuoteOwners": [
                        {
                            "DelegatorFirstName": "System",
                            "DelegatorLastName": "Kensingtontours ",
                            "DelegateAgentId": self.getSelectedAgents("user","AgentId"),
                            "IsUser": true,
                            "Selected": true
                        }
                    ]
                };
				//Set to local cache
				Storage.prototype.setObject("searchCriteria",dataInput);
                $.ajax({
                    url: "../api/catalog/activity/availabilitycriteria",
                    type: "POST",
                    data: dataInput,
                    success: function(e) {
                        if (e != null)
                            window.location = "../activity/activityresults.html?CriteriaToken=" + e.CriteriaToken;
                    },
                    error: function(e, o, t) {
                        console.log(e + "\n" + o + "\n" + t);
                    }
                });
                return true;

            },
			getSelectedAgents: function (mainkey, subkey) {
                var name = mainkey + "=";
				var subCookie = subkey + "=";
				
				var firstString;
				var ca = document.cookie.split(';');
				for(var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						firstString =  c.substring(name.length, c.length);
						break;
					}
				}
				if(firstString){
					var cookieName = firstString.split('&');
					for(var k = 0; k < ca.length; k++){
						var split = cookieName[k];
						if(split.indexOf(subCookie) === 0){
							return split.substring(subCookie.length, split.length);
						}
					}
				}
				return "";
            },
			getQuotes: function(){
				 var template,
                    self = this;
					
                template = $("#tmpl-search-quotes").html();
				
				$.ajax({
                    url: "../api/quotes/search?archived=false&sort=updated&order=DESC&page=1&perpage=8&filternoclient=false&UserId=339&travelServiceTypeIdString=1,6,3,5,7,4,8&agents=" + this.getSelectedAgents("user","AgentId") + "&quoteIds=",
                    type: "GET",
                    success: function(e) {
                        if (e != null) {
                            var htm = Mustache.render(template, e);
                            self.$("#travel-service-quotes").html(htm);
                        }
                           
                    },
                    error: function (e, o, t) {
                        e.ActivityGroup = {};
                        e.ErrorCoccured = true;
                        e.errorDto = JSON.parse(e.responseText);
                        var errorDetails = { errorData: e };
                        var htm = Mustache.render(template, errorDetails);
                        self.$("#travel-service-quotes").html(htm);
                        console.log(e + "\n" + o + "\n" + t);
                    }
                });
			},
            // Backbone View events ...

            events: {
                "click #registerbtn": "doAvailabilitySearch"
            }

        });

        var appview = new AppView();
    });