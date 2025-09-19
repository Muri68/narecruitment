frappe.ready(function() {
	// bind events here
	let header = $(`
		{% include "templates/pages/header.html" %}
	`);

	let footer = $(`
		{% include "templates/pages/footer.html" %}
	`);
	let header_info = $(`
		{% include "templates/pages/header_info.html" %}
	`);

	$('#page-ssc-application-form').before(header);
	$('#page-ssc-application-form').after(footer);
	$('header').after(header_info);

	navigator.geolocation.getCurrentPosition(position)

	// State codes mapping
	const STATE_CODES = {
		'Abia': 'AB',
		'Adamawa': 'AD',
		'Akwa Ibom': 'AK',
		'Anambra': 'AN',
		'Bauchi': 'BA',
		'Bayelsa': 'BY',
		'Benue': 'BE',
		'Borno': 'BO',
		'Cross River': 'CR',
		'Delta': 'DE',
		'Ebonyi': 'EB',
		'Edo': 'ED',
		'Ekiti': 'EK',
		'Enugu': 'EN',
		'FCT': 'FC',
		'Gombe': 'GO',
		'Imo': 'IM',
		'Jigawa': 'JI',
		'Kaduna': 'KD',
		'Kano': 'KN',
		'Katsina': 'KT',
		'Kebbi': 'KE',
		'Kogi': 'KO',
		'Kwara': 'KW',
		'Lagos': 'LA',
		'Nasarawa': 'NA',
		'Niger': 'NI',
		'Ogun': 'OG',
		'Ondo': 'ON',
		'Osun': 'OS',
		'Oyo': 'OY',
		'Plateau': 'PL',
		'Rivers': 'RI',
		'Sokoto': 'SO',
		'Taraba': 'TA',
		'Yobe': 'YO',
		'Zamfara': 'ZA'
	};

	let currentPage = frappe.web_form;

	const hideEmptyNameFields = () => {
		const nameFields = ['surname', 'first_name', 'other_names'];
		
		nameFields.forEach(field => {
			let value = currentPage.get_value(field);
			if (!value) {
				currentPage.set_df_property(field, 'hidden', true);
			}
		});
	};
	hideEmptyNameFields();

	const DISCIPLINE_AGE_LIMITS = {
		'Medical Consultants': { min: 18, max: 40 },
		'default': { min: 18, max: 28 }
	};

	const calculateAge = (birthDate) => {
		const today = new Date();
		const birth = new Date(birthDate);
		const diffTime = Math.abs(today - birth);
		return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
	};

	currentPage.set_value('email', frappe.session.user);

	if(currentPage.current_section == 0 && currentPage.is_new == true) {
		// currentPage.fields_dict.declaration.df.reqd = 1;

		currentPage.$next_button.hide();

		let $validate_button = $(`
			<a class="btn btn-primary btn-sm">
				${__("Validate")}
			</a>
		`);

		currentPage.$next_button.after($validate_button);
		// NIN validation function
		$validate_button.on('click', function() {
			let nin = currentPage.get_value('applicant_nin');
			let date_of_birth = currentPage.get_value('date_of_birth');
			// let discipline = currentPage.get_value('discipline');

			if(!nin || !date_of_birth) {
                frappe.msgprint(__('Please enter NIN and Date of Birthto proceed'));
                return;
            }

			// Show loader
			// Add blur overlay
			let overlay = $(`
				<div class="blur-overlay"></div>
			`).appendTo('body');
			
			let loader = $(`
				<div class="nin-loader">
					<div class="spinner-border text-primary" role="status">
						<span class="sr-only">Validating...</span>
					</div>
					<div class="mt-2">Validating NIN...</div>
				</div>
			`).appendTo('body');
			

				$validate_button.addClass('disabled');
			// setTimeout(() => {
				frappe.call({
					method: 'recruitment.api.validate_nin',
					args: {
						nin: nin,
						date_of_birth: date_of_birth
					},
					callback: function(r) {

						// Remove loader
                        overlay.remove();
                        loader.remove();

						if(r.message) {
							var encrypted = r.message; //python is base64 ECB
							var key ='YtFrWaNi68320#5='//key used in Python
							key = CryptoJS.enc.Utf8.parse(key); 
							var decrypted =  CryptoJS.AES.decrypt(encrypted, key, {mode:CryptoJS.mode.ECB});

							let decrypted_nimc_data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
							console.log(decrypted_nimc_data);
							// Set values from NIMC response
							currentPage.set_value('surname', decrypted_nimc_data.surname);
							currentPage.set_value('first_name', decrypted_nimc_data.firstname);
							currentPage.set_value('other_names', decrypted_nimc_data.othername);
							currentPage.set_value('passport_image', decrypted_nimc_data.photo);

							currentPage.set_df_property('surname', 'hidden', false);
							currentPage.set_df_property('first_name', 'hidden', false);
							currentPage.set_df_property('other_names', 'hidden', false);

							currentPage.set_df_property('date_of_birth', 'read_only', true);
							currentPage.set_df_property('applicant_nin', 'read_only', true);

							let passport_url = decrypted_nimc_data.photo;
							$('.passport-preview').remove();

							if (passport_url) {
								// Create preview element
								let preview = $(`
									<div class="passport-preview mt-2">
										<img src="${passport_url}" 
											alt="Passport Preview" 
											style="max-width: 150px; max-height: 150px;">
									</div>
								`);
								
								// Append after passport field
								let field_container = $('[data-fieldname="passport_image"]');

								field_container.after(preview);
							}

							
							$validate_button.hide();
							currentPage.$next_button.show();
						} else {
							$validate_button.removeClass('disabled');
							frappe.msgprint(__('Invalid NIN or Date of Birth. Please check and try again.'));
						}
					}
				})
			// }, 2000);
		});
	}

	//On NIN
	currentPage.on('applicant_nin', () => {
		let nin = currentPage.get_value('applicant_nin');
		const validateNIN = (nin) => {
            // Check if input is numeric and exactly 11 characters
            return !isNaN(nin) && nin.toString().length === 11;
        };

		if(nin && !validateNIN(nin)) {
			frappe.msgprint(__('NIN must be exactly 11 numbers'));
			return;
		}
		
	})
	// currentPage.on('preffered_corps', () => {
	// 	let preferred_corps = currentPage.get_value('preffered_corps');
		
	// 	// Call server method to get discipline
	// 	frappe.call({
	// 		method: 'frappe.client.get',
	// 		args: {
	// 			doctype: 'DSSC Preferred Corps',
	// 			name: preferred_corps
	// 		},
	// 		callback: function(response) {
	// 			if(response.message) {
	// 				let disciplines = JSON.parse(response.message.discipline) 
    //                 currentPage.fields_dict.discipline.df.options = disciplines;
    //                 currentPage.fields_dict.discipline.refresh();
	// 			}
	// 		}
	// 	});
	// });
	
	//On Date of Birth
	currentPage.on('date_of_birth', () => {
		let date_of_birth = currentPage.get_value('date_of_birth');
		// let discipline = currentPage.get_value('discipline');

		// if (!discipline) {
		// 	frappe.msgprint(__('Please select Discipline first'));
		// 	currentPage.set_value('date_of_birth', '');
		// 	return;
		// }

		let age = calculateAge(date_of_birth);
		// let category = discipline.includes('Medical Consultants') ? 
        // 'Medical Consultants' : 'default';
		let ageLimits = DISCIPLINE_AGE_LIMITS['default'];
		
		if (age < ageLimits.min || age > ageLimits.max) {
			frappe.msgprint(__(`Age must be between ${ageLimits.min} and ${ageLimits.max} years`));
			currentPage.set_value('date_of_birth', '');
			return;
		}

		currentPage.set_value('age', age);
	})

	
	//On State
	currentPage.on('state', () => {
		currentPage.set_value('local_government', '');
		 // Add state change handler
		let state = currentPage.get_value('state');
		if (state) {
			let state = currentPage.get_value('state');
            let stateCode = STATE_CODES[state];
            currentPage.set_value('state_code', stateCode);

			frappe.call({
				method: 'recruitment.ms.web_form.dssc_application_form.dssc_application_form.get_local_government',
				args: {
					state: state
				},
				callback: function(r) {
					if(r.message) {
						currentPage.fields_dict.local_government.df.options = r.message.map(lg => lg.name);
                        currentPage.fields_dict.local_government.refresh();
					}
				}
			});
		}
	
	})

	//On validate
	currentPage.validate = () => {
		let declaration = currentPage.get_value('declaration');

		if(declaration == 0) {
			frappe.msgprint(__('Please accept declaration to proceed'));
			return false;
		}

		return true;
	}


})

function handleLogout() {
	window.location.href = '/api/method/logout';
	// After logout, redirect to home page
	setTimeout(() => {
		window.location.href = '/';
	}, 100);
  }