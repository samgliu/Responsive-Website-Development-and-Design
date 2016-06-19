var category_template, photos_template, slideshow_template;
var current_animals = animals_data.category[0];
console.log(current_animals);
var current_photo = current_animals.animals[0];
console.log(current_photo)
function showTemplate(template, data){
	var html    = template(data);
	$('#content').html(html);
}

$(document).ready(function(){
	var source   = $("#category-template").html();
	category_template = Handlebars.compile(source);
	source   = $("#photos-template").html();
	photos_template = Handlebars.compile(source);
	
	source   = $("#photo-template").html();
	photo_template = Handlebars.compile(source);
	
	source   = $("#slideshow-template").html();
	slideshow_template = Handlebars.compile(source);

	$("#category-tab").click(function () {

		showTemplate(category_template, animals_data);
		$(".nav-tabs .active").removeClass("active");
		$("#category-tab").addClass("active");

		$(".category-thumbnail").click(function (){

		var index = $(this).data("id");
		console.log(index);
		current_animals = animals_data.category[index];
		showTemplate(photos_template, current_animals);


        $(".photo-thumbnail").click(function (){

			var index = $(this).data("id");
			console.log("index");
			console.log(index);


				if ( index == 1){
					current_photo = {image:this.src, name:this.alt};
					console.log(current_photo);
					console.log(name);
				}else if( index == 2 ){
					current_photo = {image:this.src, name:this.alt};
					console.log(current_photo);
					console.log(name);
				}

			showTemplate(photo_template, current_photo);
			});
    
		});
    });


	$("#animal-tab").click(function () {
		

		showTemplate(photos_template, current_animals);


		$(".nav-tabs .active").removeClass("active");

		$("#animal-tab").addClass("active");

			$(".photo-thumbnail").click(function (){

				var index = $(this).data("id");


				if ( index == 1){
					current_photo = {image:this.src, name:this.alt};
				}else if( index == 2 ){
					current_photo = {image:this.src, name:this.alt};
				}

				console.log(current_photo);

			
			showTemplate(photo_template, current_photo);
		});
	});


	$("#slideshow-tab").click(function () {


		showTemplate(slideshow_template, current_animals);
		

		$(".nav-tabs .active").removeClass("active");

		$("#slideshow-tab").addClass("active");
	});


	$("#category-tab").click();
});