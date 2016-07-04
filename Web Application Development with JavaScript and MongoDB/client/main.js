//subscribe read chats
Meteor.subscribe("chats");
Meteor.subscribe("userData");

///set username to sign up
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
///
// helper functions 
/// 
Template.available_user_list.helpers({
  users:function(){
    //console.log("Meteor.users.find({}).count() = " + Meteor.users.find({}).count());
    return Meteor.users.find({});
  }
})
Template.available_user.helpers({
  getUsername:function(userId){
    user = Meteor.users.findOne({_id:userId});
    console.log("user = " +user);
    console.log("user.profile.username="+user.profile.username);
    if(user.profile.username){
      return user.profile.username;
    }
    else{
      return user.username;
    }
  }, 
  isMyUser:function(userId){

    if (userId == Meteor.userId()){
      console.log(userId+ " true = " + Meteor.userId());
      return true;
    }
    else {
      console.log(userId+ " false = " + Meteor.userId());
      return false;
    }
  }
})


Template.chat_page.helpers({
  messages:function(){
    console.log("session chatId ====" + Session.get("chatId"))
    var chat = Chats.findOne({_id:Session.get("chatId")});
    console.log("chat_page got chat :" );
    console.log(chat);
    return chat.messages;
  }, 
  other_user:function(){
    return "";
  },  
})
//format date
Template.chat_message.helpers({
  formatcreatedOn:function(createdOn){
    //format 2016-06-21 XX:XX
    var result = createdOn.getFullYear()+"/"+(createdOn.getMonth()+1)+"/"+createdOn.getDate() +" "+createdOn.getHours()+":"+createdOn.getMinutes()+":"+createdOn.getSeconds();
    console.log(result);
    return result;
  },
})

Template.chat_page.events({
// this event fires when the user sends a message on the chat page
'submit .js-send-chat':function(event){
  // stop the form from triggering a page reload
  event.preventDefault();
  // see if we can find a chat object in the database
  // to which we'll add the message
  var chat = Chats.findOne({_id:Session.get("chatId")});
  if (chat){// ok - we have a chat to use
    var msgs = chat.messages; // pull the messages property
    if (!msgs){// no messages yet, create a new array
      msgs = [];
    }
    // is a good idea to insert data straight from the form
    // (i.e. the user) into the database?? certainly not. 
    // push adds the message to the end of the array
    var userName;
    if(Meteor.user().profile.username){
      userName = Meteor.user().profile.username;
    }
    else{
      userName = Meteor.user().username;
    }
    msgs.push({
      text: event.target.chat.value,
      avatar:Meteor.user().profile.avatar,
      name:userName,
      createdOn: new Date(),
      sendfromId:Meteor.user()._id
    });
    // reset the form
    event.target.chat.value = "";
    // put the messages array onto the chat object
    chat.messages = msgs;
    console.log(chat.messages);
    // update the chat object in the database.
    //Chats.update(chat._id, chat); //move to methods
    Meteor.call("updateChats", chat._id, chat);

  }
}
})
