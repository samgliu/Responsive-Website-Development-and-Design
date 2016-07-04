
// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
  console.log("rendering root /");
  this.render("navbar", {to:"header"});
  this.render("lobby_page", {to:"main"});  
});

// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {
  // the user they want to chat to has id equal to 
  // the id sent in after /chat/... 
  var otherUserId = this.params._id;
  // find a chat that has two users that match current user id
  // and the requested user id
  var filter = {$or:[
              {user1Id:Meteor.userId(), user2Id:otherUserId}, 
              {user2Id:Meteor.userId(), user1Id:otherUserId}
              ]};
  var chat = Chats.findOne(filter);
  console.log("when get in filter, my session chatId is :"+Session.get("chatId"));
  console.log(filter)
  console.log("chat got what 1");
  console.log(chat);
  if (chat ==  undefined){// no chat matching the filter - need to insert a new one
    ///call methods
    //chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:otherUserId}); //no need otherUserId
    console.log("Don't have chat! user1 ID "+ Meteor.userId());
    console.log("user2 ID "+ otherUserId);
    var chatId = Meteor.call("addChats", Meteor.userId(), otherUserId, function(err){
      if(err){
        alert ("Please log in.")
      }
    });
  }
  else {// there is a chat going already - use that. 
    console.log("already got 2: ");
    console.log(chat);
    chatId = chat._id;
  }
  if (chatId){// looking good, save the id to the session
    Session.set("chatId",chatId);
  }
  this.render("navbar", {to:"header"});
  this.render("chat_page", {to:"main"});  
});