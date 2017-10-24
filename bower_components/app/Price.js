var targetContainer = $(".historical-wrapper"),
  
    template = $("#tmpl-activity-price-description").html();
	  
	  	var ActivityPrice = { "Price" : [ 
	  	  { "ActivityName" : "ActivityName",
	        "OptionName" : "hjsgjhs",
	        "Price" : 1234
	      },
	       { "ActivityName" : "skmjhbksj",
	        "OptionName" : "hjsgjhs",
	        "Price" : 1234
	      }
	    ] };


		var html = Mustache.to_html(template, ActivityPrice);

		$(targetContainer).html(html);


		