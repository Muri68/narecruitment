// Copyright (c) 2020, Nigerian Army and contributors
// For license information, please see license.txt

frappe.ui.form.on('Recruit Evaluation', {
	// refresh: function(frm) {

	// }
	points_earned: function(frm){
		var pass_mark
		frappe.db.get_value('Recruit Evaluation Type', frm.doc.evaluation_type, 'pass_mark')
			.then(r => {
				pass_mark = r.message.pass_mark
				console.log(pass_mark)
				if(frm.doc.points_earned >= pass_mark){
					frm.set_value('remarks', 'Pass')
				}else{
					frm.set_value('remarks', 'Fail')
				}
			})
	}
});
