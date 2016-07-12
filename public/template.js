function autowechat() {
    const msg = `@@msg`;

    const groups = '@@group';

    const cooldown = 1000 * 60 * 60; // in milisec

    function selectGroupButton(group, next) {
        //  get all buttons
        var allButtons = $(".nickname_text.ng-binding");
        //  loop thru
        for (var i=0; i < allButtons.length; i++) {
            //  get button
            var button = allButtons[i];
            //  see if button match
            if (button.innerHTML === group) {
                button.click();
                //  wait 3 sec and call next function
                setTimeout(next, 3000);
            }
        }
    }

    function setText(text, next) {
        //  set text
        $('#editArea').html(text);
        //  add line in editArea by simulating ctrl + enter
        $('#editArea').trigger($.Event('keydown', { keyCode: 13,ctrlKey: true}));
        //  click editArea to select
        $('#editArea').click();
        //  remove that new line
        $('#editArea').trigger($.Event('keydown', { keyCode: 8,ctrlKey: true}));
        //  wait 3 sec and call next function
        setTimeout(next, 3000);
    }

    function sendTo(group, next) {
        selectGroupButton(group, function(){
            //  selected group
            setText(msg, function(){
                //  done setting text
                //  click send to send message
                $('a.btn.btn_send').click();
                //  wait 1 sec and callback
                setTimeout(next, 1000);
            });
        });
    }

    function sendToAll() {
        //  deep copy
        var groups_cpy = groups.slice();
        //  send to one and callback to send to next one, call next() if no more to call
        function callback() {
            var group = groups_cpy.shift();
            if (group) {
                sendTo(group, callback);
            } else {
                //  no more to send, pass
            }
        }
        callback();
    }

    

    function send () {
        sendToAll();
        setTimeout(send, cooldown);
    }

    send(); //  send immediately
}

autowechat();