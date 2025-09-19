$(document).ready(function() { 
    
    if (frappe.user.has_role('SRO') && !frappe.user.has_role('System Manager')) {
        frappe.router.on('change', () => {
            if (frappe.router.current_route[0] === 'Workspaces') {
                setTimeout(() => {
                    $('.layout-side-section').hide();
                    $('.sidebar-toggle-btn').hide();
                }, 100);
            }
        });
    
         // Hide sidebar on workspace load 
         frappe.after_ajax(() => { 
            $('.layout-side-section').hide(); 
            $('.sidebar-toggle-btn').hide();
        }); 
    }
});