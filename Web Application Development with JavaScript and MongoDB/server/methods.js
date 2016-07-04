Meteor.methods({
  // adding new comments
  addChats:function (user1, user2) {
    if (!this.userId){
      throw new Meteor.Error("logged-out", "Please logged in.");
    }

    // Check if users exist on the database
    if (Meteor.users.find({_id: user1}) && Meteor.users.find({_id: user2})) {
      console.log("Inserting a chat...")
      Chats.insert({user1Id:user1, user2Id:user2}, function(err, result){
        if (err) {return err;}
        else {
          console.log("Chat "+ result + " created!");
          return result;}
      });
    }// end of if
  },//end of addChats 

  updateChats:function(chatId, chats){
    console.log("updateChats method running!");
      Chats.update(chatId, chats);
  } 
})//end of methods