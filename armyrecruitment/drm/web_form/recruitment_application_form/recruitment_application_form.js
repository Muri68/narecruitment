frappe.ready(function() {
	frappe.web_form.after_load = () => {
		// setTimeout(rearrangeButtons, 500);
		const editMode = frappe.web_form.is_edit_mode;
		
		frappe.web_form.fields.forEach(field => {
		  if (field.df.fieldtype === 'Attach') {
			field.refresh();
			field.$wrapper.toggleClass('edit-mode', !editMode);
		  }
		});
		
	  };
	let header = $(`
		{% include "templates/pages/header.html" %}
	`);

	let footer = $(`
		{% include "templates/pages/footer.html" %}
	`);
	let header_info = $(`
		{% include "templates/pages/header_info.html" %}
	`);
	

	$('#page-recruitment-application-form').before(header);
	$('#page-recruitment-application-form').after(footer);
	$('header').after(header_info);
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

	if (!currentPage.is_new) {
		const passportData = currentPage.get_value('passport_photograph_data');
		
		if (passportData) {
			// Set the HTML image with the base64 data
			const imgHtml = `<img src="data:image/jpeg;base64,${passportData}" />`;
			currentPage.set_df_property('passport_photograph', 'options', imgHtml);
			
			// Hide the passport_photograph_data field
			currentPage.set_df_property('passport_photograph_data', 'hidden', 1);
		}
	}

	// Age limits by trade category
	const TRADE_AGE_LIMITS = {
		'Trades': { min: 18, max: 26 },
		'Non-Trades': { min: 18, max: 22 }
	};

	const calculateAge = (birthDate) => {
		const today = new Date();
		const birth = new Date(birthDate);
		const diffTime = Math.abs(today - birth);
		return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
	};

	currentPage.set_value('email_address', frappe.session.user);

	frappe.call({
		method: 'frappe.client.get',
		args: {
			doctype: 'User',
			name: frappe.session.user
		},
		callback: function(r) {
			if (r.message) {
				let user = r.message;
				currentPage.set_value('state', user.state);
				currentPage.set_df_property("state", "read_only", 1);

				currentPage.set_value('mobile_number', user.mobile_no);
				currentPage.set_df_property("mobile_number", "read_only", 1);

			}
		}
	});

	let $newsave_button = $(`
		<a class="btn new-save-btn btn-primary btn-sm" style="margin:0px 10px;">
			${__("Save & Continue")}
		</a>
	`);
	$('.discard-btn').hide()
	$('.submit-btn').hide()

	currentPage.$next_button.after($newsave_button);
	
	$newsave_button.on('click', function() {
		currentPage.save();
	});
	
	const readOnlyFields = !currentPage.is_new && {
		'applicant_nin': true,
		'date_of_birth': true,
		'trades_category': true,
		'passport_photograph': true,
		'age': true,
		
	};
	
	
	Object.entries(readOnlyFields || {}).forEach(([field]) => {
		currentPage.set_df_property(field, 'read_only', true);
	});
	
	
	
	
	const statusActions = {
		'Submitted': () => {
			$('.edit-button, .new-save-btn, .submit-btn, .discard-btn').hide();
			currentPage.allow_edit = false;
			$('.print-btn').show();
		},
		'Pending': () => {
			$('.edit-button').show();
			$('.print-btn').hide();
		}
	}[currentPage.doc.recruitment_status];
	
	statusActions?.();
	
	(!currentPage.in_edit_mode && currentPage.doc.recruitment_status !== 'Submitted') && (
		$newsave_button.hide(),
		currentPage.$next_button.before($('.edit-button'))
	);
	
	const setupValidation = (currentPage) => {
		if (!(currentPage.current_section === 0 && currentPage.is_new)) return;
	
		$('.submit-btn, .new-save-btn').hide();
		currentPage.$next_button.hide();
	
		let $validate_button = $(`
			<a class="btn btn-primary btn-sm">
				${__("Validate")}
			</a>
		`);

	
		currentPage.$next_button.after($validate_button);
	
		const showLoader = () => {
			const overlay = $(`<div class="blur-overlay"></div>`).appendTo('body');
			const loader = $(`
				<div class="nin-loader">
					<div class="spinner-border text-primary" role="status">
						<span class="sr-only">Validating...</span>
					</div>
					<div class="mt-2">Validating NIN...</div>
				</div>
			`).appendTo('body');
			return { overlay, loader };
		};
	
		const handleNIMCResponse = (decrypted_nimc_data, currentPage, date_of_birth, $validate_button) => {
			// console.log(decrypted_nimc_data);
			if (String(decrypted_nimc_data).includes("Error")) {
				$validate_button.removeClass('disabled');
				frappe.msgprint(__('NIN Invalidated. Please try again later...'));
				return false;
			}else if (String(decrypted_nimc_data.returnMessage).includes("units")) {
				$validate_button.removeClass('disabled');
				frappe.msgprint(__('NIN Invalidated. Please try again later...'));
				return false;
			}
			else if(decrypted_nimc_data.returnMessage === "norecord"){
				$validate_button.removeClass('disabled');
				frappe.msgprint(__('NIN Invalidated. Please try again later...'));
				return false;
			}
			const formatDate = (dateString) => {
				return moment(dateString).format('DD-MM-YYYY');
			};


			const nimc_dob = decrypted_nimc_data.data['birthdate'];
	
			if (nimc_dob !== formatDate(date_of_birth)) {
				$validate_button.removeClass('disabled');
				frappe.msgprint(__('Date of Birth does not match. Please check and try again.'));
				return false;
			}
	
			const fields = {
				'surname': decrypted_nimc_data.data['surname'],
				'first_name': decrypted_nimc_data.data['firstname'],
				'other_names': decrypted_nimc_data.data['middlename'],
				'passport_photograph': decrypted_nimc_data.data['photo'],
				'passport_photograph_data': decrypted_nimc_data.data['photo']
			};
	
			Object.entries(fields).forEach(([field, value]) => {
				if (field === 'passport_photograph') {
					currentPage.set_df_property(field, 'options', `<img src="data:image/jpeg;base64,${value}" />`);
				}
				else {
					currentPage.set_value(field, value);
				}
				currentPage.set_df_property(field, 'hidden', false);
				if (field === 'passport_photograph_data') {
					currentPage.set_df_property(field, 'hidden', true);				}
			});
	
			['date_of_birth', 'applicant_nin', 'trades_category', 'passport_photograph'].forEach(field => {
				currentPage.set_df_property(field, 'read_only', true);
			});
	
			$validate_button.hide();
			$('.new-save-btn').show();
			currentPage.$next_button.show();
			return true;
		};
	
		$validate_button.on('click', function() {
			currentPage.current_section = 1;
			const nin = currentPage.get_value('applicant_nin');
			const date_of_birth = currentPage.get_value('date_of_birth');
			const trades_category = currentPage.get_value('trades_category');
	
			if (!nin || !date_of_birth || !trades_category) {
				frappe.msgprint(__('Please enter NIN, Date of Birth and Trades Category to proceed'));
				return;
			}
			const validateNIN = (nin) => {
				// Check if input is numeric and exactly 11 characters
				return !isNaN(nin) && nin.toString().length === 11;
			};
	
			if(nin && !validateNIN(nin)) {
				frappe.msgprint(__('NIN must be exactly 11 numbers'));
				return;
			}
	
			const { overlay, loader } = showLoader();
			$validate_button.addClass('disabled');
	
			frappe.call({
				method: 'armyrecruitment.api.validate_nin',
				args: { nin, date_of_birth },
				callback: function(r) {
					overlay.remove();
					loader.remove();
	
					if (!r.exc) {
						const [encrypted, key, iv] = [r.message[0], r.message[1], r.message[2]];
						const parsedKey = CryptoJS.enc.Utf8.parse(key);
						const parsedIv = CryptoJS.enc.Utf8.parse(iv);
						
						const decrypted = CryptoJS.AES.decrypt(encrypted, parsedKey, {
							iv: parsedIv,
							mode: CryptoJS.mode.CBC,
							padding: CryptoJS.pad.Pkcs7
						});
	
						const decrypted_nimc_data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
						handleNIMCResponse(decrypted_nimc_data, currentPage, date_of_birth, $validate_button);
					} else {
						$validate_button.removeClass('disabled');
						frappe.msgprint(__('Unable to validate nin, please retry...'));
					}
				}
			});
		});
	};

	setupValidation(currentPage);

	//On NIN
	currentPage.on('applicant_nin', () => {
		let nin = currentPage.get_value('applicant_nin');
		

		// Check if NIN exists
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Recruitment Application',
				filters: {
					'applicant_nin': nin
				},
				fields: ['name']
			},
			callback: function(r) {
				if(r.message && r.message.length > 0) {
					currentPage.set_value('applicant_nin', '');
					// frappe.log_error('Your error message here', 'Title for Error');
					frappe.log_error(title = "NIN Already Exists", message = `User with existing NIN ${nin} tries to fill another form`);
					let d = new frappe.ui.Dialog({
						title: __('NIN Already Exists'),
						fields: [
							{
								fieldname: 'message',
								fieldtype: 'HTML',
								options: __('NIN already exists in recruitment application. Do you want to reset your password?')
							}
						],
						primary_action_label: __('Reset Password'),
						primary_action: function() {
							handleLogout();
							setTimeout(() => {
								window.location.href = '/login#forgot';
							}, 200);
							d.hide();
						}
					});
					d.show();
				}
			}
		});
		
	})

	//On Date of Birth
	currentPage.on('date_of_birth', () => {
		const date_of_birth = currentPage.get_value('date_of_birth');
		const trades_category = currentPage.get_value('trades_category');
		const ageLimits = TRADE_AGE_LIMITS[trades_category];
	
		const validateTradeCategory = () => {
			trades_category || (
				frappe.msgprint(__('Please select Trades Category first')),
				currentPage.set_value('date_of_birth', '')
			);
			return !!trades_category;
		};
	
		const validateAge = (age) => {
			const isValidAge = age >= ageLimits.min && age <= ageLimits.max;
			!isValidAge && (
				frappe.msgprint(__(`For ${trades_category}, age must be between ${ageLimits.min} and ${ageLimits.max} years`)),
				currentPage.set_value('date_of_birth', '')
			);
			return isValidAge;
		};
	
		validateTradeCategory() && 
		validateAge(calculateAge(date_of_birth)) && 
		currentPage.set_value('age', calculateAge(date_of_birth));
	});

	// On trades category
	currentPage.on('trades_category', () => {
		let date_of_birth = currentPage.get_value('date_of_birth');
		let trades_category = currentPage.get_value('trades_category');

		if (date_of_birth) {
			let age = calculateAge(date_of_birth);
			let ageLimits = TRADE_AGE_LIMITS[trades_category];
		
			if (age < ageLimits.min || age > ageLimits.max) {
				frappe.msgprint(__(`For ${trades_category}, age must be between ${ageLimits.min} and ${ageLimits.max} years`));
				currentPage.set_value('date_of_birth', '');
				return
			}
			currentPage.set_value('age', age);
		}

		
	})

	//on declaration
	currentPage.on('declaration', () => {
		let declaration = currentPage.get_value('declaration');
		if (declaration == 1){
			$('.submit-btn').show()
		}else{
			$('.submit-btn').hide()
		}

	})

	//On State
	const state = currentPage.get_value('state')
	frappe.call({
		method: 'armyrecruitment.drm.web_form.recruitment_application_form.recruitment_application_form.get_local_government',
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
	currentPage.on('state', () => {
		currentPage.set_value('local_government', '');
		 // Add state change handler
		let state = currentPage.get_value('state');
		if (state) {
			let state = currentPage.get_value('state');
            let stateCode = STATE_CODES[state];
            currentPage.set_value('state_code', stateCode);
			

			frappe.call({
				method: 'armyrecruitment.drm.web_form.recruitment_application_form.recruitment_application_form.get_local_government',
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


	$('.submit-btn').on('click', async function() {
		const declaration = currentPage.get_value('declaration');

		const fields = currentPage.fields;
		const missing = [];
		fields.forEach(field => {
			if (field.reqd == 1 && !currentPage.get_value(field.fieldname)) {
				missing.push(field.label || field.fieldname);
			}
		});

		
		if (missing.length) {
			const dialog = frappe.msgprint({
				message: __('Please fill in the following mandatory fields: ' + missing.join(', '))
			});
			
			dialog.onhide = function() {
				window.location.reload();
			};
			currentPage.validate = false;
			return false;
		}else if (!declaration) {
			const dialog = frappe.msgprint({
				message: __('Please accept declaration to proceed')
			});
			
			dialog.onhide = function() {
				window.location.reload();
			};
			currentPage.validate = false;
			return false;
		}
		
		const updateRecruitmentStatus = async () => {
			const result = await frappe.call({
				method: 'frappe.client.set_value',
				args: {
					doctype: frappe.web_form.doc.doctype,
					name: frappe.web_form.doc.name,
					fieldname: 'recruitment_status',
					value: 'Submitted'
				}
			});
	
			if (result.message) {
				currentPage.success_message = 'Recruitment Application Submitted Successfully.';
				currentPage.allow_edit = false;
				currentPage.save();
			}
		};
		setTimeout(updateRecruitmentStatus, 500);
		return true;
	});

})

function handleLogout() {
	window.location.href = '/api/method/logout';
	// After logout, redirect to home page
	setTimeout(() => {
		window.location.href = '/';
	}, 100);
  }

// Rearrange buttons
function rearrangeButtons() {
	// Create container divs for left and right button groups
	let $leftButtonGroup = $('<div class="button-group-left" style="float: left;"></div>');
	let $rightButtonGroup = $('<div class="button-group-right" style="float: right;"></div>');
	
	// Get references to all buttons
	let $prevButton = $('.prev-btn');
	let $nextButton = currentPage.$next_button;
	let $saveButton = $('.new-save-btn');
	let $discardButton = $('.discard-btn');
	let $submitButton = $('.submit-btn');
	
	// Move the buttons to their respective containers
	$leftButtonGroup.append($prevButton);
	$leftButtonGroup.append($nextButton);
	
	$rightButtonGroup.append($saveButton);
	$rightButtonGroup.append($discardButton);
	$rightButtonGroup.append($submitButton);
	
	// Clear existing buttons from the form
	$('.web-form-actions').empty();
	
	// Add the new button groups to the form
	$('.web-form-actions').append($leftButtonGroup);
	$('.web-form-actions').append($rightButtonGroup);
	
	// Add clearfix to prevent layout issues
	$('.web-form-actions').append('<div style="clear: both;"></div>');
  }
