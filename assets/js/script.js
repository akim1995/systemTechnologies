let filteredData = [];
// console.log(filteredData);
filteredData.push(
	{date: data[0].date.substring(0,10), rows: [data[0]],
		amountForDate: data[0].quantity * data[0].price,
		docs: [
			{
				docType: data[0].docType,
				id: data[0].id,
				amount: data[0].price * data[0].quantity,
				products: [
					{
						name: data[0].name,
						image: data[0].image,
						quantity: data[0].quantity,
						price: data[0].price
					}
				]
				
			}
		]
	});
data.shift();

data.forEach((row) => {
	filteredData.forEach((day, index) => {
		if (day.date == row.date.substring(0,10)) {
			day.rows.push(row);
			day.amountForDate += row.price * row.quantity;
			day.docs.forEach((doc, docIndex) => {
				if(doc.id === row.id) {
					doc.amount += row.price * row.quantity;
					doc.products.push({
						name: row.name,
						image: row.image,
						quantity: row.quantity,
						price: row.price
					});
				}
				// if there is no such document
				else if(docIndex === day.docs.length -1) {

					day.docs.push({
						docType: row.docType,
						id: row.id,
						amount: row.price * row.quantity,
						products: [{
							name: row.name,
							image: row.image,
							quantity: row.quantity,
							price: row.price
						}]
					})
				}
			});


		}
		// next day
		else if (index === filteredData.length -1 ) {
			filteredData.push({date: row.date.substring(0,10), rows: [row],
				amountForDate: row.price * row.quantity,
				docs: [
				{
					docType: row.docType,
					id: row.id,
					amount: row.price * row.quantity,
					products: [{
						name: row.name,
						image: row.image,
						quantity: row.quantity,
						price: row.price
					}]
				}
			]});
		}
	});
});


// function formatByDoc(row, index) {
// 	result = {
		
// 	};
// };

Handlebars.registerHelper("formatDate", function(date) {
	let result = '';
	let dateObj = new Date(date);
	let month = getRusMonth(dateObj);
	result += dateObj.getDate();
	result += ' ' + month;

	function getRusMonth(dateObj) {
			let rusMonths = [
				'Января',
				'Февраля',
				'Марта',
				'Апреля',
				'Мая',
				'Июня',
				'Июля',
				'Августа',
				'Сентября',
				'Октября',
				'Ноября',
				'Декабря',
				'Января',
				'Февраля',
				'Марта'
			];
		return rusMonths[dateObj.getMonth()];
	}
	return result;
});


Handlebars.registerHelper("currencyFormatRu", function(number) {
	function toFixedIfFloat(number, fixedDigits) {
		let result;
		if (number % 1 !== 0) {
			result = number.toFixed(fixedDigits);
		} else {
			result = number;
		}
		return String(result);
	}
	return (
	    toFixedIfFloat(number, 2)
	      .replace('.', ',')
	      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ₽'
	  )
});

Handlebars.registerHelper("MultiplyTwoNumbers", function(a, b) {
	return a * b;
});

Handlebars.registerHelper("getImageDiv", function(pic) {
    if(pic) {
			return new Handlebars.SafeString(
				`<div class="products-list__img" style="background-image:url('${pic}')"></div>`
			  );
		} else {
			return new Handlebars.SafeString(
				'<div class="products-list__img products-list__img--no-pic" style="background-image:url(\'assets/img/no_image.png\')"></div>'
			);
		}

});


let appTemplate = document.getElementById('appTemplate').innerHTML;

let compiledTemplate = Handlebars.compile(appTemplate);
document.querySelector('#app').innerHTML = compiledTemplate({data:filteredData});


// UI JavaScript

// SETING COLLAPSING FOR DIFFERENT DATES
let dayHeaders = document.querySelectorAll('.docs-head');
dayHeaders.forEach((el) => {
	let docContents = el.nextElementSibling;
	if(!el.parentElement.classList.contains('collapsed')) {
		collapseDay();
	}
	el.addEventListener('click', function(e){
			this.parentElement.classList.toggle('collapsed');
			collapseDay();
	});
	function collapseDay() {
		if(docContents.style.maxHeight) {
			docContents.style.maxHeight = null;
		} else {
			docContents.style.maxHeight = docContents.scrollHeight + 'px';
		}
	}

});





// Setting collapsing for different docs
// you can add an upgrade like in the example before so docs can be 
// without collapsed class on startup
let documentHeaders = document.querySelectorAll('.document-header');
documentHeaders.forEach(el => {
	let dayListParent = el.parentElement.parentElement;
	let docContents = el.nextElementSibling;
	el.addEventListener('click', function() {
		el.classList.toggle('collapsed');
		el.firstElementChild.classList.toggle('arrow--up');
		if(docContents.style.maxHeight) {
			let computedHeight = Number(dayListParent.style.maxHeight.replace('px', ''))
			- docContents.scrollHeight + 'px';
			//upadting day-list max height
			dayListParent.style.maxHeight = computedHeight;
			docContents.style.maxHeight = null;
		} else {
			let computedHeight = Number(dayListParent.style.maxHeight.replace('px', ''))
			+ docContents.scrollHeight + 'px';

			//upadting day-list max height
			dayListParent.style.maxHeight = computedHeight;

			//giving max height to producsts list
			docContents.style.maxHeight = docContents.scrollHeight + 'px';
		}

	});



});

