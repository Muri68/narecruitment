frappe.ui.form.ControlAttach = frappe.ui.form.ControlAttach.extend({
    set_input: function(value) {
        if (!this.in_edit_mode) {
            return;
        }
        
        if (this.$input) {
            this.$input.toggle(value ? true : false);
        }
    }
});