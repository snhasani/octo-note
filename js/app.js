/**
*
* create by @snhasani - Mondey 27 April 2015
*
**/


(function(window, document, undefined) {

    var model = {
        init : function() {
            var notes = octopus.getCache('notes');
            if (notes) {
                this.notes = notes;
                this.lastId = Object.keys(notes).length;
            } else {
                this.notes = {};
                this.lastId = 0;
            }
        }
    };

    var octopus = {

        init : function() {
            model.init();
            view.init();
            view.render(octopus.getVisibleNote());
        },

        addNote : function(text) {
            var lastId = ++model.lastId;
            var note = {
                id: lastId,
                date: Date.now(),
                text: text,
                visible: true
            };
            model.notes[lastId] = note;
            console.log(model.notes);
            this.setCache('notes', model.notes);
            view.render({lastId : note});
        },

        removeNote : function(id) {
            model.notes[id].visible = false;
            this.setCache('notes', model.notes);
        },

        getVisibleNote : function() {
            var notes = model.notes;
            var result = {};

            if (Object.keys(notes).length) {
                for(note in notes){
                    if (notes[note].visible) {
                        result[note] = notes[note];
                    }
                }
            }
            return result;
        },

        getCache : function(item) {
            var cache = window.localStorage[item];
            if (cache) {
                cache = JSON.parse(cache);
            }
            return cache;
        },

        setCache : function(item, value) {
            window.localStorage[item] = JSON.stringify(value);
        }
    };

    var view = {

        init : function() {

            this.noteInput =
                document.getElementsByClassName('note-input');

            this.noteListWrapper =
                document.getElementsByClassName('note-list');

            this.template =
                document.querySelector('script[data-template]').innerHTML;

            this.noteInput[0].addEventListener('keyup', function(evt) {
                var value = evt.target.value;
                if (evt.keyCode === 13 && value) {
                    octopus.addNote(value);
                    evt.target.value = '';
                }
            });
        },

        render : function(notes) {
            var elem, currentNote;
            notes = notes || {};
            // console.log(notes);
            if (Object.keys(notes).length) {
                for(note in notes){
                    currentNote = notes[note];
                    elem = document.createElement('li');
                    elem.setAttribute('class', 'note group');

                    elem.innerHTML = utils.twt(this.template, currentNote);
                    this.noteListWrapper[0].appendChild(elem);

                    elem.children[0].addEventListener('click', (function(noteCopy) {
                        return function(evt) {
                            evt.preventDefault();
                            octopus.removeNote(noteCopy.id);
                            elem.remove();
                        }
                    })(currentNote));
                }

            } else {
                this.noteListWrapper[0].innerHTML = '';
            }
        }
    };

    /*=============================
    =            Utils            =
    =============================*/

    var utils = {
        twt : function(t, d) {
            var s = t;
            for(var p in d) {
                if ( p !== 'date') {
                    s = s.replace(new RegExp('{{'+p+'}}','g'), d[p]);
                } else {
                    s = s.replace(
                            new RegExp('{{date}}','g'),
                            new Date(d['date']).toDateString()
                        );
                }
            }
            return s;
        }
    }

    /*-----  End of Utils  ------*/

    window.addEventListener('DOMContentLoaded', octopus.init, false);

})(window, document);