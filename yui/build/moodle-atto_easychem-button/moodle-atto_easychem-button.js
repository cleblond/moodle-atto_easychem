YUI.add('moodle-atto_easychem-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    atto_easychem
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Atto text editor easychem plugin.
 */

/**
 * Atto easychem editor.
 *
 * @namespace M.atto_easychem
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_easychem',
    LOGNAME = 'atto_easychem',
    CSS = {
        EQUATION_TEXT: 'atto_easychem_easychem',
        EQUATION_PREVIEW: 'atto_easychem_preview',
        SUBMIT: 'atto_easychem_submit',
        LIBRARY: 'atto_easychem_library',
        LIBRARY_GROUPS: 'atto_easychem_groups',
        LIBRARY_GROUP_PREFIX: 'atto_easychem_group'
    },
    SELECTORS = {
        LIBRARY: '.' + CSS.LIBRARY,
        LIBRARY_GROUP: '.' + CSS.LIBRARY_GROUPS + ' > div > div',
        EQUATION_TEXT: '.' + CSS.EQUATION_TEXT,
        EQUATION_PREVIEW: '.' + CSS.EQUATION_PREVIEW,
        SUBMIT: '.' + CSS.SUBMIT,
        LIBRARY_BUTTON: '.' + CSS.LIBRARY + ' button'
    },
    DELIMITERS = {
        START: '',
        END: ''
    },
    TEMPLATES = {
        FORM: '' +
            '<form class="atto_form">' +
                '{{{library}}}' +
                '<label for="{{elementid}}_{{CSS.EQUATION_TEXT}}">{{{get_string "editeasychem" component texdocsurl}}}</label>' +
                '<textarea class="fullwidth {{CSS.EQUATION_TEXT}}" id="{{elementid}}_{{CSS.EQUATION_TEXT}}" rows="8"></textarea><br/>' +
                '<label for="{{elementid}}_{{CSS.EQUATION_PREVIEW}}">{{get_string "preview" component}}</label>' +
                '<div describedby="{{elementid}}_cursorinfo" class="well well-small fullwidth {{CSS.EQUATION_PREVIEW}}" id="{{elementid}}_{{CSS.EQUATION_PREVIEW}}"></div>' +
              //  '<div id="{{elementid}}_cursorinfo">{{get_string "cursorinfo" component}}</div>' +
                '<div class="mdl-align">' +
                    '<br/>' +
                    '<button class="{{CSS.SUBMIT}}">{{get_string "saveeasychem" component}}</button>' +
                '</div>' +
            '</form>',
        LIBRARY: '' +
            '<div class="{{CSS.LIBRARY}}">' +
                '<ul>' +
                    '{{#each library}}' +
                        '<li><a href="#{{../elementid}}_{{../CSS.LIBRARY_GROUP_PREFIX}}_{{@key}}">' +
                            '{{get_string groupname ../component}}' +
                        '</a></li>' +
                    '{{/each}}' +
                '</ul>' +
                '<div class="{{CSS.LIBRARY_GROUPS}}">' +
                    '{{#each library}}' +
                        '<div id="{{../elementid}}_{{../CSS.LIBRARY_GROUP_PREFIX}}_{{@key}}">' +
                            '<div role="toolbar">' +
                            '{{#split "\n" elements}}' +
                                '<button class="easychem_library" tabindex="-1" data-tex="{{this}}" aria-label="{{this}}" title="{{this}}">' +
                                    '{{../../DELIMITERS.START}}{{{this}}}{{../../DELIMITERS.END}}' +
                                '</button>' +
                            '{{/split}}' +
                            '</div>' +
                        '</div>' +
                    '{{/each}}' +
                '</div>' +
            '</div>'
    };

Y.namespace('M.atto_easychem').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * The selection object returned by the browser.
     *
     * @property _currentSelection
     * @type Range
     * @default null
     * @private
     */
    _currentSelection: null,

    /**
     * The cursor position in the easychem textarea.
     *
     * @property _lastCursorPos
     * @type Number
     * @default 0
     * @private
     */
    _lastCursorPos: 0,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,

    /**
     * The source easychem we are editing in the text.
     *
     * @property _sourceEquation
     * @type Object
     * @private
     */
    _sourceEquation: null,

    /**
     * A reference to the tab focus set on each group.
     *
     * The keys are the IDs of the group, the value is the Node on which the focus is set.
     *
     * @property _groupFocus
     * @type Object
     * @private
     */
    _groupFocus: null,

    /**
     * Regular Expression patterns used to pick out the easychems in a String.
     *
     * @property _easychemPatterns
     * @type Array
     * @private
     */
    _easychemPatterns: [
        // We use space or not space because . does not match new lines.
        // $$ blah $$.
        /\%([\S\s]+?)\%/,        
        /\$\$([\S\s]+?)\$\$/,
        // E.g. "\( blah \)".
        /\\\(([\S\s]+?)\\\)/,
        // E.g. "\[ blah \]".
        /\\\[([\S\s]+?)\\\]/,
        // E.g. "[tex] blah [/tex]".
        /\[tex\]([\S\s]+?)\[\/tex\]/
    ],
/**
    _easychemPatterns: [
        // We use space or not space because . does not match new lines.
        // $$ blah $$.
        /\$\$([\S\s]+?)\$\$/,
        // E.g. "\( blah \)".
        /\\\(([\S\s]+?)\\\)/,
        // E.g. "\[ blah \]".
        /\\\[([\S\s]+?)\\\]/,
        // E.g. "[tex] blah [/tex]".
        /\[tex\]([\S\s]+?)\[\/tex\]/
    ],
*/



    initializer: function() {
        this._groupFocus = {};

        // If there is a tex filter active - enable this button.
        if (this.get('texfilteractive')) {
            // Add the button to the toolbar.
            this.addButton({
                icon: 'easychem',
                iconComponent: 'atto_easychem',
                buttonName: 'chart',
                callback: this._displayDialogue
            });

            // We need custom highlight logic for this button.
            this.get('host').on('atto:selectionchanged', function() {
                if (this._resolveEquation()) {
                    this.highlightButtons();
                } else {
                    this.unHighlightButtons();
                }
            }, this);

            // We need to convert these to a non dom node based format.
            this.editor.all('tex').each(function (texNode) {
                var replacement = Y.Node.create('<span>' + DELIMITERS.START + '' + texNode.get('text') + '' + DELIMITERS.END + '</span>');
                texNode.replace(replacement);
            });
        }

    },

    /**
     * Display the easychem editor.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        this._currentSelection = this.get('host').getSelection();

        if (this._currentSelection === false) {
            return;
        }

        // This needs to be done before the dialogue is opened because the focus will shift to the dialogue.
        var easychem = this._resolveEquation();

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            width: 600,
            focusOnShowSelector: SELECTORS.EQUATION_TEXT
        });

        var content = this._getDialogueContent();
        dialogue.set('bodyContent', content);

        var library = content.one(SELECTORS.LIBRARY);


//cpvert easychem code for buttons
		YUI().use('node', 'easychem', function (Y) {
                    //console.log(this.get('innerHTML'));
                    buttons = Y.all('.easychem_library').each(function (Y) {

                    //var curtext = Y.get('innerHTML');
      
                    var src = Y.get('innerHTML');
                    //console.log(src.substring(1, 7));
	            if (src.substring(1, 7) != 'canvas') {;
		            src = src.replace("&amp;", "&").replace("&gt;", ">").replace("&lt;", "<");
		      //      console.log('src='+src);
			    var res = ChemSys.compile(src); 
			    ChemSys.draw(Y.empty(), res);
                            //console.log(Y.empty());
                    }
                    });;
                    
                    //console.log(buttons);
                    //console.log(curbuttext);
		    //var src = this.one('#' + eid + '_atto_easychem_easychem').get('value');
		    //var res = ChemSys.compile(src); 
		    //ChemSys.draw(Y.one('#' + eid + '_atto_easychem_preview').empty(), res);
                    
		});







        var tabview = new Y.TabView({
            srcNode: library
        });

        tabview.render();
        dialogue.show();
        // Trigger any JS filters to reprocess the new nodes.
        Y.fire(M.core.event.FILTER_CONTENT_UPDATED, {nodes: (new Y.NodeList(dialogue.get('boundingBox')))});

        if (easychem) {
            content.one(SELECTORS.EQUATION_TEXT).set('text', easychem);
        }
        this._updatePreview(false);
    },

    /**
     * If there is selected text and it is part of an easychem,
     * extract the easychem (and set it in the form).
     *
     * @method _resolveEquation
     * @private
     * @return {String|Boolean} The easychem or false.
     */
    _resolveEquation: function() {
        console.log('resolveequation');
        // Find the easychem in the surrounding text.
        var selectedNode = this.get('host').getSelectionParentNode(),
            selection = this.get('host').getSelection(),
            text,
            returnValue = false;

        // Prevent resolving easychems when we don't have focus.
        if (!this.get('host').isActive()) {
            return false;
        }

        // Note this is a document fragment and YUI doesn't like them.
        if (!selectedNode) {
            return false;
        }

        // We don't yet have a cursor selection somehow so we can't possible be resolving an easychem that has selection.
        if (!selection || selection.length === 0) {
            return false;
        }

        this.sourceEquation = null;

        selection = selection[0];

        text = Y.one(selectedNode).get('text');

        // For each of these patterns we have a RegExp which captures the inner component of the easychem but also includes the delimiters.
        // We first run the RegExp adding the global flag ("g"). This ignores the capture, instead matching the entire
        // easychem including delimiters and returning one entry per match of the whole easychem.
        // We have to deal with multiple occurences of the same easychem in a String so must be able to loop on the
        // match results.
        Y.Array.find(this._easychemPatterns, function(pattern) {
            // For each pattern in turn, find all whole matches (including the delimiters).
            var patternMatches = text.match(new RegExp(pattern.source, "g"));

            if (patternMatches && patternMatches.length) {
                // This pattern matches at least once. See if this pattern matches our current position.
                // Note: We return here to break the Y.Array.find loop - any truthy return will stop any subsequent
                // searches which is the required behaviour of this function.
                return Y.Array.find(patternMatches, function(match) {
                    // Check each occurrence of this match.
                    var startIndex = 0;
                    while(text.indexOf(match, startIndex) !== -1) {
                        // Determine whether the cursor is in the current occurrence of this string.
                        // Note: We do not support a selection exceeding the bounds of an easychem.
                        var startOuter = text.indexOf(match, startIndex),
                            endOuter = startOuter + match.length,
                            startMatch = (selection.startOffset >= startOuter && selection.startOffset < endOuter),
                            endMatch = (selection.endOffset <= endOuter && selection.endOffset > startOuter);

                        if (startMatch && endMatch) {
                            // This match is in our current position - fetch the innerMatch data.
                            var innerMatch = match.match(pattern);
                            if (innerMatch && innerMatch.length) {
                                // We need the start and end of the inner match for later.
                                var startInner = text.indexOf(innerMatch[1], startOuter),
                                    endInner = startInner + innerMatch[1].length;

                                // We'll be returning the inner match for use in the editor itself.
                                returnValue = innerMatch[1];

                                // Save all data for later.
                                this.sourceEquation = {
                                    // Outer match data.
                                    startOuterPosition: startOuter,
                                    endOuterPosition: endOuter,
                                    outerMatch: match,

                                    // Inner match data.
                                    startInnerPosition: startInner,
                                    endInnerPosition: endInner,
                                    innerMatch: innerMatch
                                };

                                // This breaks out of both Y.Array.find functions.
                                return true;
                            }
                        }

                        // Update the startIndex to match the end of the current match so that we can continue hunting
                        // for further matches.
                        startIndex = endOuter;
                    }
                }, this);
            }
        }, this);

        // We trim the easychem when we load it and then add spaces when we save it.
        if (returnValue !== false) {
            returnValue = returnValue.trim();
        }
        return returnValue;
    },

    /**
     * Handle insertion of a new easychem, or update of an existing one.
     *
     * @method _setEquation
     * @param {EventFacade} e
     * @private
     */
    _setEquation: function(e) {
        var input,
            selectedNode,
            text,
            value,
            host;

        host = this.get('host');

        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        input = e.currentTarget.ancestor('.atto_form').one('textarea');

        value = input.get('value');
        if (value !== '') {
            host.setSelection(this._currentSelection);

            if (this.sourceEquation) {
                // Replace the easychem.
                selectedNode = Y.one(host.getSelectionParentNode());
                text = selectedNode.get('text');
                value = '' + value + '';
                newText =   text.slice(0, this.sourceEquation.startInnerPosition) +
                            value +
                            text.slice(this.sourceEquation.endInnerPosition);

                selectedNode.set('text', newText);
            } else {
                // Insert the new easychem.
                //value = DELIMITERS.START + ' ' + value + ' ' + DELIMITERS.END;
                //value = DELIMITERS.START + '' + value + '' + DELIMITERS.END;
                value = '%' + value + '%';
                host.insertContentAtFocusPoint(value);
            }

            // Clean the YUI ids from the HTML.
            this.markUpdated();
        }
    },

    /**
     * Smart throttle, only call a function every delay milli seconds,
     * and always run the last call. Y.throttle does not work here,
     * because it calls the function immediately, the first time, and then
     * ignores repeated calls within X seconds. This does not guarantee
     * that the last call will be executed (which is required here).
     *
     * @param {function} fn
     * @param {Number} delay Delay in milliseconds
     * @method _throttle
     * @private
     */
    _throttle: function(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
              fn.apply(context, args);
            }, delay);
        };
    },

    /**
     * Update the preview div to match the current easychem.
     *
     * @param {EventFacade} e
     * @method _updatePreview
     * @private
     */
    _updatePreview: function(e) {
        console.log('updatepreview');
        var textarea = this._content.one(SELECTORS.EQUATION_TEXT),
            easychem = textarea.get('value'),
            url,
            preview,
            currentPos = textarea.get('selectionStart'),
//            prefix = '<span class="easyChemConfig auto-compile"></span><div class="echem-formula" align="center">',
//            post = '</div>',
            prefix = '',
            post = '',
            cursorLatex = '',
            isChar,
            params;

        if (e) {
            e.preventDefault();
        }

        // Move the cursor so it does not break expressions.
        // Start at the very beginning.
        if (!currentPos) {
            currentPos = 0;
        }

        // First move back to the beginning of the line.
        while (easychem.charAt(currentPos) === '\\' && currentPos >= 0) {
            currentPos -= 1;
        }
        isChar = /[a-zA-Z\{\}]/;
        if (currentPos !== 0) {
            // Now match to the end of the line.
            while (isChar.test(easychem.charAt(currentPos)) && currentPos < easychem.length && isChar.test(easychem.charAt(currentPos-1))) {
                currentPos += 1;
            }
        }
        // Save the cursor position - for insertion from the library.
        this._lastCursorPos = currentPos;
        
        easychem = prefix + easychem.substring(0, currentPos) + cursorLatex + easychem.substring(currentPos) + post;
//        equation = prefix + equation.substring(0, currentPos) + cursorLatex + equation.substring(currentPos);

        var previewNode = this._content.one(SELECTORS.EQUATION_PREVIEW);
        easychem = DELIMITERS.START + '' + easychem + '' + DELIMITERS.END;
        console.log(easychem);


        // Make an ajax request to the filter.
/*        url = M.cfg.wwwroot + '/lib/editor/atto/plugins/easychem/ajax.php';
        params = {
            sesskey: M.cfg.sesskey,
            contextid: this.get('contextid'),
            action: 'filtertext',
            text: easychem
        };

        preview = Y.io(url, {
            sync: true,
            data: params
        });

        if (preview.status === 200) {
            previewNode.setHTML(preview.responseText);
            Y.fire(M.core.event.FILTER_CONTENT_UPDATED, {nodes: (new Y.NodeList(previewNode))});
        }
*/

        var eid = this.get('host').get('elementid');
        //console.log(eid);
	YUI().use('node', 'easychem', function (Y) {
	   
	    //console.log("here");
	    var src = Y.one('#' + eid + '_atto_easychem_easychem').get('value');
		//console.log(src);
	    var res = ChemSys.compile(src); 
		//console.log(res);

	    //ChemSys.draw($('#res-graph').empty()[0], res);
	    ChemSys.draw(Y.one('#' + eid + '_atto_easychem_preview').empty(), res);

	    /*demo.on('click', function (e) {
		demo.set('text', 'You clicked me!');
	    });  */
	});

    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node}
     * @private
     */
    _getDialogueContent: function() {
        var library = this._getLibraryContent(),
            template = Y.Handlebars.compile(TEMPLATES.FORM);
        console.log('getDialogContent');
        //console.log(library);
        //console.log(library.all('.easychem_library'));
        this._content = Y.Node.create(template({
            elementid: this.get('host').get('elementid'),
            component: COMPONENTNAME,
            library: library,
            texdocsurl: this.get('texdocsurl'),
            CSS: CSS
        }));

        // Sets the default focus.
        this._content.all(SELECTORS.LIBRARY_GROUP).each(function(group) {
            // The first button gets the focus.
            this._setGroupTabFocus(group, group.one('button'));
            // Sometimes the filter adds an anchor in the button, no tabindex on that.
            group.all('button a').setAttribute('tabindex', '-1');
        }, this);

        // Keyboard navigation in groups.
        this._content.delegate('key', this._groupNavigation, 'down:37,39', SELECTORS.LIBRARY_BUTTON, this);

        this._content.one(SELECTORS.SUBMIT).on('click', this._setEquation, this);
        this._content.one(SELECTORS.EQUATION_TEXT).on('valuechange', this._throttle(this._updatePreview, 500), this);
        this._content.one(SELECTORS.EQUATION_TEXT).on('mouseup', this._throttle(this._updatePreview, 500), this);
        this._content.one(SELECTORS.EQUATION_TEXT).on('keyup', this._throttle(this._updatePreview, 500), this);
        this._content.delegate('click', this._selectLibraryItem, SELECTORS.LIBRARY_BUTTON, this);
        //console.log(this._content.all('.easychem_library'));



/*
		YUI().use('node', 'easychem', function (Y) {
                    //console.log(this.get('innerHTML'));
                    buttons = Y.all('.easychem_library').each(function (Y) {

                    //var curtext = Y.get('innerHTML');
      
                    var src = Y.get('innerHTML');
                    //console.log(src.substring(1, 7));
	            if (src.substring(1, 7) != 'canvas') {;
		            src = src.replace("&amp;", "&").replace("&gt;", ">").replace("&lt;", "<");
		      //      console.log('src='+src);
			    var res = ChemSys.compile(src); 
			    ChemSys.draw(Y.empty(), res);
                            //console.log(Y.empty());
                    }
                    });;
                    
                    
		});
*/





        return this._content;
    },

    /**
     * Callback handling the keyboard navigation in the groups of the library.
     *
     * @param {EventFacade} e The event.
     * @method _groupNavigation
     * @private
     */
    _groupNavigation: function(e) {
        e.preventDefault();

        var current = e.currentTarget,
            parent = current.get('parentNode'), // This must be the <div> containing all the buttons of the group.
            buttons = parent.all('button'),
            direction = e.keyCode !== 37 ? 1 : -1,
            index = buttons.indexOf(current),
            nextButton;

        if (index < 0) {
            index = 0;
        }

        index += direction;
        if (index < 0) {
            index = buttons.size() - 1;
        } else if (index >= buttons.size()) {
            index = 0;
        }
        nextButton = buttons.item(index);

        this._setGroupTabFocus(parent, nextButton);
        nextButton.focus();
    },

    /**
     * Sets tab focus for the group.
     *
     * @method _setGroupTabFocus
     * @param {Node} button The node that focus should now be set to.
     * @private
     */
    _setGroupTabFocus: function(parent, button) {
        var parentId = parent.generateID();

        // Unset the previous entry.
        if (typeof this._groupFocus[parentId] !== 'undefined') {
            this._groupFocus[parentId].setAttribute('tabindex', '-1');
        }

        // Set on the new entry.
        this._groupFocus[parentId] = button;
        button.setAttribute('tabindex', 0);
        parent.setAttribute('aria-activedescendant', button.generateID());
    },

    /**
     * Reponse to button presses in the TeX library panels.
     *
     * @method _selectLibraryItem
     * @param {EventFacade} e
     * @return {string}
     * @private
     */
    _selectLibraryItem: function(e) {
        var tex = e.currentTarget.getAttribute('data-tex'),
        oldValue,
        newValue,
        input,
        focusPoint = 0;

        e.preventDefault();

        // Set the group focus on the button.
        this._setGroupTabFocus(e.currentTarget.get('parentNode'), e.currentTarget);

        input = e.currentTarget.ancestor('.atto_form').one('textarea');

        oldValue = input.get('value');

        newValue = oldValue.substring(0, this._lastCursorPos);
        if (newValue.charAt(newValue.length - 1) !== ' ') {
            newValue += ' ';
        }
        newValue += tex;
        focusPoint = newValue.length;

        if (oldValue.charAt(this._lastCursorPos) !== ' ') {
            newValue += ' ';
        }
        newValue += oldValue.substring(this._lastCursorPos, oldValue.length);

        input.set('value', newValue);
        input.focus();

        var realInput = input.getDOMNode();
        if (typeof realInput.selectionStart === "number") {
            // Modern browsers have selectionStart and selectionEnd to control the cursor position.
            realInput.selectionStart = realInput.selectionEnd = focusPoint;
        } else if (typeof realInput.createTextRange !== "undefined") {
            // Legacy browsers (IE<=9) use createTextRange().
            var range = realInput.createTextRange();
            range.moveToPoint(focusPoint);
            range.select();
        }
        // Focus must be set before updating the preview for the cursor box to be in the correct location.
        this._updatePreview(false);
    },

    /**
     * Return the HTML for rendering the library of predefined buttons.
     *
     * @method _getLibraryContent
     * @return {string}
     * @private
     */
    _getLibraryContent: function() {
        console.log('getlibrarycontent');
        var template = Y.Handlebars.compile(TEMPLATES.LIBRARY),
            library = this.get('library'),
            content = '';
        //console.log(library);
        // Helper to iterate over a newline separated string.
        Y.Handlebars.registerHelper('split', function(delimiter, str, options) {
            var parts,
                current,
                out;
            if (typeof delimiter === "undefined" || typeof str === "undefined") {
                return '';
            }
            //console.log(options);
            //console.log('str='+str);
            out = '';
            parts = str.trim().split(delimiter);
            //console.log('here');
            //console.log(parts);
////here we use easychem.js and convert

           var partsLength = parts.length;
	
	   
	    //console.log("here");
	    
		//console.log(res);

		/*for (var i = 0; i < partsLength; i++) {
    		
                //console.log(parts[i]);
		var src = parts[i];

                src = src.replace(/(\r\n|\n|\r)/gm, "");


		//console.log(src);
                YUI().use('node', 'easychem', function (Y) {
	    	var res = ChemSys.compile(src); 
	        //ChemSys.draw(Y.one('#' + eid + '_atto_easychem_preview').empty(), res);
	        ChemSys.draw(Y.one('#' + 'id_page' + '_atto_easychem_preview').empty(), res);
                //console.log(parts[i]);
                }); 
    		//Do something
		} 
                */
	    //ChemSys.draw($('#res-graph').empty()[0], res);
            //console.log(parts);
	
            //console.log('here2');
            //console.log(parts);

            while (parts.length > 0) {
                current = parts.shift().trim();
                out += options.fn(current);
            }

		var parser = new DOMParser();
		var domout = parser.parseFromString(out, "application/xml");
            //console.log(out.one('easychem_library'));
            return out;
        });

        //console.log(library);


        content = template({
            elementid: this.get('host').get('elementid'),
            component: COMPONENTNAME,
            library: library,
            CSS: CSS,
            DELIMITERS: DELIMITERS
        });

  /*      var url = M.cfg.wwwroot + '/lib/editor/atto/plugins/easychem/ajax.php';
        var params = {
            sesskey: M.cfg.sesskey,
            contextid: this.get('contextid'),
            action: 'filtertext',
            text: content
        };

        preview = Y.io(url, {
            sync: true,
            data: params,
            method: 'POST'
        });

        if (preview.status === 200) {
            content = preview.responseText;
        }
*/

//console.log(content);


        return content;
    }
}, {
    ATTRS: {
        /**
         * Whether the TeX filter is currently active.
         *
         * @attribute texfilteractive
         * @type Boolean
         */
        texfilteractive: {
            value: false
        },

        /**
         * The contextid to use when generating this preview.
         *
         * @attribute contextid
         * @type String
         */
        contextid: {
            value: null
        },

        /**
         * The content of the example library.
         *
         * @attribute library
         * @type object
         */
        library: {
            value: {}
        },

        /**
         * The link to the Moodle Docs page about TeX.
         *
         * @attribute texdocsurl
         * @type string
         */
        texdocsurl: {
            value: null
        }

    }
});


}, '@VERSION@', {
    "requires": [
        "moodle-editor_atto-plugin",
        "moodle-core-event",
        "io",
        "event-valuechange",
        "tabview",
        "array-extras"
    ]
});
