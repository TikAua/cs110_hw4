'use strict';



$('#searchbutton').on('click', function() {
  drawlist();
});

$('#savebutton').on('click', function() {
    const val = $('#msgtxtbx').val();
    $('#msgtxtbx').val(''); 
    $.ajax({
        url         : "/todos",
        type        : 'POST',
        dataType    : 'json',
        data        : JSON.stringify({
            text   : val,
            complited : false
        }),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {
            drawlist();
        },
        error       : function(data) {
            alert('Error creating todo');
        }
    });

});


const drawlist = function () {

    const searchourtext = $('#searchtxtbx').val(); 
    $('#searchtxtbx').val('');
    $.ajax({
        url      : "/todo",
        type     : 'GET',
        dataType : 'json',
        data     : {
            searchtext : searchourtext
        },
        success  : function(todo) {
            const a = todo;
            const b = $('#todolist'); 
            b.html('');  
            a.forEach(function(tditem) {
                const li = $('<li> ' + tditem.text + ' <input type="checkbox" id="cb'+tditem.id+'"><button id="bt'+tditem.id+'">Delete</button></li>'); // Create li and input tags for each todo item
                const cb = li.find('input'); 
                cb.prop('checked', tditem.complited); 
                cb.on('change', function(){  
                    tditem.complited = cb.prop('checked');
                    $.ajax({
                        url         : "/todo/" + tditem.id,
                        type        : 'put',
                        dataType    : 'json',
                        data        : JSON.stringify(tditem),
                        contentType : "application/json; charset=utf-8",
                        success     : function(todo) {

                        },
                        error       : function(todo) {
                            alert('Error creating todo');
                        }
                    });


                });
                const c = li.find('button'); 
                c.on('click', function(){
                    $.ajax({
                        url      : "/todo/"+tditem.id,
                        type     : 'delete',
                        success  : function () {
                            drawlist();
                        },
                        error    : function () {
                            alert('Error deleting todo');
                        }
                   });
                });
                tdlist.append(li); 
            })
        },
        error    : function(todo) {
            alert('Error searching');
        }
    });
};

drawlist();
