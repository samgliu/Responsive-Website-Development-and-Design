Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");
import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
    /// routing
    Router.configure({
      layoutTemplate: 'ApplicationLayout'
    });

    Router.route('/', function () {
      this.render('navbar', {
        to:"navbar"
      });
      this.render('main', {
        to:"bodypage"
      });
    });

    Router.route('/detail/:_id', function () {
      this.render('navbar', { to:"navbar"});
      this.render('detail', { to:"bodypage",
        data:function(){
        	console.log("detail Websites.findOne({_id:this.params._id})"+Websites.findOne({_id:this.params._id}));
        	console.log("this.params._id:   "+this.params._id);
            return Websites.findOne({_id:this.params._id});
             }
           });
    });// end of detail/id

	/// accounts config
    Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
    });
    /// 

	/////
	// template helpers function(){
	/////

	// helper function that returns all available websites
	Template.comment_count.helpers({
		comment_count_data:function(){
			console.log("testthisid=========="+this._id);
			var commentNum = Comments.find({website: this._id}).count();
			console.log("commentNum ======" +
			Comments.find({website: this._id}).count()   );
			if (commentNum ==null || commentNum == undefined) {
				colsole.log("set count to 0");
				return 0;
			}else{
				console.log('commetns no.:' + commentNum);
				return  commentNum;
			}
	 }//end of count

	});//end of commentcount helpers

	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort : {uprating : -1}});
		}
	});
    
	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log('website id: '+ website_id);
			var rating = Websites.findOne(website_id).uprating;
            console.log('rating start: '+ rating);
			if (isNaN(rating)){
                Websites.update({_id : website_id}, {$set : {uprating : 0}});
                console.log('in if rating: '+  Websites.findOne(website_id).uprating);
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id : website_id}, {$set : {uprating : Websites.findOne(website_id).uprating + 1}});
			console.log("Up voting website with id " + website_id + " now the raing is " +  Websites.findOne(website_id).uprating);
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log('website id: '+ website_id);
			var rating = Websites.findOne(website_id).downrating;
            console.log('rating start: '+ rating);
			if (isNaN(rating)){
                Websites.update({_id : website_id}, {$set : {downrating : 0}});
                console.log('in if rating: '+  Websites.findOne(website_id).downrating);
			}
			// put the code in here to add a vote to a website!
			Websites.update({_id : website_id}, {$set : {downrating : Websites.findOne(website_id).downrating + 1}});
			console.log("Up voting website with id " + website_id + " now the raing is " +  Websites.findOne(website_id).downrating);
			return false;// prevent the button from reloading the page
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
			return false;
		}, 
		"click .js-cancel-website-form":function(event){
			$("#website_form").toggle('slow');
			return false;
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;
			console.log("The url they entered is: "+url+" title: "+title+" description: "+description);
			
			//  put your website saving code in here!	
			if (Meteor.user()) {
				console.log(Meteor.user());
				Websites.insert({
					url : url,
					title : title,
					description : description,
					createdOn : new Date(),
					//createdBy : Meteor.user()._id
				});
			}
			return false;// stop the form submit from reloading the page

		},//end of form submit
		"click #autofill":function(event){
			// here is an example of how to get the url out of the form:
			var url = $('#url').val();
			console.log("Get url: " + url);	
			Meteor.call('httpGet',url,function(error,results) {
			    console.log("result: " + results);
			    var el = $('<div></div>');
                el.html(results.content);
                console.log(el);
                var title = $('title', el).text();
                console.log("title: "+title)
                var description = $('meta[name="description"]', el).attr('content');
                console.log("description: "+description)
            $('#title').val(title);
            $('#description').val(description);
		    });//endof call
			return false;// stop the form submit from reloading the page
		}//end of click
	});// end of website_form event

	//comment section
	Template.comment_list.helpers({
		comments:function(){
			return Comments.find({website: Router.current().params._id},{sort : {createdOn : -1}});
		}
	});


	Template.comment_form.events({
		"click .js-toggle-comment-form":function(event){
			$("#comment_form").toggle('slow');
			return false;
		}, 
		"click .js-cancel-comment-form":function(event){
			$("#comment_form").toggle('slow');
			return false;
		}, 
		"submit .js-save-comment-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var comment = event.target.comment.value;
			console.log("The url they entered is: "+url+" title: "+title+" comment: "+comment);
			//  put your comment saving code in here!	
			if (Meteor.user()) {
				console.log("Router.current().params._id"+Router.current().params._id);
				Comments.insert({
					url : url,
					title : title,
					comment : comment,
					createdOn : new Date(),
					user:Meteor.user()._id,
					website:Router.current().params._id
				});
                console.log("Meteor.user()._id:"+ Meteor.user()._id);
			}
			return false;// stop the form submit from reloading the page
		}
	}); // end of comment_form






}//  end of if cliend


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date()
    	});
      }//den of if
    }); //end of startup

    Meteor.methods({
 		httpGet:function(url){
 		  	console.log('in mathods url:' + url);
 			this.unblock();
            return Meteor.http.call("GET", url, {"npmRequestOptions":{"gzip":true}});
 	    }//end of httpGet
 	});//end of mathods

}// end of is server
