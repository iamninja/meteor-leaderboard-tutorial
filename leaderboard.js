PlayerList = new Mongo.Collection('players');


if (Meteor.isClient) {
  Template.leaderboard.helpers({
    'player': function() {
      var currentUserId = Meteor.userId();
      return PlayerList.find({ createdBy: currentUserId }, { sort: { score: -1, name: 1 } });
    },
    'selectedClass': function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (selectedPlayer == playerId) {
        return 'selected';
      };
    },
    'selectedPlayer': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayerList.findOne({ _id: selectedPlayer });
    }
  });

  Template.leaderboard.events({
    'click .player': function() {
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, 5);
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updateScore', selectedPlayer, -5);
    },
    'click .remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      Meteor.call('createPlayer', playerNameVar);
      event.target.playerName.value = "";
    }
  });

  Meteor.subscribe('thePlayers');
}

if (Meteor.isServer) {
  Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId;
    return PlayerList.find({ createdBy: currentUserId });
  });

}

Meteor.methods({
  'createPlayer': function(playerNameVar) {
    check(playerNameVar, String);
    var currentUserId = Meteor.userId();
    if (currentUserId) {
      PlayerList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
    } else {
      console.log('You must login first.');
    };
  },
  'removePlayer': function(selectedPlayer) {
    check(selectedPlayer, String);
    var currentUserId = Meteor.userId();
    if (currentUserId) {
      PlayerList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    } else {
      console.log('You must login first.');
    };
  },
  'updateScore': function(selectedPlayer, value) {
    check(selectedPlayer, String);
    check(value, Number);
    var currentUserId = Meteor.userId();
    if (currentUserId) {
      PlayerList.update({ _id: selectedPlayer, createdBy: currentUserId }, { $inc: { score: value } });
    } else {
      console.log('You must login first.');
    };
  }
});