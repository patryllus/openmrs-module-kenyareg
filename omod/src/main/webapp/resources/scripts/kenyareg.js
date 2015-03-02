jq(function () {

	jq('#surname').val("Okoth");
	jq('#firstName').val("Nicodemus");


	var requestResult = null;

	kenyaui.setupAjaxPost('basic-search-form', {
		onSuccess: function (data) {
			requestResult = data;
			if (!data.lpiResult.successful && !data.mpiResult.successful) {
				jq('#status').html("Neither the LPI nor the MPI could be contacted. Retry?");
			} else {
				if (!data.lpiResult.successful && data.mpiResult.successful) {
					jq('#status').html("The LPI could not be contacted. Retry?");
				} else if (data.lpiResult.successful && !data.mpiResult.successful) {
					jq('#status').html("The MPI could not be contacted. Retry?");
				} else {
					jq('#status').html("Both the LPI and the MPI were contacted. render results.");
					showResults();
					showDetails(0)
				}
			}
		}
	});

	jq('#results-table tbody').on('click', 'tr', function (e) {
		showDetails(this.rowIndex - 1);
	});

	function showResults() {
		var list = requestResult.lpiResult;
		jq('#results-table > tbody').html("");
		if (list.data.length == 0) {
			showEmpty();
		} else {
			for (var i = 0; i < list.data.length; i++) {
				showPerson(i);
			}
		}
	}

	function showEmpty() {
		jq('#results-table').append('<tr>' +
		'<td colspan="6">Nothing to show</td>' +
		'</tr>');
	}

	function showPerson(i) {
		var person = requestResult.lpiResult.data[i];
		jq('#results-table').append('<tr>' +
		'<td>' + replaceNull(person.matchScore) + '</td>' +
		'<td>' + replaceNull(person.firstName) + '</td>' +
		'<td>' + replaceNull(person.middleName) + '</td>' +
		'<td>' + replaceNull(person.lastName) + '</td>' +
		'<td>' + replaceNull(person.sex) + '</td>' +
		'<td>' + replaceNull(formatDate(person.birthdate)) + '</td>' +
		'</tr>');
	}

	function replaceNull(value) {
		return value ? value : "";
	}

	function showDetails(i) {
		var person = requestResult.lpiResult.data[i];
		showMatchScore(person)
		showIdentifierDetails(person);
		showBasicDetails(person);
		showStatusDetails(person);
		showParentDetails(person);
	}

	function showMatchScore(person) {
		jq('#score').html(replaceNull(person.matchScore));
	}

	function showIdentifierDetails(person) {
		jq('#id-table > tbody').html("");
		var personIdList = person.personIdentifierList;
		if (personIdList) {
			for (var j = 0; j < personIdList.length; j++) {
				var personId = personIdList[j];
				jq('#id-table').append('<tr>' +
				'<td class="field-label">' + replaceNull(formatIdentifierType(personId.identifierType)) + '</td>' +
				'<td>' + replaceNull(personId.identifier) + '</td>' +
				'</tr>');
			}
		} else {
			jq('#id-table').append('<tr><td></td></tr>');
		}
	}

	function showBasicDetails(person) {
		jq('#first-name').html(replaceNull(person.firstName));
		jq('#middle-name').html(replaceNull(person.middleName));
		jq('#last-name').html(replaceNull(person.lastName));
		jq('#birth-date').html(replaceNull(formatDate(person.birthdate)));
		jq('#sex').html(replaceNull(person.sex));
	}

	function showStatusDetails(person) {
		jq('#alive-status').html(replaceNull(person.aliveStatus));
		jq('#marital-status').html(replaceNull(formatMaritalStatus(person.maritalStatus)));
		jq('#last-visit-date').html(replaceNull(person.lastRegularVisit));
	}

	function showParentDetails(person) {
		jq('#father-first-name').html(replaceNull(person.fathersFirstName));
		jq('#father-middle-name').html(replaceNull(person.fathersMiddleName));
		jq('#father-last-name').html(replaceNull(person.fathersLastName));
		jq('#mother-first-name').html(replaceNull(person.mothersFirstName));
		jq('#mother-middle-name').html(replaceNull(person.mothersMiddleName));
		jq('#mother-last-name').html(replaceNull(person.mothersLastName));
	}

	function formatMaritalStatus(status) {
		var formatted = '';
		if (status) {
			switch (status) {
				case 'single':
					formatted = 'Single';
					break;
				case 'marriedPolygamous':
					formatted = 'Married Polygamous';
					break;
				case 'marriedMonogamous':
					formatted = 'Married Monogamous';
					break;
				case 'divorced':
					formatted = 'Divorced';
					break;
				case 'widowed':
					formatted = 'Widowed';
					break;
				case 'cohabitating':
					formatted = 'Cohabitating';
					break;
				default:
					formatted = '';
			}
		}
		return formatted;
	}

	function formatIdentifierType(type) {
		var formatted = '';
		if (type) {
			switch (type) {
				case 'patientRegistryId':
					formatted = 'Patient Registry ID';
					break;
				case 'masterPatientRegistryId':
					formatted = 'Master Patient Registry ID';
					break;
				case 'cccUniqueId':
					formatted = 'CCC Unique ID';
					break;
				case 'cccLocalId':
					formatted = 'CCC Local ID';
					break;
				case 'kisumuHdssId':
					formatted = 'Kisumu HDSS ID';
					break;
				default:
					formatted = '';
			}
		}
		return formatted;
	}

	function formatDate(date) {
		var formatted = '';
		var format = 'dd-MM-yyyy';
		if (date) {
			formatted = new Date(date).toDateString();
		}
		return formatted;
	}
});