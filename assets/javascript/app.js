var winCons = {
    r : {
      r : 'tie',
      p : 'lose',
      s : 'win'
    },
    p : {
      r : 'win',
      p : 'tie',
      s : 'lose'
    },
    s : {
      r : 'lose',
      p : 'win',
      s : 'tie'
    }
  } 
  
  
  var gameFunc = {
  
    addName : function () {
      database.ref('/player/p1').on('value', function(snap) {
        if (snap.val()){
          p1.name = snap.val().name;
          playerDivs.getStatus();
        }
      })
      database.ref('/player/p2').on('value', function(snap) {
        if (snap.val()){
          p2.name = snap.val().name;
          playerDivs.getStatus();
        }
      })
    },
  
    pullScore : function () {
      database.ref('/player').on('value', function(snap) {
        p1.win = snap.child('p1').child('win').val();
        p1.lose = snap.child('p1').child('lose').val();
        p2.win = snap.child('p2').child('win').val();
        p2.lose = snap.child('p2').child('lose').val();
      })
    },
  
    WL : function (p1, p2) {
      if (userID === '#p1'){
        return winCons[p1][p2];
      } 
      else if (userID === '#p2'){
        return winCons[p2][p1];
      }
    },
  
    assembled : function () {
      database.ref('/player').on('value', function(snap) {
        if(snap.child('p1').child('name').val() && snap.child('p2').child('name').val()){
          $('.wait').empty();
          setTimeout(function () {
            $(challenger).empty();
            playerDivs.showHands(userID);
          }, 1500);
        }
      })
    },
  
    start : function () {
      
      playerDivs.login();
      gameFunc.addName();
      
      gameFunc.assembled();
  
      database.ref('/game').on('value', function(snap) {
        if(snap.child('p1Pick').val() && snap.child('p2Pick').val()){  
          var result = gameFunc.WL(snap.child('p1Pick').val(),snap.child('p2Pick').val());
          // console.log(result);
          $('.result').html('You ' + result + '!');
  
          if (userID === '#p1') {
            var image = $('<img>').attr('src', playerDivs.HandsSrc[(playerDivs.hands.indexOf(snap.child('p2Pick').val()))]);
            $(challenger).append(image);
              p1[result]++;
            database.ref('/player/p1').update({
              win: p1.win,
              lose: p1.lose,
            });
          } 
          else if (userID === '#p2') {
            var image = $('<img>').attr('src', playerDivs.HandsSrc[(playerDivs.hands.indexOf(snap.child('p1Pick').val()))]);
            $(challenger).append(image);
              p2[result]++;
            database.ref('/player/p2').update({
              win: p2.win,
              lose: p2.lose,
            });
          }
  
          database.ref('/game').remove();
  
          playerDivs.getStatus();
  
          gameFunc.assembled();
          
        }
      }); 
    }
  
  } 
  
  var playerDivs = {
  
    hands : ['r', 'p', 's'],
    HandsSrc : ['assets/images/r.png', 'assets/images/p.jpg', 'assets/images/s.png'],
    login : function () {
        $('#p1-btn').click(function (event) {
          event.preventDefault();
          var input = $('#p1-name').val().trim();
          
          if(input){
            $('#chatName').html(input);
            $('#p1-name').val('');
            p1.name = input;
            p1.win = initialWL;
            p1.lose = initialWL;
            userID = p1.id;
            challenger = p2.id;
            playerDivs.pSet();
            database.ref('/player/p1').set({
              name: p1.name,
              win: p1.win,
              lose: p1.lose,
            });
          } 
        })
        $('#p2-btn').click(function (event) {
          event.preventDefault();
          
          var input = $('#p2-name').val().trim();
          if(input){
            $('#chatName').html(input);
            $('#p2-name').val('');
            p2.name = input;
            p2.win = initialWL;
            p2.lose = initialWL;
            userID = p2.id;
            challenger = p1.id;
            playerDivs.pSet();
            database.ref('/player/p2').set({
              name: p2.name,
              win: p2.win,
              lose: p2.lose,
          });
          }
        })
    },
  
    pSet : function () {
        $('#p1-login').hide();
        $('#p2-login').hide();
        if (p1.name !== '') {
          var text = $('<div>').html('Waiting for New Challenger').addClass('wait');
          $('#p2-div').prepend(text);
          playerDivs.getStatus();  
        } 
        else if (p2.name !== '') {
          var text = $('<div>').html('Waiting for New Challenger').addClass('wait');
          $('#p1-div').prepend(text);
          playerDivs.getStatus(); 
        }
    },
  
    getStatus : function () {
        gameFunc.pullScore();
        if(p1.name !== ''){
          $('#p1-login').hide();
          $('#p1-state').empty();
          var name = $('<div>').html(p1.name);
          var win = $('<div>').html('win: ' + p1.win);
          var lose = $('<div>').html('lose: ' + p1.lose);
          $('#p1-state').append(name, win, lose);   
        }
        
        if(p2.name !== ''){
          $('#p2-login').hide();
          $('#p2-state').empty();
          name = $('<div>').html(p2.name);
          win = $('<div>').html('win: ' + p2.win);
          lose = $('<div>').html('lose: ' + p2.lose);
          $('#p2-state').append(name, win, lose);
        }
    },
    showHands : function (id) {
        $(id).empty();
        for (var i = 0; i < this.hands.length; i++) {
          var images = $('<img>').attr('src', this.HandsSrc[i]).attr('data-hand',this.hands[i]).addClass('hands');
          $(id).append(images);
        }
    
        $('.hands').click(function () {
          var currHand = ($(this).attr('data-hand'));
          // console.log(currHand);
          $(id).empty();
          var image = $('<img>').attr('src', playerDivs.HandsSrc[(playerDivs.hands.indexOf(currHand))]);
          
          
          $(id).append(image, '<div class=\'result\' ><p>Awaiting challenger.</p></div>');
          
          
          if (id === '#p1'){
            p1.choice = currHand;
            database.ref('/game').update({p1Pick: p1.choice});
          } 
          else if (id === '#p2') {
            p2.choice = currHand;
            database.ref('/game').update({p2Pick: p2.choice});
          } 
      });
    }
    
  } 
  

  var initialWL = 0;
  
  var userID = '';
  var challenger = '';
  
  var p1 = {
    name : '',
    win : initialWL,
    lose : initialWL,
    id : '#p1',
    choice : ''
  }
  
  var p2 = {
    name : '',
    win : initialWL,
    lose : initialWL,
    id : '#p2',
    choice : ''
  }
  
  //Firebase
  var config = {
    apiKey: 'AIzaSyAAQdFNk7iucBeDds3oOOgKxzJGtBVcWro',
    authDomain: 'rps-multiplayer-a5c9d.firebaseapp.com',
    databaseURL: 'https://rps-multiplayer-a5c9d.firebaseio.com',
    storageBucket: 'rps-multiplayer-a5c9d.appspot.com',
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  var chatData = database.ref('/chat');
  
  
  $(document).ready(function() {
    
    gameFunc.start();
  
    window.onunload = function () {
      if (userID == '#p1') {
        database.ref('player/p1').set({ 
          name: '',
          win: initialWL,
          lose: initialWL,
        });
  
      } 
      else if (userID == '#p2') {
        database.ref('player/p2').set({ 
          name: '',
          win: initialWL,
          lose: initialWL,
        });
  
      }
    };
  
    database.ref('/player').on('value', function(snap) {
      if(userID) {
        if(snap.child('p1').child('name').val() == '' || snap.child('p2').child('name').val() == ''){
          $('.wait').html('Waiting for New Challenger');
          $('#p2-state').empty;
          gameFunc.addName();
        }
      }
    });
  
    $('#submit-msg').click(function (ev) {
      ev.preventDefault();

      if (userID == '#p1') {
        name =p1.name;
      }
      else if (userID == '#p2') {
        name =p2.name;
      }
      var msg = $('#user-msg').val().trim();
      if(name&&msg) {        
        chatData.push({
          name: name,
          text: msg,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $('#user-msg').val('');
      }
    });
  
    chatData.orderByChild('dateAdded').limitToLast(3).on('child_added', function(snap) {
      var sv = snap.val();
      $('#chatBlock').prepend('<p>' + sv.name + ': ' + sv.text + '</p>');
    }, function(errorObject) {
      console.log('Errors handled: ' + errorObject.code);
    });
  
  })