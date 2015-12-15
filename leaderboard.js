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
      PlayerList.update({ _id: selectedPlayer }, { $inc: { score: 5 } });
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update({ _id: selectedPlayer }, { $inc: { score: -5 } });
    },
    'click .remove': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.remove({ _id: selectedPlayer });
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();
      var currentUserId = Meteor.userId();
      var playerNameVar = event.target.playerName.value;
      PlayerList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
      event.target.playerName.value = "";
    }
  });
}

if (Meteor.isServer) {

}