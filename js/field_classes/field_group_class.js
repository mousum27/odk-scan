var FIELD_GROUP_COUNTER = 0;

/**
*	Initializes a new FieldGroup.
*/
function FieldGroup($grouped_fields, top_pos, left_pos) {
	this.$grouped_fields = $grouped_fields;
	// disable draggable/resizable features from group fields	
	this.disableDragResize(this.$grouped_fields);

	// create group container
	this.$group_div = $("<div/>");
	this.$group_div.data("obj", this);
	this.$group_div.addClass("field_group");	
	this.$group_div.addClass("highlighted_group");
	this.$group_div.append(this.$grouped_fields);
	
	// use the global counter to assign this group
	// a unique name
	this.$group_div.data("id", FIELD_GROUP_COUNTER);
	FIELD_GROUP_COUNTER += 1;
	
	$(".selected_page").append(this.$group_div);
	this.$group_div.draggable({containment: "parent", 
								grid: [GRID_X, GRID_Y]});
	
	this.addEventHandlers(this.$group_div);					
	this.adjustGroupSize();  // just commented it 					
    console.log(left_pos);
	// check if position parameters were passed in
	if (top_pos != null && left_pos != null) {
		this.$group_div.css("top", rem(top_pos));
		this.$group_div.css("left", rem(left_pos));
	}
}

/**
*	Adds event handlers to FieldGroup.
*/
FieldGroup.prototype.addEventHandlers = function($group_div) {
	$group_div.on('dragstop', function() {
		convert_position($(this));
	});	
								
	$group_div.mousedown(function() {
		$(".selected_field").removeClass("selected_field");
		$(this).addClass("selected_field");
		
		// unhighlight other groups
		$(".highlighted_group").addClass("unhighlighted_group");
		$(".highlighted_group").removeClass("highlighted_group");
		
		// hightlight this group
		$(this).removeClass("unhighlighted_group");
		$(this).addClass("highlighted_group");
		
		// set default view in properties sidebar
		ODKScan.FieldContainer.popObject();
		ODKScan.FieldContainer.pushObject(ODKScan.DefaultPropView);
	});
}

/**
*	Makes a copy of the FieldGroup.
*/
FieldGroup.prototype.copyField = function() {
	var $new_group = this.$group_div.clone();
	$(".selected_page").append($new_group);

	$new_group.draggable({containment: "parent", 
						grid: [GRID_X, GRID_Y]});					
	this.addEventHandlers($new_group);
	
	// copy each of the grouped fields into the new group,
	// set their position
	$new_group.children().remove();
	
	this.$group_div.children().each(function() {
		if ($(this).hasClass("img_div")) {
			var $img_div = $(this);
			var $img = $img_div.children("img");
			
			var image = {img_name: $img_div.data("img_name"),
						img_src: $img.attr('src'),
						img_height: $img_div.height(),
						img_width: $img_div.width(),
						orig_height: $img.data('orig_height'),
						orig_width: $img.data('orig_width'),
						img_top: $img.data('top'),
						img_left: $img.data('left'),
						div_top: rem(0),
						div_left: rem(0)};
			var $new_img_div = image_to_field(image);		
			
			// set position of new imaeg
			$new_group.append($new_img_div);
			$new_img_div.css("left", rem($(this).css("left")));
			$new_img_div.css("top", rem($(this).css("top")));
			
			// add reference to image
			var controller = window.ODKScan.__container__.lookup('controller:fields');
			controller.send("addImageRef", image.img_name);
		} else {
			var $curr_copy = $(this);
			$curr_copy.data("obj").copyField();			
			
			// set name of new field
			var $field_copy = $(".selected_field");
			//$field_copy.data("obj").name += "_copy";

			var name = $field_copy.data('obj').name;  // get the name of the field
			var copyNo; // tracking number of copy
			var index; // index to append the tracking number of copy
			if(name != undefined) { // if the name contains number
				var re = new RegExp("^.+?\\d$");
				if(re.test(name)) {
					if(name.match("_copy[0-9]+") != null) {  // if is a copy of copied one
						// getting the substring that matches the regex
						var copyNumbers = name.match("_copy[0-9]+");
						// getting the substring of actual copy number
						var copy = copyNumbers[0].match("[0-9]+");
						copyNo = parseInt(copy[0]);  // parse the number to int
						// getting the index to appending the number of copy
						index = name.indexOf(copyNumbers[0]) + 5;
					} else {   // if it is the first copy
					  var numbers = name.match("[0-9]+");
					  index = name.indexOf(numbers[0]);
					  copyNo = parseInt(numbers[0]);
					  if(copyNo > 1) {  // if it is not the first field
					    copyNo = 1;
					  }
					}
				} else { // if the user inputs any name without number
				  copyNo = 1;
				}
				
				if (name.indexOf("_copy") == -1) {  // if it is the first copy
				  $field_copy.data('obj').name += "_copy" + copyNo; // appending _copy to the name
				} else {
	              copyNo = copyNo + 1;  // incrementing the copy number
				  $field_copy.data('obj').name = name.substring(0, index) + copyNo; // + copy++;
				}
			}

			
			// set position of new field
			$new_group.append($field_copy);
			$field_copy.css("left", rem($curr_copy.css("left")));
			$field_copy.css("top", rem($curr_copy.css("top")));
		}
	});
	
	// disable draggable/resizable features from group fields
	this.disableDragResize($new_group.children());
	
	// copy the field object
	var $new_field = jQuery.extend({}, this);
	$new_group.data('obj', $new_field);
	$new_field.$group_div = $new_group;
	$new_field.$grouped_fields = $new_group.children();
	
	// unhighlight other groups
	$(".highlighted_group").addClass("unhighlighted_group");
	$(".highlighted_group").removeClass("highlighted_group");
	
	$(".selected_field").removeClass("selected_field");	
	$new_group.addClass("selected_field");
	$new_group.css({left: rem(0), top: rem(0)});
}

