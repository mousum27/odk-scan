/* Dialog menu initializations are provided below */
$(document).ready(function() {			
	$("#new_doc_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				console.log("making new document...");
				$(".selected_page").children().remove();
				$(".selected_page").removeClass();
				$(".selected_page").addClass($("#doc_size").val());
				ODKScan.FieldContainer.popObject();
				ODKScan.FieldContainer.pushObject(ODKScan.DefaultPropView);
			
				$("#new_doc_dialog").dialog("close");
			},
			"Cancel": function() {
				$("#new_doc_dialog").dialog("close");
			}
		}
	});			
	
	// NOTE: buttons are implemented in the elements controller in 
	// order to allow communication between the controller and dialog menu
	$("#new_page_dialog").dialog({
		autoOpen: false,
		modal: true
	});		

	// NOTE: buttons are implemented in the elements controller in 
	// order to allow communication between the controller and dialog menu
	$("#remove_page_dialog").dialog({
		autoOpen: false,
		modal: true
	});		
	
	// NOTE: buttons are implemented in the elements controller in 
	// order to allow communication between the controller and dialog menu
	$("#page_style_dialog").dialog({
		autoOpen: false,
		modal: true
	});	
	
	// NOTE: buttons are implemented in the elements controller in 
	// order to allow communication between the controller and dialog menu
	$("#itab_remove_dialog").dialog({
		autoOpen: false,
		modal: true
	});	
	
	$("#save_check_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Save": function() {
				$("#save_dialog").dialog("open");
				$("#save_check_dialog").dialog("close");
			},
			"Don't Save": function() {
				$("#new_doc_dialog").dialog("open");
				$("#save_check_dialog").dialog("close");
			},
			"Cancel": function() {						
				$("#save_check_dialog").dialog("close");
			}
		}
	});	
	
	$("#load_dialog").dialog({
		autoOpen: false,
		modal: true
	});
	
	$("#save_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				$("#scan_json_link").attr("download", $("#saved_scan_name").val());
				document.getElementById("scan_json_link").click();
				$("#save_dialog").dialog("close");
			},
			"Cancel": function() {
				$("#save_dialog").dialog("close");
			}
		}			
	});
				
	$("#export_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				$("#zip_link").attr("download", $("#zip_name").val());
				// trigger the file to be downloaded
				document.getElementById("zip_link").click();
				$("#export_dialog").dialog("close");
			},
			"Cancel": function() {
				$("#export_dialog").dialog("close");
			}
		}			
	});
	
	$("#box_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				if (is_name_unique()) {	
					var new_box = new EmptyBox();
					new_box.constructBox();
					
					ODKScan.EmptyBoxContainer.popObject();
					ODKScan.FieldContainer.popObject();
					ODKScan.FieldContainer.pushObject(ODKScan.EmptyBoxView);						
					$("#box_dialog").dialog("close");
				} else {
					alert($("#field_name").val() + " is a duplicate field name.");
				}
			},
			"Cancel": function() {
				ODKScan.EmptyBoxContainer.popObject();
				$("#box_dialog").dialog("close");
			}
		},
		close: function(event) {
			// check if the dialog menu was closed with the 'close' button
			if (event.originalEvent) {				
				ODKScan.EmptyBoxContainer.popObject();
			}
		}
	});
		
	$("#checkbox_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				console.log("making checkboxes...");		
				if (is_name_unique()) {				
					var cbField = new CheckboxField();
					cbField.constructGrid();							

					ODKScan.CheckboxContainer.popObject();
					ODKScan.FieldContainer.popObject();
					ODKScan.FieldContainer.pushObject(ODKScan.CheckboxView);	
					$("#checkbox_dialog").dialog("close");
				} else {
					alert($("#field_name").val() + " is a duplicate field name.");
				}
			},
			"Cancel": function() {
				ODKScan.CheckboxContainer.popObject();
				$("#checkbox_dialog").dialog("close");
			}
		},
		close: function(event) {
			// check if the dialog menu was closed with the 'close' button
			if (event.originalEvent) {				
				ODKScan.CheckboxContainer.popObject();
			}
		}
	});			
	
	$("#bubble_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				if (is_name_unique()) {		
					var bubbField = new BubbleField();
					bubbField.constructGrid();		

					ODKScan.BubbleContainer.popObject();
					ODKScan.FieldContainer.popObject();
					ODKScan.FieldContainer.pushObject(ODKScan.BubblesView);										
					$("#bubble_dialog").dialog("close");
				} else {
					alert($("#field_name").val() + " is a duplicate field name.");
				}
			},
			"Cancel": function() {
				ODKScan.BubbleContainer.popObject();
				$("#bubble_dialog").dialog("close");
			}
		},
		close: function(event) {
			// check if the dialog menu was closed with the 'close' button
			if (event.originalEvent) {				
				ODKScan.BubbleContainer.popObject();
			}
		}
	});

	$("#seg_num_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				if (is_name_unique()) {	
					var numField = new SegNumField();
					numField.constructGrid();
					
					ODKScan.SegNumContainer.popObject();
					ODKScan.FieldContainer.popObject();
					ODKScan.FieldContainer.pushObject(ODKScan.SegNumView);									
					$("#seg_num_dialog").dialog("close");
				} else {
					alert($("#field_name").val() + " is a duplicate field name.");
				}
			},
			"Cancel": function() {
				ODKScan.SegNumContainer.popObject();
				$("#seg_num_dialog").dialog("close");
			},
		}, 
		close: function(event) {
			// check if the dialog menu was closed with the 'close' button
			if (event.originalEvent) {				
				ODKScan.SegNumContainer.popObject();
			}
		}
	});		

	$("#text_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {
				if (is_name_unique()) {		
					var text_box = new TextBox();
					text_box.constructBox();
					
					ODKScan.TextBoxContainer.popObject();
					ODKScan.FieldContainer.popObject();
					ODKScan.FieldContainer.pushObject(ODKScan.TextBoxView);					
					$("#text_dialog").dialog("close");
				} else {
					alert($("#field_name").val() + " is a duplicate field name.");
				}
			},
			"Cancel": function() {
				ODKScan.TextBoxContainer.popObject();
				$("#text_dialog").dialog("close");
			}
		},
		close: function(event) {
			// check if the dialog menu was closed with the 'close' button
			if (event.originalEvent) {				
				ODKScan.TextBoxContainer.popObject();
			}
		}
	});			
	
	$("#form_num_dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Ok": function() {	
				if (is_name_unique()) {
					var formNumField = new FormNumField();
					formNumField.constructGrid();		
					
					ODKScan.FormNumContainer.popObject();
					ODKScan.FieldContainer.popObject();
					ODKScan.FieldContainer.pushObject(ODKScan.FormNumView);						
					$("#form_num_dialog").dialog("close");
				} else {
					alert($("#field_name").val() + " is a duplicate field name.");
				}
			},
			"Cancel": function() {
				ODKScan.FormNumContainer.popObject();
				$("#form_num_dialog").dialog("close");
			}
		},
		close: function(event) {
			// check if the dialog menu was closed with the 'close' button
			if (event.originalEvent) {	
				ODKScan.FormNumContainer.popObject();
			}
		}
	});			
});