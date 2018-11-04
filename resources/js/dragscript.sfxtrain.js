(function(){
function init() {
    var startPos = null;
    interact('.card').draggable({
      snap: {targets: [startPos],range: Infinity,relativePoints: [ { x: 0.5, y: 0.5 } ],endOnly: true},
      onstart: function (event) {
        var rect = interact.getElementRect(event.target);
        startPos = {
            x: rect.left + rect.width  / 2,
            y: rect.top  + rect.height / 2
        }
        event.interactable.draggable({
          snap: {
            targets: [startPos]
          }
        });
        event.target.classList.add('card_dragged');
        event.target.classList.add('shadow');
        $('body').append('<div class="placeholder" style="left:' + rect.left.toFixed() + 'px;top:' + rect.top.toFixed() + 'px;width:' + rect.width.toFixed() + 'px;height:' + rect.height.toFixed() + 'px;"></div>');
      },
      // call this function on every dragmove event
      onmove: function (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        //target.classList.add('getting--dragged');
      },
      onend: function (event) {
        $('div.placeholder').remove();
        event.target.removeAttribute('style');
        event.target.removeAttribute('data-x');
        event.target.removeAttribute('data-y');
        //event.target.classList.remove('getting--dragged');
        //event.target.classList.remove('drop--me');
        event.target.classList.remove('card_dragged'); 
        event.target.classList.remove('shadow');
      }
    });

    interact('.dropzone').dropzone({
      accept: '.card',
      overlap: 'center',
      ondropactivate: function (event) {
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement  = event.target,
            dropRect         = interact.getElementRect(dropzoneElement),
            dropCenter       = {
              x: dropRect.left + dropRect.width  / 2,
              y: dropRect.top  + dropRect.height / 2
            };

        event.draggable.draggable({
          snap: {
            targets: [dropCenter]
          }
        });
        event.target.classList.add('dropzone_active');
      },
      ondragleave: function (event) {
        event.target.classList.remove('dropzone_active');
      },
      ondrop: function (event) {
        var dropzone_prepare_after = document.createElement("div");
        dropzone_prepare_after.className = "dropzone"; 
        event.target.after(dropzone_prepare_after);
        event.target.after(event.interaction.element);
        if(!event.relatedTarget.classList.contains('card_planned')){
          event.interaction.element.classList.add('card_planned');
        }
        if(event.relatedTarget.classList.contains('card_planned') && !event.relatedTarget.classList.contains('card_removable')){
           event.interaction.element.classList.add('card_removable');
        }
        $('section div.dropzone').each(function() {
            if ($(this).next().is('div.dropzone')) {
                $(this).css("background-color","red");
                $(this).remove();
            }
        });
        event.target.classList.remove('dropzone_active');
        $('section').each(function() {
            var ElemCount = $(this).find('div.card').length;
            if (ElemCount < 1){
                $(this).find('.dropzone').remove();
                $(this).addClass('section_dropzone');
            }
        });          
        Plan2Base();
      },
      ondropdeactivate: function (event) {
      }
    });
    
    interact('.section_dropzone').dropzone({
      accept: '.card',
      overlap: 'center',
      ondropactivate: function (event) {
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement  = event.target,
            dropRect         = interact.getElementRect(dropzoneElement),
            dropCenter       = {
              x: dropRect.left + dropRect.width  / 2,
              y: dropRect.top  + dropRect.height / 2
            };
        event.draggable.draggable({
          snap: {
            targets: [dropCenter]
          }
        });
      },
      ondragleave: function (event) {


      },
      ondrop: function (event) {         
        var dropzone_prepare_before = document.createElement("div");
        dropzone_prepare_before.className = "dropzone";  
        event.target.append(dropzone_prepare_before);
        event.target.append(event.interaction.element);  
        if(!event.relatedTarget.classList.contains('card_planned')){
          event.interaction.element.classList.add('card_planned');
        }
        if(event.relatedTarget.classList.contains('card_planned') && !event.relatedTarget.classList.contains('card_removable')){
           event.interaction.element.classList.add('card_removable');
        }
        var dropzone_prepare_after = document.createElement("div");
        dropzone_prepare_after.className = "dropzone"; 
        event.target.append(dropzone_prepare_after);
        event.target.classList.remove('section_dropzone');
        $('section div.dropzone').each(function() {
            if ($(this).next().is('div.dropzone')) {
                $(this).css("background-color","red");
                $(this).remove();
            }
        });
        $('section').each(function() {
            var ElemCount = $(this).find('div.card').length;
            if (ElemCount < 1){
                $(this).find('.dropzone').remove();
                $(this).addClass('section_dropzone');
            }
        });
        Plan2Base();
      },
      ondropdeactivate: function (event) {
      }
    });
}

function getNodeIndex(node) {
    var index = 0;
    while ( (node = node.previousSibling) ) {
      if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
        index++;
      }
    }
    return index;
}

function eleHasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

window.onload = function() {
    init();
}
})();