/**
*	Removes the selected field from the group.
*/
FieldGroup.prototype.removeSelected = function() {
	this.$grouped_fields = this.$grouped_fields.not($(".selected_field"));
}

/**
*	Disables draggable/resizable features from a
*	group of JQuery objects.	
*/
FieldGroup.prototype.disableDragResize = function($group) {
	$group.each(function() {
		if ($(this).hasClass("ui-draggable")) {
			$(this).draggable("destroy");		
		}
		if ($(this).hasClass("ui-resizable") 
			&& ($(this).hasClass("box") || $(this).hasClass("img_div"))) {
			$(this).resizable("destroy");
		}
	});
}

/**
*	Ungroups the fields.
*/
FieldGroup.prototype.ungroupFields = function() {
	var group_top = parseInt(this.$group_div.css('top'));
	var group_left = parseInt(this.$group_div.css('left'));			

	this.$grouped_fields.unwrap();		
	
	this.$grouped_fields.each(function() {
		var curr_top = parseInt($(this).css("top"));
		var curr_left = parseInt($(this).css("left"));
		$(this).css("top", rem(curr_top + group_top));
		$(this).css("left", rem(curr_left + group_left));
	});
	
	// restore draggable/resizable features
	this.$grouped_fields.each(function() {
		$(this).draggable({containment: 'parent', 
							grid: [GRID_X, GRID_Y]});
		if ($(this).hasClass("box") || $(this).hasClass("img_div")) {
			$(this).resizable({handles: 'all', 
							containment: 'parent', 
							grid: [GRID_X, GRID_Y],
							minWidth: GRID_X,
							minHeight: GRID_Y});
		}
	});	
	
	return this.$grouped_fields;
}

/**
*	Returns the fields in the group.
*/
FieldGroup.prototype.getFields = function() {	
	return this.$grouped_fields;
};

/**
*	Sets the group container to the appropriate size.
*/
FieldGroup.prototype.adjustGroupSize = function() {
	//get position bounds of the selected fields
	var min_top = FieldGroup.minTop(this.$grouped_fields);
	console.log("min_top: "+min_top);
	
	var min_left = FieldGroup.minLeft(this.$grouped_fields);
	console.log("min_left: "+min_left);

	var max_bottom = FieldGroup.maxBottom(this.$grouped_fields);
	console.log("max_bottom: "+max_bottom);

	var max_right = FieldGroup.maxRight(this.$grouped_fields);
	console.log("max_right: "+max_right);

	
	this.$group_div.css("width", rem(max_right - min_left));
	this.$group_div.css("height", rem(max_bottom - min_top));
	//this.$group_div.css("position", "relative");  // i have addded, I have commented
	
	// re-position all fields to align with the group
	// container at the top-left of the page
	this.$grouped_fields.each(function() {
		var curr_top = parseInt($(this).css("top"));
		console.log("curr_top: "+curr_top);
		var curr_left = parseInt($(this).css("left"));
		console.log("curr_left: "+curr_left);

		$(this).css("top", rem(curr_top - min_top));  // before, I have commented
		$(this).css("left", rem(curr_left - min_left));  // before, I have commented

        //$(this).css("top", rem(curr_top));  // I have added
		//$(this).css("left", rem(curr_left)); // i have added
		//$(this).css("position", "absolute"); //i have added

		console.log("modified_top: "+ $(this).css("top"));
		console.log("modified_left: "+$(this).css("left"));
	});
	
	this.$group_div.css({top: rem(min_top), left: rem(min_left)});

};

/**
*	Computes the minimum top value 
*	for the group of fields.
*/
FieldGroup.minTop = function($fields) {
	var values = $fields.map(function() { 
					return parseFloat($(this).css('top'))
				});
	return Math.min.apply(null, values.get());
};

/**
*	Computes the minimum left value 
*	for the group of fields.
*/
FieldGroup.minLeft = function($fields) {
	var values = $fields.map(function() { 
					return parseFloat($(this).css('left'))
				});
	return Math.min.apply(null, values.get());
};

/**
*	Computes the maximum bottom value 
*	for the group of fields.
*/
FieldGroup.maxBottom = function($fields) {
	var values = $fields.map(function() { 
					return parseFloat($(this).css('top'))
						+ parseFloat($(this).css('height'))
				});
	return Math.max.apply(null, values.get());
};

/**
*	Computes the maximum right value 
*	for the group of fields.
*/
FieldGroup.maxRight = function($fields) {
	var values = $fields.map(function(){ 
					return parseFloat($(this).css('left'))
						+ parseFloat($(this).css('width'))
				});				
	return Math.max.apply(null, values.get());
};
