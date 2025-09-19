// Copyright (c) 2024, Nasirucode and contributors
// For license information, please see license.txt

frappe.ui.form.on("DSSC Application", {
	refresh: function(frm) {
        frm.set_query('local_government', function(doc) {
            return {
                filters: {
                    'state': doc.state
                }
            };
        });
        if(!frm.doc.email){frm.set_value('email', frappe.session.user)}
        frm.set_df_property("declaration", "reqd", 1);
    },

    before_save: function(frm) {
        frm.set_value('email', frappe.session.user);
    }
});
