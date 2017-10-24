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
                this.findAddress();
				this.getQuotes();
            },

            initInputForm: function() {
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
            },

            findAddress: function() {
                var map = {};
                $('[id*=destination]')
                    .typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 3,
                        source: function(request, response) {
                            var items = [];
                            var data = $.grep(airports,
                                function(airport) {
                                    airport = airport.properties;
                                    if (request.length === 3)
                                        return airport.IATACode.toLowerCase() === request.toLowerCase() ||
                                            airport.IATACityCode.toLowerCase() === request.toLowerCase() ||
                                            airport.MACCode.toLowerCase() === request.toLowerCase();
                                    else {
                                        var spaceterm = request;
                                        return airport.Name.toLowerCase().startsWith(spaceterm) ||
                                            airport.Name.toLowerCase().indexOf(spaceterm.toLowerCase()) !== -1 ||
                                            airport.IATACode.toLowerCase().startsWith(spaceterm) ||
                                            airport.IATACityCode.toLowerCase().startsWith(spaceterm) ||
                                            airport.MACCode.toLowerCase().startsWith(spaceterm);
                                    }
                                });
                            $.each(data,
                                function(i, item) {
                                    item = item.properties;
                                    var id = item.IATACode;
                                    var name = id + " - " + item.Name;
                                    map[name] = { id: id, name: id + " " + name, lat: item.Latititude, lon: item.Longitude };
                                    items.push(name);
                                });
                            response(items);
                            $(".dropdown-menu").css("height", "auto");
                        },
                        updater: function(item) {
                            $('[id*=IATACode]').val(map[item].id);
                            $('[id*=Latitude]').val(map[item].lat);
                            $('[id*=Longitude]').val(map[item].lon);
                            return item;
                        }
                    });
            },

            doAvailabilitySearch: function(e) {
                var template,
                    dataObj,
                    self = this;
                dataObj = this.$('#RegMetadata').serializeObject();
                var dataInput = {
                    "Destination":
                    {
                        "IATACode": dataObj.IATACode,
                        "DestinationType": "1",
                        "Description": $("#destination").val(),
                        "Latitude": dataObj.Latitude,
                        "Longitude": dataObj.Longitude
                    },
                    "ActivityType": dataObj.ActivityType,
                    "StartDate": dataObj.StartDate,
                    "EndDate": dataObj.EndDate,
                    "MinRating": dataObj.MinRating,
                    "MaxRating": dataObj.MaxRating,
                    "AgentId": 1347,
                    "Currency": "USD",
                    "ProviderType": "1",
                    "QuoteOwners": [
                        {
                            "DelegatorFirstName": "System",
                            "DelegatorLastName": "Kensingtontours ",
                            "DelegateAgentId": 1347,
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