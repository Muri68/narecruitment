// Copyright (c) 2020, Nigerian Army and contributors
// For license information, please see license.txt

frappe.ui.form.on('Recruit Hospital Admission', {
	refresh: function(frm) {
		if(frm.doc.docstatus && frm.doc.discharged != 'Yes'){
			frm.add_custom_button('Discharge Recruit', () => {
				let d = new frappe.ui.Dialog({
					title: 'Discharge Recruit',
					fields: [
						{
							label: 'Discharge Date',
							fieldname: 'date',
							fieldtype: 'Date'
						}
					],
					primary_action_label: 'Discharge',
					primary_action(values) {
						frappe.call({
							"method": "nadigmap.depot_na.doctype.recruit_hospital_admission.recruit_hospital_admission.discharge_recruit",
							"args": {
								"name": frm.doc.name,
								"discharge_date": values.date						
							},
							"freeze": 1,
							"freeze_message": "Discharging Recruit",
							callback: response => {
								if (response.message){
									frappe.show_alert({message: 'Recruit discharged', indicator: 'green'},5);
									frm.refresh()
									self.close()
								}else{
									frappe.show_alert({message: 'Failed', indicator:'red'},5);
								}
							}
						})
					}
				});
				
				d.show();
			})
		}
	}
});

/**
 	frappe.call({
		"method": "frappe.client.set_value",
		"args": {
			"doctype": "Sales Order Item",
			"name": res.message.sales_order_item,
			"fieldname": {
				"delivery_date": data.delivery_date								
			},
		}
	});
 */